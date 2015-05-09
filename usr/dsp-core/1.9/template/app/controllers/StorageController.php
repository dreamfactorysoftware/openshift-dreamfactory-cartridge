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
use DreamFactory\Platform\Services\BaseFileSvc;
use DreamFactory\Platform\Utility\ServiceHandler;
use DreamFactory\Yii\Controllers\BaseWebController;
use DreamFactory\Yii\Utility\Pii;
use Kisma\Core\Utility\FilterInput;

/**
 *  Generic controller for streaming content from storage services
 */
class StorageController extends BaseWebController
{

    /**
     * @return array action filters
     */
    public function filters()
    {
        return array();
    }

    /**
     *
     */
    public function actionGet()
    {
        $_service = FilterInput::get( INPUT_GET, 'service', '' );
        try
        {
            /** @var BaseFileSvc $_obj */
            $_obj = ServiceHandler::getServiceObject( $_service );
            switch ( $_obj->getType() )
            {
                case 'Local File Storage':
                case 'Remote File Storage':
                    $_fullPath = FilterInput::get( INPUT_GET, 'path', '' );

                    if ( !empty( $_obj->privatePaths ) )
                    {
                        // match path pieces to public accessible
                        $_count = substr_count( $_fullPath, '/' );
                        $_pos = -1;
                        for ( $_ndx = 0; $_ndx < $_count; $_ndx++ )
                        {
                            $_pos = strpos( $_fullPath, '/', $_pos + 1 );
                            $_piece = substr( $_fullPath, 0, $_pos ) . '/';
                            if ( false !== array_search( $_piece, $_obj->privatePaths ) )
                            {
                                $_statusHeader = 'HTTP/1.1 403 Forbidden. You have no access to this file or folder.';
                                header( $_statusHeader );
                                header( 'Content-Type: text/html' );

                                Pii::end();
                            }
                        }
                        // check for full file path
                        if ( false !== array_search( $_fullPath, $_obj->privatePaths ) )
                        {
                            $_statusHeader = 'HTTP/1.1 403 Forbidden. You have no access to this file or folder.';
                            header( $_statusHeader );
                            header( 'Content-Type: text/html' );

                            Pii::end();
                        }
                    }

                    $_container = substr( $_fullPath, 0, strpos( $_fullPath, '/' ) );
                    $_path = ltrim( substr( $_fullPath, strpos( $_fullPath, '/' ) + 1 ), '/' );
                    $_obj->streamFile( $_container, $_path );

                    Pii::end();

                    break;
            }

            $_statusHeader = 'HTTP/1.1 403 Forbidden. You have no access to this file or folder.';
            header( $_statusHeader );
            header( 'Content-Type: text/html' );

            Pii::end();
        }
        catch ( \Exception $ex )
        {
            die( $ex->getMessage() );
        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex()
    {
        Pii::end();
    }

}
