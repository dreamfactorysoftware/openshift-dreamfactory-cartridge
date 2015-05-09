<?php
/**
 * This file is part of the DreamFactory Services Platform(tm) (DSP)
 *
 * DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
 * Copyright 2012-2013 DreamFactory Software, Inc. <developer-support@dreamfactory.com>
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
use DreamFactory\Platform\Utility\Fabric;
use Kisma\Core\Utility\Log;

/**
 * console.php
 * This is the main configuration file for the DreamFactory Services Platform server console.
 */
if ( !defined( 'DSP_VERSION' ) && file_exists( __DIR__ . '/constants.config.php' ) )
{
    require __DIR__ . '/constants.config.php';
}

$_configFileList = array(
    'dbConfig'     => array(true, 'database'),
    'commonConfig' => array(true, 'common'),
);

/**
 * Load any environment variables first thing as they may be used by the database config
 */
if ( file_exists( __DIR__ . '/env.config.php' ) )
{
    /** @noinspection PhpIncludeInspection */
    if ( false !== ( $_envConfig = @require( __DIR__ . '/env.config.php' ) ) &&
        !empty( $_envConfig ) &&
        is_array( $_envConfig )
    )
    {
        foreach ( $_envConfig as $_envVar )
        {
            if ( false === putenv( $_envVar ) )
            {
                Log::error( 'Error setting environment variable: ' . $_envVar );
            }
        }
    }
}

/**
 * Load up the common configurations between the web and background apps,
 * setting globals whilst at it.
 */
$_commonConfig = require( __DIR__ . '/common.config.php' );

/**
 * Load up the database configuration, free edition, private hosted, or others.
 * Look for non-default database config to override.
 */
$_dbConfig = array();
if ( file_exists( __DIR__ . '/database.config.php' ) )
{
    /** @noinspection PhpIncludeInspection */
    $_dbConfig = @require( __DIR__ . '/database.config.php' );
}
else
{
    if ( Fabric::fabricHosted() )
    {
        list( $_dbConfig, $_metadata ) = Fabric::initialize();
        $_commonConfig['dsp.metadata'] = $_metadata;
    }
    else
    {
        /**
         * Database names vary by type of DSP:
         *
         *        1. Free Edition/Hosted:   DSP name
         *        2. Hosted Private:        hpp_<DSP Name>
         *        3. All others:            dreamfactory or whatever is in non-default config.
         */

        if ( false !== ( $_host = Fabric::hostedPrivatePlatform( true ) ) )
        {
            $_dbName =
                'hpp_' .
                str_ireplace( array('.dreamfactory.com', '-', '.cloud', '.'), array(null, '_', null, '_'), $_host );
        }
        else
        {
            $_dbName = 'dreamfactory';
        }

        // default config for local database
        $_dbConfig = array(
            'connectionString'      => 'mysql:host=localhost;port=3306;dbname=' . $_dbName,
            'username'              => 'dsp_user',
            'password'              => 'dsp_user',
            'emulatePrepare'        => true,
            'charset'               => 'utf8',
            'enableProfiling'       => defined( 'YII_DEBUG' ),
            'enableParamLogging'    => defined( 'YII_DEBUG' ),
            'schemaCachingDuration' => 3600,
        );
    }
}

//.........................................................................
//. The configuration
//.........................................................................

