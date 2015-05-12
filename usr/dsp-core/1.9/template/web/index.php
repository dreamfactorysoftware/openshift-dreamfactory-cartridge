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
use DreamFactory\Yii\Utility\Pii;

/** index.php -- Main entry point/bootstrap for all processes **/

//******************************************************************************
//* Constants
//******************************************************************************

/**
 * @type bool Global debug flag: If true, your logs will grow large and your performance will suffer, but fruitful information will be gathered.
 */
const DSP_DEBUG = false;
/**
 * @type bool Global PHP-ERROR flag: If true, PHP-ERROR will be utilized if available. See https://github.com/JosephLenton/PHP-Error for more info.
 */
const DSP_DEBUG_PHP_ERROR = false;

$_class = 'DreamFactory\\Platform\\Yii\\Components\\Platform' . ( 'cli' == PHP_SAPI ? 'Console' : 'Web' ) . 'Application';

/**
 * Debug-level output based on constant value above
 * For production mode, you'll want to set the above constants to FALSE
 * Get this turned on before anything is loaded
 */
if ( DSP_DEBUG )
{
    ini_set( 'display_errors', true );
//    ini_set( 'error_reporting', -1 );

    defined( 'YII_DEBUG' ) or define( 'YII_DEBUG', true );
//    defined( 'YII_TRACE_LEVEL' ) or define( 'YII_TRACE_LEVEL', 3 );
}

//  Load up composer...
$_autoloader = require_once( __DIR__ . '/../vendor/autoload.php' );

//  Load up Yii if it's not been already
if ( !class_exists( '\\Yii', false ) )
{
    require_once __DIR__ . '/../vendor/dreamfactory/yii/framework/yiilite.php';
}

//  php-error utility
if ( DSP_DEBUG_PHP_ERROR && function_exists( 'reportErrors' ) )
{
    reportErrors();
}

//  Create the application and run. This does not return until the request is complete.
Pii::run( __DIR__, $_autoloader, $_class );
