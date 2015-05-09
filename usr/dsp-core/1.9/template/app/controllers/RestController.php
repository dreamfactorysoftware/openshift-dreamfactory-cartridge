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
use DreamFactory\Platform\Enums\DataFormats;
use DreamFactory\Platform\Exceptions\BadRequestException;
use DreamFactory\Platform\Exceptions\NotFoundException;
use DreamFactory\Platform\Resources\User\Session;
use DreamFactory\Platform\Utility\DataFormatter;
use DreamFactory\Platform\Utility\RestResponse;
use DreamFactory\Platform\Utility\ServiceHandler;
use DreamFactory\Platform\Yii\Models\Service;
use DreamFactory\Yii\Controllers\BaseFactoryController;
use DreamFactory\Yii\Utility\Pii;
use Kisma\Core\Enums\HttpMethod;
use Kisma\Core\Utility\Option;
use Symfony\Component\HttpFoundation\Request;

/**
 * RestController
 * REST API router and controller
 */
class RestController extends BaseFactoryController
{
    //*************************************************************************
    //	Members
    //*************************************************************************

    /**
     * @var string service to direct call to
     */
    protected $_service;
    /**
     * @var string resource to be handled by service
     */
    protected $_resource;
    /**
     * @var Request The inbound request
     */
    protected $_requestObject;

    //*************************************************************************
    //	Methods
    //*************************************************************************

    /**
     * Initialize controller and populate request object
     */
    public function init()
    {
        parent::init();

        $this->_requestObject = Pii::requestObject();
    }

    /**
     * @param string $actionId
     *
     * @throws DreamFactory\Platform\Exceptions\NotFoundException
     */
    public function missingAction( $actionId = null )
    {
        try
        {
            parent::missingAction( $actionId );
        }
        catch ( CHttpException $_ex )
        {
            throw new NotFoundException();
        }
    }

    /**
     * All authorization handled by services
     *
     * @return array
     */
    public function accessRules()
    {
        return array();
    }

    /**
     * /rest/index
     */
    public function actionIndex()
    {
        try
        {
            // require admin currently to list APIs
            Session::checkServicePermission( HttpMethod::GET, null );
            $_result = array('service' => Service::available( false, array('name', 'api_name') ));

            $_outputFormat = RestResponse::detectResponseFormat( null, $_internal );
            $_result = DataFormatter::reformatData( $_result, null, $_outputFormat );

            RestResponse::sendResults( $_result, RestResponse::Ok, $_outputFormat );
        }
        catch ( \Exception $_ex )
        {
            RestResponse::sendErrors( $_ex );
        }
    }

    /**
     * {@InheritDoc}
     */
    public function actionGet()
    {
        $this->_handleAction( HttpMethod::GET );
    }

    /**
     * {@InheritDoc}
     */
    public function actionPost()
    {
        $_action = HttpMethod::POST;

        try
        {
            //	Check for verb tunneling via overriding headers
            //  X-HTTP-Method (Microsoft)
            //  X-HTTP-Method-Override (Google/GData)
            //  X-METHOD-OVERRIDE (IBM)
            $_tunnelMethod = strtoupper(
                $this->_requestObject->headers->get(
                    'x-http-method',
                    $this->_requestObject->headers->get(
                        'x-http-method-override',
                        $this->_requestObject->headers->get(
                            'x-method-override',
                            $this->_requestObject->get( 'method' )
                        )
                    )
                )
            );

            if ( !empty( $_tunnelMethod ) )
            {
                if ( !HttpMethod::contains( $_tunnelMethod ) )
                {
                    throw new BadRequestException( 'Invalid verb "' . $_tunnelMethod . '" in request.' );
                }

                $_action = $_tunnelMethod;
            }

            $this->_handleAction( $_action );
        }
        catch ( \Exception $ex )
        {
            RestResponse::sendErrors( $ex );
        }
    }

    /**
     * {@InheritDoc}
     */
    public function actionPut()
    {
        $this->_handleAction( HttpMethod::PUT );
    }

    /**
     * {@InheritDoc}
     */
    public function actionPatch()
    {
        $this->_handleAction( HttpMethod::PATCH );
    }

    /**
     * {@InheritDoc}
     */
    public function actionMerge()
    {
        $this->_handleAction( HttpMethod::MERGE );
    }

    /**
     * {@InheritDoc}
     */
    public function actionDelete()
    {
        $this->_handleAction( HttpMethod::DELETE );
    }

    /**
     * Generic action handler
     *
     * @param string $action
     *
     * @return mixed
     */
    protected function _handleAction( $action )
    {
        try
        {
            $_service = ServiceHandler::getService( $this->_service );

            return $_service->processRequest( $this->_resource, $action );
        }
        catch ( \Exception $ex )
        {
            RestResponse::sendErrors(
                $ex,
                isset( $_service ) ? $_service->getOutputFormat() : DataFormats::JSON,
                false,
                false
            );

            return null;
        }
    }

    /**
     * Override base method to do some processing of incoming requests.
     *
     * Fixes the slash at the end of the parsed path. Yii removes the trailing
     * slash by default. However, some DSP APIs require it to determine the
     * difference between a file and a folder.
     *
     * Routes look like this:        rest/<service:[_0-9a-zA-Z-]+>/<resource:[_0-9a-zA-Z-\/. ]+>
     *
     * @param \CAction $action
     *
     * @return bool
     * @throws Exception
     */
    protected function beforeAction( $action )
    {
        if ( false === ( $slashIndex = strpos( $path = Option::get( $_GET, 'path' ), '/' ) ) )
        {
            $this->_service = $path;
        }
        else
        {
            $this->_service = substr( $path, 0, $slashIndex );
            $this->_resource = substr( $path, $slashIndex + 1 );

            // fix removal of trailing slashes from resource
            if ( !empty( $this->_resource ) )
            {
                $requestUri = Yii::app()->request->requestUri;
                if ( ( false === strpos( $requestUri, '?' ) &&
                       '/' === substr( $requestUri, strlen( $requestUri ) - 1, 1 ) ) ||
                     ( '/' === substr( $requestUri, strpos( $requestUri, '?' ) - 1, 1 ) )
                )
                {
                    $this->_resource .= '/';
                }
            }
        }

        return parent::beforeAction( $action );
    }

    /**
     * @param string $resource
     *
     * @return RestController
     */
    public function setResource( $resource )
    {
        $this->_resource = $resource;

        return $this;
    }

    /**
     * @return string
     */
    public function getResource()
    {
        return $this->_resource;
    }

    /**
     * @param string $service
     *
     * @return RestController
     */
    public function setService( $service )
    {
        $this->_service = $service;

        return $this;
    }

    /**
     * @return string
     */
    public function getService()
    {
        return $this->_service;
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Request
     */
    public function getRequestObject()
    {
        return $this->_requestObject;
    }

}
