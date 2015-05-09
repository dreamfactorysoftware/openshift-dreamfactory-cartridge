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
use DreamFactory\Platform\Scripting\Api;
use DreamFactory\Platform\Yii\Models\Provider;

/**
 * @var WebController $this
 * @var LoginForm     $model
 * @var bool          $redirected
 * @var CActiveForm   $form
 * @var Provider[]    $loginProviders
 */
$_html = null;

CHtml::$errorSummaryCss = 'alert alert-danger';

$_html = null;

$_tree = Api::getScriptingObject( true );
$_tree = (array)$_tree;
ksort( $_tree );

foreach ( $_tree as $_service => $_operations )
{
    $_lines = null;

    $_operations = (array)$_operations;
    ksort( $_operations );

    foreach ( $_operations as $_operation => $_closure )
    {
        if ( 'db' == $_service )
        {
            $_lines .= '<li><span><i class="fa fa-plus-circle"></i><strong>' . $_service . '.' . $_operation . '</strong></span><ul>';

            foreach ( $_closure as $_methodName => $_methodClosure )
            {
                $_lines .= '<li style="display: none;"><span><code>' . $_service . '.' . $_operation . '.' . $_methodName . '</code></span></li>';
            }

            $_lines .= '</li></ul>';
        }
        else
        {
            $_lines .= '<li style="display: none;"><span><code>' . $_service . '.' . $_operation . '</code></span></li>';
        }
    }

    $_html .= '<li><span><i class="fa fa-plus-circle"></i><strong>' . $_service . '</strong></span><ul>' . $_lines . '</ul></li>';
}
?>
<div class="box-wrapper box-wrapper-wide">
    <div class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Scripting API Reference</h2>
        <p>The following methods are available in scripts via the <code>platform.api</code> object.</p>

        <div class="panel-group" id="api-tree">
            <div class="tree tree-inverse">
                <ul><?php echo $_html; ?></ul>
            </div>
        </div>
    </div>
</div>

<script type="application/javascript">
jQuery(
    function ($) {
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
        $('.tree li.parent_li > span').on(
            'click', function (e) {
                var children = $(this).parent('li.parent_li').find(' > ul > li');
                if (children.is(":visible")) {
                    children.hide('fast');
                    $(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-plus-circle').removeClass('fa-minus-circle');
                } else {
                    children.show('fast');
                    $(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-minus-circle').removeClass('fa-plus-circle');
                }
                e.stopPropagation();
            }
        );
    }
);
</script>