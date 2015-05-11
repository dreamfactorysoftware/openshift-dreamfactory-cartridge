<?php
/**
 * This file is part of the DreamFactory Services Platform(tm) (DSP)
 *
 * DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
 * Copyright 2012-2014 DreamFactory Software, Inc. <support@dreamfactory.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
use DreamFactory\Oasys\Oasys;
use DreamFactory\Platform\Exceptions\BadRequestException;
use DreamFactory\Platform\Resources\User\Session;
use DreamFactory\Platform\Utility\Platform;
use DreamFactory\Platform\Utility\ResourceStore;
use DreamFactory\Platform\Yii\Models\BasePlatformSystemModel;
use DreamFactory\Platform\Yii\Models\Provider;
use DreamFactory\Yii\Controllers\BaseWebController;
use DreamFactory\Yii\Utility\Pii;
use Kisma\Core\Enums\HttpResponse;
use Kisma\Core\Utility\FilterInput;
use Kisma\Core\Utility\Inflector;
use Kisma\Core\Utility\Option;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * ALPHA! Use at your own risk
 * ==================================================
 * Performs various system-level administrative tasks
 */
class ConsoleController extends BaseWebController
{
    //*************************************************************************
    //* Members
    //*************************************************************************

    /**
     * @var array The command map for console/cache
     */
    protected static $_cacheCommandMap = array();

    //*************************************************************************
    // Methods
    //*************************************************************************

    /**
     * {@InheritDoc}
     */
    public function init()
    {
        //  Admins only!
        if ( !Session::isSystemAdmin() )
        {
            throw new \CHttpException( HttpResponse::Forbidden, 'Access Denied.' );
        }

        parent::init();

        //	We want merged update/create...
        $this->setSingleViewMode( true );

        $this->layout = 'mobile';
        $this->defaultAction = 'index';

        //	Everything is auth-required
        $this->addUserActions(
            static::Authenticated,
            array( 'cache', 'index', 'update', 'error', 'create' )
        );

        //  Set the command map
        static::$_cacheCommandMap = array(
            'flush' => function ()
            {
                return Platform::storeDeleteAll();
            }
        );
    }

    /**
     * Dumps Instance Configuration
     */
    public function actionDump()
    {
        $this->render(
            'dump',
            array(
                'yii_params' => Pii::params(),
            )
        );
    }

    /**
     * @param string $command POSTs to /console/cache/[command] to perform various cache operations.
     *                        Currently, the only operation available at this time is "flush",
     *                        which clears the cache for the core.
     *
     *                        Example: POST http://dsp.local/console/cache/flush
     *
     * @return bool
     * @throws \CHttpException
     */
    public function actionCache( $command )
    {
        if ( null === ( $_result = Option::get( static::$_cacheCommandMap, $command ) ) )
        {
            throw new \CHttpException( HttpResponse::BadRequest, 'Invalid command "' . $command . '"' );
        }

        $this->layout = false;
        $_result = static::$_cacheCommandMap[ $command ];

        $_response = new JsonResponse(
            array(
                'command' => $command,
                'success' => $_result,
            )
        );

        $_response->send();

        return Pii::end();
    }

