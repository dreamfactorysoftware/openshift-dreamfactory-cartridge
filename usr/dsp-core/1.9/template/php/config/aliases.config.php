<?php
/**
 * This file is part of the DreamFactory Services Platform(tm) (DSP)
 *
 * DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
 * Copyright 2012-2014 DreamFactory Software, Inc. <developer-support@dreamfactory.com>
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

/**
 * aliases.config.php
 * A single location for all your aliasing needs!
 */

//	Already loaded? we done...
if ( false !== Yii::getPathOfAlias( 'DreamFactory.Yii.*' ) )
{
    return true;
}

$_aliasBasePath = dirname( __DIR__ );
$_aliasVendorPath = $_aliasBasePath . '/vendor';

Pii::setPathOfAlias( 'vendor', $_aliasVendorPath );

//	lib-php-common-yii (psr-0 && psr-4 compatible)
$_aliasLibPath =
    $_aliasVendorPath .
    '/dreamfactory/lib-php-common-yii' .
    ( is_dir( $_aliasVendorPath . '/dreamfactory/lib-php-common-yii/src' ) ? '/src' : '/DreamFactory/Yii' );

Pii::alias( 'DreamFactory.Yii', $_aliasLibPath );
Pii::alias( 'DreamFactory.Yii.Components', $_aliasLibPath . '/Components' );
Pii::alias( 'DreamFactory.Yii.Behaviors', $_aliasLibPath . '/Behaviors' );
Pii::alias( 'DreamFactory.Yii.Utility', $_aliasLibPath . '/Utility' );
Pii::alias( 'DreamFactory.Yii.Logging', $_aliasLibPath . '/Logging' );
Pii::alias( 'DreamFactory.Yii.Logging.LiveLogRoute', $_aliasLibPath . '/Logging/LiveLogRoute.php' );

//	lib-php-common-platform (psr-0 && psr-4 compatible)
$_aliasLibPath =
    $_aliasVendorPath .
    '/dreamfactory/lib-php-common-platform' .
    ( is_dir( $_aliasVendorPath . '/dreamfactory/lib-php-common-platform/src' ) ? '/src' : '/DreamFactory/Platform' );

Pii::alias( 'DreamFactory.Platform', $_aliasLibPath );
Pii::alias( 'DreamFactory.Platform.Services', $_aliasLibPath . '/Services' );
Pii::alias( 'DreamFactory.Platform.Yii', $_aliasLibPath . '/Yii' );
Pii::alias( 'DreamFactory.Platform.Yii.Behaviors', $_aliasLibPath . '/Yii/Behaviors' );
Pii::alias( 'DreamFactory.Platform.Yii.Commands', $_aliasLibPath . '/Yii/Commands' );
Pii::alias( 'DreamFactory.Platform.Yii.Models', $_aliasLibPath . '/Yii/Models' );

//	Vendors
Pii::alias( 'Swift', $_aliasVendorPath . '/swiftmailer/swiftmailer/lib/classes' );

unset( $_aliasLibPath, $_aliasVendorPath, $_aliasBasePath );
