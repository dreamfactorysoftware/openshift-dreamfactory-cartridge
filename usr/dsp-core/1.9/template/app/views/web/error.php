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
use Kisma\Core\Enums\HttpResponse;

/**
 * @var        $this    WebController
 * @var        $string  $type
 * @var string $message string
 * @var int    $code
 */

$_niceCode = HttpResponse::prettyNameOf( $code, true );

switch ( $code )
{
    case 404:
        echo $this->renderPartial( '_404' );

        return;
}

?>
<div class="container-fluid container-error">
    <h1>Well, this is embarrassing...</h1>

    <p class="lead">The server has experienced a fatal error. Our administrators will automatically be notified. However, if you would like to report additional information regarding this particular error, please open a case on our
        <a target="_blank" href="https://github.com/dreamfactorysoftware/dsp-core/issues">bug tracker</a>.
    </p>

    <div class="inset">
        <h3>Error <?php echo $code; ?></h3>
    </div>

    <div class="error">
        <p class="lead"><?php echo $_niceCode; ?></p>

        <h3>Error Details</h3>

        <div class="inset">
            <p><?php echo $message; ?></p>
        </div>
    </div>
</div>

<pre><?php print_r( get_defined_vars() ); ?></pre>