    /**
     * @param array $options
     * @param bool  $fromCreate
     *
     * @throws DreamFactory\Platform\Exceptions\BadRequestException
     */
    public function actionUpdate( $options = array(), $fromCreate = false )
    {
        $_id = $_schema = $_errors = null;

        //	New provider
        if ( false !== $fromCreate && null !== ( $_resourceId = FilterInput::request( 'resource' ) ) )
        {
            //	New request
            $_model = ResourceStore::model( $_resourceId );
            $_displayName = Inflector::display( $_resourceId );
            $_schema = $this->_loadConfigSchema( $_resourceId, $_model->hasAttribute( 'config_text' ) ? $_model->config_text : array() );
        }
        //	Existing
        else
        {
            //	Requests will come in like: /admin/update/<resource>/<id>
            list( $_resourceId, $_id ) = $this->_parseRequest();
            $_displayName = Inflector::display( $_resourceId );

            //	Load it up.
            /** @var $_model BasePlatformSystemModel */
            if ( null !== ( $_model = ResourceStore::model( $_resourceId )->findByPk( $_id ) ) )
            {
                $_schema = $this->_loadConfigSchema( $_resourceId, $_model->hasAttribute( 'config_text' ) ? $_model->config_text : array() );

                if ( Pii::postRequest() )
                {
                    //	On a post, update
                    if ( null === ( $_data = Option::get( $_POST, $_displayName ) ) )
                    {
                        throw new BadRequestException( 'No payload received.' );
                    }

                    /** @var Provider $_model */
                    if ( $_model->hasAttribute( 'config_text' ) )
                    {
                        $_len = strlen( static::SCHEMA_PREFIX );
                        $_config = Option::clean( $_model->config_text );

                        foreach ( $_data as $_key => $_value )
                        {
                            if ( static::SCHEMA_PREFIX == substr( $_key, 0, $_len ) )
                            {
                                $_newKey = str_replace( static::SCHEMA_PREFIX, null, $_key );

                                if ( isset( $_config[ $_newKey ] ) )
                                {
                                    $_config[ $_newKey ] = $_value;
                                }

                                unset( $_data[ $_key ] );
                            }
                        }

                        $_model->config_text = $_config;
                        unset( $_data['config_text'] );
                    }

                    $_model->setAttributes( $_data );
                    $_model->save();

                    Pii::setState( 'status_message', 'Resource Updated Successfully' );

                    $this->redirect( '/admin/' . $_resourceId . '/update/' . $_id );
                }
            }

            if ( $_model->hasAttribute( 'name' ) )
            {
                $_displayName = $_model->name;
            }
            else if ( $_model->hasAttribute( 'provider_name' ) )
            {
                $_displayName = $_model->provider_name;
            }
            else if ( $_model->hasAttribute( 'api_name' ) )
            {
                $_displayName = $_model->api_name;
            }
        }

        $this->render(
            'update',
            array(
                'model'        => $_model,
                'schema'       => $_schema,
                'errors'       => $_errors,
                'resourceName' => $_resourceId,
                'displayName'  => $_displayName,
                'update'       => ( null !== $_id ),
            )
        );
    }

