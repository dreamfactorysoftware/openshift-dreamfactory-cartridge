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
//	Already loaded? Bail...
if ( defined( 'DSP_VERSION' ) )
{
    return true;
}

//*************************************************************************
//* Constants
//*************************************************************************

/**
 * @var string
 */
const DSP_VERSION = '1.9.2';
/**
 * @var string
 */
const API_VERSION = '1.0';
/**
 * @var string
 */
const ALIASES_CONFIG_PATH = '/aliases.config.php';
/**
 * @var string
 */
const SALT_CONFIG_PATH = '/salt.config.php';
/**
 * @var string
 */
const KEYS_CONFIG_PATH = '/keys.config.php';
/**
 * @var string
 */
const DATABASE_CONFIG_PATH = '/database.config.php';
/**
 * @var string
 */
const ENV_CONFIG_PATH = '/env.config.php';
/**
 * @var string
 */
const CONSTANTS_CONFIG_PATH = '/constants.config.php';
/**
 * @var string
 */
const COMMON_CONFIG_PATH = '/common.config.php';
/**
 * @var string
 */
const SERVICES_CONFIG_PATH = '/services.config.php';
/**
 * @var string
 */
const DEFAULT_CLOUD_API_ENDPOINT = 'http://api.cloud.dreamfactory.com';
/**
 * @var string
 */
const DEFAULT_INSTANCE_AUTH_ENDPOINT = 'http://cerberus.fabric.dreamfactory.com/api/instance/credentials';
/**
 * @var string
 */
const DEFAULT_METADATA_ENDPOINT = 'http://cerberus.fabric.dreamfactory.com/api/instance/metadata';
/**
 * @var string
 */
const DEFAULT_SUPPORT_EMAIL = 'support@dreamfactory.com';
/**
 * @var string
 */
const DEFAULT_ADMIN_RESOURCE_SCHEMA = '/admin.resource_schema.config.php';
/**
 * @var string
 */
const INSTALL_TYPE_KEY = 'dsp.install_type';
/**
 * @var string
 */
const DEFAULT_ADMIN_APP_PATH = '/dreamfactory/dist';
//const DEFAULT_ADMIN_APP_PATH = '/launchpad';
