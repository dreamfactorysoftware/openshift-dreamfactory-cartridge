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
 * admin.resource_schema.config.php
 * The schema for the admin resources
 */

$_schemaBasePath = dirname( __DIR__ );
$_schemaVendorPath = $_schemaBasePath . '/vendor';

return array(
	//*************************************************************************
	//	Apps
	//*************************************************************************

	'apps'           => array(
		'header'       => 'Installed Applications',
		'resource'     => 'app',
		'resourceName' => 'Application',
		'fields'       => array(
			'id'        => array( 'title' => 'ID', 'key' => true, 'list' => false, 'create' => false, 'edit' => false ),
			'name'      => array( 'title' => 'Name' ),
			'api_name'  => array( 'title' => 'Endpoint', 'edit' => false ),
			'url'       => array( 'title' => 'Default Page', 'inputClass' => 'input-xxlarge' ),
			'is_active' => array(
				'title'   => 'Active',
				'options' => array( 'true' => 'Yes', 'false' => 'No' ),
				'display' => '##function (data){return data ? "Yes" : "No";}##',
			),
		),
		'listFields'   => 'id,name,api_name,url,is_active',
		'labels'       => array( 'ID', 'Name', 'Starting Path', 'Active' ),
	),
	//*************************************************************************
	//	Providers
	//*************************************************************************

	'providers'      => array(
		'header'       => 'Authentication Providers',
		'resource'     => 'provider',
		'resourceName' => 'Provider',
		'fields'       => array(
			'id'            => array( 'title' => 'ID', 'key' => true, 'list' => true, 'create' => false, 'edit' => false ),
			'provider_name' => array( 'title' => 'Name' ),
			'api_name'      => array( 'title' => 'API Name' ),
			'config_text'   => array( 'title' => 'Settings', 'list' => false ),
		),
		'listFields'   => 'id,provider_name,api_name,config_text',
		'labels'       => array( 'ID', 'Name', 'API Name', 'Settings' ),
	),
	//*************************************************************************
	//	Provider Users
	//*************************************************************************

	'provider_users' => array(
		'header'       => 'Provider Users',
		'resource'     => 'provider_user',
		'resourceName' => 'ProviderUser',
		'fields'       => array( 'id', 'user_id', 'provider_id', 'provider.provider_name', 'provider_user_id', 'last_use_date' ),
		'labels'       => array( 'ID', 'User', 'Provider', 'Provider User ID', 'Last Used' ),
		'listFields'   => 'id,user_id,provider_id,provider.provider_name,provider_user_id,last_use_date',
	),
);

unset( $_schemaBasePath, $_schemaVendorPath );
