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
use DreamFactory\Library\Utility\Includer;
use DreamFactory\Platform\Enums\InstallationTypes;
use DreamFactory\Platform\Enums\LocalStorageTypes;
use Kisma\Core\Enums\LoggingLevels;

/**
 * This file contains any application-level parameters that are to be shared between the background and web services
 *
 * NOTE:   If you make changes to this file they will probably be lost
 *         during the next system update/upgrade.
 */
/** @noinspection PhpIncludeInspection */
require __DIR__ . CONSTANTS_CONFIG_PATH;

//*************************************************************************
//* Global Configuration Settings
//*************************************************************************

//  The installation type
$_installType = InstallationTypes::determineType( false, $_installName );
//  Special fabric-hosted indicator
$_fabricHosted = ( InstallationTypes::FABRIC_HOSTED == $_installType );
//	The base path of the project, where it's checked out basically
$_basePath = dirname( __DIR__ );
//	The document root
$_docRoot = $_basePath . '/web';
//	The vendor path
$_vendorPath = $_basePath . '/vendor';
//	Set to false to disable database caching
$_dbCacheEnabled = true;
//	The name of the default controller. "site" just sucks
$_defaultController = 'web';
//	Where the log files go and the name...
$_logFilePath = $_basePath . '/log';
$_logFileName = basename( \Kisma::get( 'app.log_file_name' ) );
//  Finally the name of our app
$_appName = 'DreamFactory Services Platform';

//  Ensure the assets path exists so Yii doesn't puke.
$_assetsPath = $_docRoot . '/assets';

if ( !is_dir( $_assetsPath ) )
{
    @mkdir( $_assetsPath, 0777, true );
}

/**
 * Keys and salts
 */
$_dspSalts = array();

//  Load some keys
$_keys = Includer::includeIfExists( __DIR__ . KEYS_CONFIG_PATH, true ) ?: array();

/** @noinspection PhpIncludeInspection */
if ( false !== ( $_salts = Includer::includeIfExists( __DIR__ . SALT_CONFIG_PATH, true ) ) )
{
    if ( !empty( $_salts ) )
    {
        foreach ( $_salts as $_key => $_salt )
        {
            if ( $_salt )
            {
                $_dspSalts['dsp.salts.' . $_key] = $_salt;
            }
        }
    }

    unset( $_salts );
}

/**
 * Application Paths
 */
\Kisma::set(
    array(
        'app.app_name'      => $_appName,
        'app.project_root'  => $_basePath,
        'app.vendor_path'   => $_vendorPath,
        'app.log_path'      => $_logFilePath,
        'app.log_file_name' => $_logFileName,
        'app.install_type'  => array($_installType => $_installName),
        'app.fabric_hosted' => $_fabricHosted,
        'app.doc_root'      => $_docRoot,
    )
);

/**
 * Database Caching
 */
$_dbCache = $_dbCacheEnabled ? array(
    'class'                => 'CDbCache',
    'connectionID'         => 'db',
    'cacheTableName'       => 'df_sys_cache',
    'autoCreateCacheTable' => true,
) : null;

$_storageKey = \Kisma::get( 'platform.storage_key' );

/**
 * Set up and return the common settings...
 */
if ( $_fabricHosted )
{
    $_storagePath = $_storageBasePath = LocalStorageTypes::FABRIC_STORAGE_BASE_PATH . '/' . $_storageKey;
    $_privatePath = \Kisma::get( 'platform.private_path' );
    $_storagePath = $_storageBasePath . ( version_compare( DSP_VERSION, '2.0.0', '<' ) ? '/blob' : null );

    $_identity = array(
        'dsp.storage_id'         => $_storageKey,
        'dsp.private_storage_id' => \Kisma::get( 'platform.private_storage_key' ),
        'dsp_name'               => \Kisma::get( 'platform.dsp_name' ),
    );
}
else
{
    $_storagePath = $_storageBasePath = $_basePath . LocalStorageTypes::LOCAL_STORAGE_BASE_PATH;
    $_privatePath = $_basePath . '/storage/.private';

    $_identity = array(
        'dsp.storage_id'         => null,
        'dsp.private_storage_id' => null,
        'dsp_name'               => \Kisma::get( 'platform.host_name' ),
    );
}

