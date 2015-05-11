<?php
/**
 * This file is part of the DreamFactory Services Platform(tm) (DSP)
 *
 * DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
 * Copyright 2012-2013 DreamFactory Software, Inc. <support@dreamfactory.com>
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
 * storage.helper.php
 *
 * This file provides directory listings to the snapshot service.
 * This is really only used for remote DSPs and not hosted ones
 */

/**
 * @param string $path
 *
 * @return array
 */
function _buildTree( $path )
{
	$_data = array();
	$_path = realpath( $path );

	if ( false === stripos( $_path, '/var/www/launchpad/', 0 ) )
	{
		return $_data;
	}

	$_objects = new \RecursiveIteratorIterator(
		new \RecursiveDirectoryIterator( $_path ),
		RecursiveIteratorIterator::SELF_FIRST
	);

	/** @var $_node \SplFileInfo */
	foreach ( $_objects as $_name => $_node )
	{
		if ( $_node->isDir() || $_node->isLink() || '.' == $_name || '..' == $_name )
		{
			continue;
		}

		$_data[str_ireplace( $_path, null, dirname( $_node->getPathname() ) )][] = basename( $_name );
	}

	return $_data;
}

//.........................................................................
//. Main
//.........................................................................

echo json_encode( _buildTree( dirname( __DIR__ ) . '/storage' ) );