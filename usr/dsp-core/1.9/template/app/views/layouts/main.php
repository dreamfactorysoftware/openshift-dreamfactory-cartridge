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
 * This is the main template for the server-side views.
 *
 * @var string        $content
 * @var WebController $this
 */
$_versions = array(
    'bootstrap'       => '3.2.0',
    'font-awesome'    => '4.2.0',
    'bootswatch'      => '3.2.0',
    'jquery'          => '2.1.1',
    'jquery.validate' => '1.11.1',
);

require __DIR__ . '/_main.outer.php';
