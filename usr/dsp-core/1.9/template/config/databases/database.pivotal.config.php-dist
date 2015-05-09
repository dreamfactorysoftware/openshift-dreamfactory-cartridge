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
use DreamFactory\Platform\Enums\InstallationTypes;
use DreamFactory\Platform\Utility\Platform;
use Kisma\Core\Utility\Log;
use Kisma\Core\Utility\Option;

/**
 * database.pivotal.config.php-dist
 *
 * Connects to a vcap cleardb service specified in the runtime environment.
 * No changes should be necessary
 */
//*************************************************************************
//	Constants
//*************************************************************************

/**
 * @type string The name of the target PaaS
 */
const PAAS_NAME = 'pivotal';
/**
 * @type string The environment variable that holds the credentials for the database
 */
const ENV_KEY = 'VCAP_SERVICES';
/**
 * @type string The name of the key containing the database
 */
const DB_KEY = 'cleardb';
/**
 * @type int The index of the database to use
 */
const DB_INDEX = 0;
/**
 * @type string The name of the key containing the credentials
 */
const DB_CREDENTIALS_KEY = 'credentials';

//******************************************************************************
//* Main
//******************************************************************************

/**
 * Returns a generic IBM Bluemix database configuration
 * Wrapped to prevent $GLOBAL pollution
 *
 * @return array
 */
return call_user_func(
    function ()
    {
        /** @type string $_envData */
        $_envData = getenv( ENV_KEY );

        //  Decode and examine
        $_services = json_decode( $_envData, true );

        if ( false !== $_services && JSON_ERROR_NONE == json_last_error() && !empty( $_services ) )
        {
            //  Get credentials environment data
            $_dbConfig = Option::get( Option::getDeep( $_services, DB_KEY, DB_INDEX, array() ), DB_CREDENTIALS_KEY );

            if ( empty( $_dbConfig ) )
            {
                throw new \RuntimeException(
                    'ClearDb service not found in services env: ' . print_r( $_services, true )
                );
            }

            $_db = array(
                'connectionString'      =>
                    'mysql:host=' .
                    //  Check for 'host', then 'hostname', default to 'localhost'
                    Option::get( $_dbConfig, 'host', Option::get( $_dbConfig, 'hostname', 'localhost' ) ) .
                    ';port=' .
                    $_dbConfig['port'] .
                    ';dbname=' .
                    $_dbConfig['name'],
                'username'              => $_dbConfig['username'],
                'password'              => $_dbConfig['password'],
                'emulatePrepare'        => true,
                'charset'               => 'utf8',
                'enableProfiling'       => defined( 'YII_DEBUG' ),
                'enableParamLogging'    => defined( 'YII_DEBUG' ),
                'schemaCachingDuration' => 3600,
            );

            unset( $_envData, $_dbConfig, $_services );

            //  Set a key about where we live...
            Platform::storeSet( INSTALL_TYPE_KEY, InstallationTypes::PIVOTAL_PACKAGE );

            return $_db;
        }

        Log::notice(
            'Database configuration found for PaaS "' .
            PAAS_NAME .
            '", but required environment variable is invalid or null.' .
            PHP_EOL .
            'Environment Dump' .
            PHP_EOL .
            '------------------------------------------------------------' .
            PHP_EOL .
            print_r( $_ENV, true )
        );

        //  Returning false equates to not having a "config/database.config.php"
        return false;
    }
);