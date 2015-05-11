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
/**
 * Heroku database configuration
 *
 * @return array
 */
$_url = parse_url( getenv( 'CLEARDB_DATABASE_URL' ) );
$_server = $_url['host'];
$_username = $_url['user'];
$_password = $_url['pass'];
$_port = $_url['port'];
$_db = substr( $_url["path"], 1 );

return array(
    'connectionString'      => 'mysql:host=' . $_server . ';port=' . $_port . ';dbname=' . $_db,
    'username'              => $_username,
    'password'              => $_password,
    'emulatePrepare'        => true,
    'charset'               => 'utf8',
    'enableProfiling'       => defined( 'YII_DEBUG' ),
    'enableParamLogging'    => defined( 'YII_DEBUG' ),
    'schemaCachingDuration' => 3600,
);