    /**
     *
     */
    public function actionIndex()
    {
        static $_resourceColumns = array(
            'app'       => array(
                'header'       => 'Installed Applications',
                'display_name' => 'Application',
                'resource'     => 'app',
                'fields'       => array( 'id', 'api_name', 'url', 'is_active' ),
                'labels'       => array( 'ID', 'Name', 'Starting Path', 'Active' )
            ),
            'app_group' => array(
                'header'       => 'Application Groups',
                'resource'     => 'app_group',
                'display_name' => 'Application Group',
                'fields'       => array( 'id', 'name', 'description' ),
                'labels'       => array( 'ID', 'Name', 'Description' )
            ),
            'user'      => array(
                'header'       => 'Users',
                'display_name' => 'User',
                'resource'     => 'user',
                'fields'       => array( 'id', 'email', 'first_name', 'last_name', 'created_date' ),
                'labels'       => array( 'ID', 'Email', 'First Name', 'Last Name', 'Created' )
            ),
            'role'      => array(
                'header'       => 'Roles',
                'display_name' => 'Role',
                'resource'     => 'role',
                'fields'       => array( 'id', 'name', 'description', 'is_active' ),
                'labels'       => array( 'ID', 'Name', 'Description', 'Active' )
            ),
            'data'      => array(
                'header'   => 'Data',
                'resource' => 'db',
                'fields'   => array(),
                'labels'   => array(),
            ),
            'event'     => array(
                'header'   => 'Event Manager',
                'resource' => 'event',
                'fields'   => array( 'id', 'event_name', 'listeners', ),
                'labels'   => array( 'ID', 'Event Name', 'Listeners', ),
            ),
            'service'   => array(
                'header'       => 'Services',
                'display_name' => 'Service',
                'resource'     => 'service',
                'fields'       => array( 'id', 'api_name', 'type_id', 'storage_type_id', 'is_active' ),
                'labels'       => array( 'ID', 'Endpoint', 'Type', 'Storage Type', 'Active' ),
            ),
            'schema'    => array(
                'header'   => 'Schema Manager',
                'resource' => 'schema',
                'fields'   => array(),
                'labels'   => array(),
            ),
            'script'    => array(
                'header'   => 'Script Manager',
                'resource' => 'script',
                'fields'   => array( 'script_id', 'script_body' ),
                'labels'   => array( 'ID', 'Body' ),
            ),
            'config'    => array(
                'header'   => 'System Configuration',
                'resource' => 'config',
                'fields'   => array(),
                'labels'   => array(),
            ),
            'provider'  => array(
                'header'       => 'Service Providers',
                'display_name' => 'Provider',
                'resource'     => 'provider',
                'fields'       => array( 'id', 'provider_name', 'api_name' ),
                'labels'       => array( 'ID', 'Name', 'Endpoint' ),
            ),
        );

        foreach ( $_resourceColumns as $_resource => &$_config )
        {
            if ( !isset( $_config['columns'] ) )
            {
                if ( isset( $_config['fields'] ) )
                {
                    $_config['columns'] = array();

                    foreach ( $_config['fields'] as $_field )
                    {
                        $_config['columns'][] = array( 'sName' => $_field );
                    }

                    $_config['fields'] = implode( ',', $_config['fields'] );
                }
            }
        }

        $this->render( 'index', array( 'resourceColumns' => $_resourceColumns ) );
    }

    /**
     * Merges any configuration schema with model data
     *
     * @param string $providerId The API name of the provider
     * @param array  $configData
     *
     * @return array|null
     */
    protected function _loadConfigSchema( $providerId, $configData = array() )
    {
        $_schema = null;

        switch ( $providerId )
        {
            case 'provider':
                /** @var Provider $model */
                $_schema = Oasys::getProvider( $providerId )->getConfig()->getSchema();
                break;
        }

        //	Merge
        if ( !empty( $_schema ) )
        {
            $_config = !empty( $configData ) ? $configData : array();

            //	Load the resource into the schema for a goof
            foreach ( $_schema as $_key => $_value )
            {
                if ( null !== ( $_configValue = Option::get( $_config, $_key ) ) )
                {
                    if ( is_array( $_configValue ) )
                    {
                        $_configValue = implode( ', ', $_configValue );
                    }

                    $_value['value'] = $_configValue;
                }

                $_schema[ static::SCHEMA_PREFIX . $_key ] = $_value;

                unset( $_schema[ $_key ] );
            }
        }

        return $_schema;
    }

    /**
     * @return array
     * @throws DreamFactory\Platform\Exceptions\BadRequestException
     */
    protected function _parseRequest()
    {
        $_resourceId = strtolower( trim( FilterInput::request( 'resource', null, FILTER_SANITIZE_STRING ) ) );
        $_id = FilterInput::request( 'id', null, FILTER_SANITIZE_STRING );

        if ( empty( $_resourceId ) || ( empty( $_resourceId ) && empty( $_id ) ) )
        {
            throw new BadRequestException( 404, 'Not found.' );
        }

        //	Handle a plural request
        if ( false !== ( $_tempId = Inflector::isPlural( $_resourceId, true ) ) )
        {
            $_resourceId = $_tempId;
        }

        $this->setModelClass( 'DreamFactory\\Platform\\Yii\\Models\\' . Inflector::deneutralize( $_resourceId ) );

        return array( $_resourceId, $_id );
    }

}