//	Merge the common junk with specifics
$_instanceSettings = array_merge(
    $_identity,
    array(
        LocalStorageTypes::STORAGE_BASE_PATH   => $_storageBasePath,
        LocalStorageTypes::STORAGE_PATH        => $_storagePath,
        LocalStorageTypes::PRIVATE_PATH        => $_privatePath,
        LocalStorageTypes::LOCAL_CONFIG_PATH   => $_privatePath . '/config',
        LocalStorageTypes::PRIVATE_CONFIG_PATH => $_privatePath . '/config',
        LocalStorageTypes::SNAPSHOT_PATH       => $_privatePath . '/snapshots',
        LocalStorageTypes::APPLICATIONS_PATH   => $_storagePath . '/applications',
        LocalStorageTypes::LIBRARY_PATH        => $_storagePath . '/plugins',
        LocalStorageTypes::PLUGINS_PATH        => $_storagePath . '/plugins',
        LocalStorageTypes::SWAGGER_PATH        => $_storagePath . '/swagger',
    )
);

//	Keep these out of the global space
unset( $_storageBasePath, $_storagePath, $_privatePath, $_identity, $_storageKey );

/** @noinspection PhpIncludeInspection */
return array_merge(
    $_instanceSettings,
    array(
        //******************************************************************************
        //* Platform-wide Settings
        //******************************************************************************
        'platform.timestamp_format'     => 'Y-m-d H:i:s',
        //******************************************************************************
        //* Application-wide Settings
        //******************************************************************************
        /** The base path */
        'app.base_path'                 => $_basePath,
        /** The private path */
        'app.private_path'              => $_basePath . $_instanceSettings[LocalStorageTypes::PRIVATE_PATH],
        /** The plugins path */
        'app.plugins_path'              => $_basePath . $_instanceSettings[LocalStorageTypes::PLUGINS_PATH],
        /** Enable/disable the internal profiler */
        'app.enable_profiler'           => false,
        //  I do not believe this is being utilized
        'app.debug_level'               => LoggingLevels::WARNING,
        //******************************************************************************
        //* DSP and Application General Settings
        //******************************************************************************
        /** App Information */
        'base_path'                     => $_basePath,
        /** DSP Information */
        'dsp.version'                   => DSP_VERSION,
        'dsp.auth_endpoint'             => DEFAULT_INSTANCE_AUTH_ENDPOINT,
        'dsp.fabric_hosted'             => $_fabricHosted,
        'dsp.no_persistent_storage'     => false,
        'cloud.endpoint'                => DEFAULT_CLOUD_API_ENDPOINT,
        'dsp.metadata_endpoint'         => DEFAULT_METADATA_ENDPOINT,
        /** OAuth salt */
        'oauth.salt'                    => 'rW64wRUk6Ocs+5c7JwQ{69U{]MBdIHqmx9Wj,=C%S#cA%+?!cJMbaQ+juMjHeEx[dlSe%h%kcI',
        //  Any keys included from config/keys.config.php
        'keys'                          => $_keys,
        /** Remote Logins */
        'dsp.allow_remote_logins'       => false,
        'dsp.allow_admin_remote_logins' => false,
        /** Hosts to be treated as hosted private platforms */
        'dsp.hpp_hosts'                 => array(),
        /** User data */
        'adminEmail'                    => DEFAULT_SUPPORT_EMAIL,
        /** Default services */
        'dsp.service_config'            => require( __DIR__ . SERVICES_CONFIG_PATH ),
        /** Array of namespaces to locations for service discovery */
        'dsp.service_location_map'      => array(),
        /** Default services provided by all DSPs */
        'dsp.default_services'          => array(
            array('api_name' => 'user', 'name' => 'User Login'),
            array('api_name' => 'system', 'name' => 'System Configuration'),
            array('api_name' => 'api_docs', 'name' => 'API Documentation'),
        ),
        /** The type of installation */
        'dsp.install_type'              => $_installType,
        'dsp.install_name'              => $_installName,
        /** @var array An array of http verbs that are to not be used (i.e. array( 'PATCH', 'MERGE').
         * IBM Bluemix doesn't allow PATCH...
         */
        'dsp.restricted_verbs'          => InstallationTypes::getRestrictedVerbs( $_installType ),
        /** The default application to start */
        'dsp.default_app'               => DEFAULT_ADMIN_APP_PATH . '/index.html',
        /** The old default landing pages for email confirmations
         * 'dsp.confirm_invite_url'        => '/' . $_defaultController . '/confirmInvite',
         * 'dsp.confirm_register_url'      => '/' . $_defaultController . '/confirmRegister',
         * 'dsp.confirm_reset_url'         => '/' . $_defaultController . '/confirmPassword',
         */
        /** New admin app landing pages for email confirmations */
        'dsp.confirm_invite_url'        => DEFAULT_ADMIN_APP_PATH . '/#/user-invite',
        'dsp.confirm_register_url'      => DEFAULT_ADMIN_APP_PATH . '/#/register-confirm',
        'dsp.confirm_reset_url'         => DEFAULT_ADMIN_APP_PATH . '/#/reset-password',
        /** The default number of records to return at once for database queries */
        'dsp.db_max_records_returned'   => 1000,
        //-------------------------------------------------------------------------
        //	Date and Time Format Options
        //  The default date and time formats used for in and out requests for
        //  all database services, including stored procedures and system service resources.
        //  Default values of null means no formatting is performed on date and time field values.
        //  For options see https://github.com/dreamfactorysoftware/dsp-core/wiki/Database-Date-Time-Formats
        //  Examples: 'm/d/y h:i:s A' or 'c' or DATE_COOKIE
        //-------------------------------------------------------------------------
        'dsp.db_time_format'            => null,
        'dsp.db_date_format'            => null,
        'dsp.db_datetime_format'        => null,
        'dsp.db_timestamp_format'       => null,
        /** Enable/disable detailed CORS logging */
        'dsp.log_cors_info'             => false,
        //-------------------------------------------------------------------------
        //	Event and Scripting System Options
        //-------------------------------------------------------------------------
        //  If true, observation of events from afar will be allowed
        'dsp.enable_event_observers'    => true,
        //  If true, REST events will be generated
        'dsp.enable_rest_events'        => true,
        //  If true, platform events will be generated
        'dsp.enable_platform_events'    => true,
        //  If true, event scripts will be ran
        'dsp.enable_event_scripts'      => true,
        //  If true, scripts not distributed by DreamFactory will be allowed
        'dsp.enable_user_scripts'       => true,
        //  If true, events that have been dispatched to a handler are written to the log
        'dsp.log_events'                => true,
        //  If true, ALL events (with or without handlers) are written to the log.
        //  Trumps dsp.log_events. Be aware that enabling this can and will impact performance negatively.
        'dsp.log_all_events'            => false,
        //  If true, current request memory usage will be logged after script execution
        'dsp.log_script_memory_usage'   => false,
        //  An array of libraries/scripts to make available to event and user scripts
        'dsp.scripting.user_libraries'  => array(/* 'id' => 'relative/path', */),
        //-------------------------------------------------------------------------
        //	Cache stats logging
        //-------------------------------------------------------------------------
        //  If true, cache stats will be logged when "dsp.cache_stats_event" is fired
        'dsp.log_cache_stats'           => false,
        //  The event on which to dump cache stats
        'dsp.cache_stats_event'         => 'system.config.read',
        //-------------------------------------------------------------------------
        //	Login Form Settings
        //-------------------------------------------------------------------------
        'login.remember_me_copy'        => 'Remember Me',
        //-------------------------------------------------------------------------
        //	Chat Settings
        //-------------------------------------------------------------------------
        'dsp.chat_launchpad'            => false,
        'dsp.chat_admin'                => true,
    ),
    $_dspSalts
);