return array(
    /**
     * Basics
     */
    'basePath'           => $_basePath . '/app',
    'name'               => $_appName,
    'runtimePath'        => $_logFilePath,
    /**
     * Service Handling: The default system resource namespaces
     *
     * @todo have ResourceStore::resource() scan sub-directories based on $_REQUEST['path']  -- GHA
     */
    'resourceNamespaces' => array(
        'DreamFactory\\Platform\\Resources',
        'DreamFactory\\Platform\\Resources\\System',
        'DreamFactory\\Platform\\Resources\\User',
    ),
    /**
     * Service Handling: The default system model namespaces
     *
     * @todo have ResourceStore::model() scan sub-directories based on $_REQUEST['path'] -- GHA
     */
    'modelNamespaces'    => array(
        'DreamFactory\\Platform\\Yii\\Models',
    ),
    /**
     * Preloads
     */
    'preload'            => array('log', 'db', 'urlManager'),
    /**
     * Imports
     */
    'import'             => array(
        'system.utils.*',
        'application.models.*',
        'application.models.forms.*',
        'application.components.*',
    ),
    /**
     * Modules
     */
    'modules'            => array(),
    //.........................................................................
    //. Command Mapping
    //.........................................................................

    'commandMap'         => array(
        'events' => array(
            'class' => 'DreamFactory\\Platform\\Yii\\Commands\\EventStreamCommand',
        ),
    ),
    /**
     * Components
     */
    'components'         => array(
        //	Asset management
        'assetManager' => array(
            'class'      => 'CAssetManager',
            'basePath'   => $_docRoot . '/assets',
            'baseUrl'    => '/assets',
            'linkAssets' => true,
        ),
        //	Database configuration
        'db'           => $_dbConfig,
        //	Error management
        'errorHandler' => array(
            'errorAction' => $_defaultController . '/error',
        ),
        //	Route configuration
        'urlManager'   => array(
            'caseSensitive'  => false,
            'urlFormat'      => 'path',
            'showScriptName' => false,
            'rules'          => array(
                // REST patterns
                array('rest/get', 'pattern' => 'rest/<path:[_0-9a-zA-Z-\/. ]+>', 'verb' => 'GET'),
                array('rest/post', 'pattern' => 'rest/<path:[_0-9a-zA-Z-\/. ]+>', 'verb' => 'POST'),
                array('rest/put', 'pattern' => 'rest/<path:[_0-9a-zA-Z-\/. ]+>', 'verb' => 'PUT'),
                array('rest/patch', 'pattern' => 'rest/<path:[_0-9a-zA-Z-\/. ]+>', 'verb' => 'PATCH'),
                array('rest/merge', 'pattern' => 'rest/<path:[_0-9a-zA-Z-\/. ]+>', 'verb' => 'MERGE'),
                array('rest/delete', 'pattern' => 'rest/<path:[_0-9a-zA-Z-\/. ]+>', 'verb' => 'DELETE'),
                // Other controllers
                '<controller:\w+>/<id:\d+>'              => '<controller>/view',
                '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                '<controller:\w+>/<action:\w+>'          => '<controller>/<action>',
                // fall through to storage services for direct access
                array(
                    'admin/<action>',
                    'pattern' => 'admin/<resource:[_0-9a-zA-Z-]+>/<action>/<id:[_0-9a-zA-Z-\/. ]+>'
                ),
                array(
                    'storage/get',
                    'pattern' => '<service:[_0-9a-zA-Z-]+>/<path:[_0-9a-zA-Z-\/. ]+>',
                    'verb'    => 'GET'
                ),
            ),
        ),
        //	User configuration
        'user'         => array(
            'allowAutoLogin' => true,
            'loginUrl'       => array($_defaultController . '/login'),
        ),
        'clientScript' => array(
            'scriptMap' => array(
                'jquery.js'     => false,
                'jquery.min.js' => false,
            ),
        ),
        //	Logging configuration
        'log'          => array(
            'class'  => 'CLogRouter',
            'routes' => array(
                array(
                    'class'       => 'DreamFactory\\Yii\\Logging\\LiveLogRoute',
                    'maxFileSize' => '102400',
                    'logFile'     => $_logFileName,
                    'logPath'     => $_logFilePath,
                    'levels'      => 'error, warning, info, debug, notice',
                ),
            ),
        ),
        //	Database Cache
        'cache'        => $_dbCache,
    ),
    //.........................................................................
    //. Global application parameters
    //.........................................................................

    'params'             => $_commonConfig,
);
