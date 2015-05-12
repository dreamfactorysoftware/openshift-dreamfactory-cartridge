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
 * @var WebController $this
 * @var SupportForm   $model
 */

$_summary = null;

if ( $model && $model->hasErrors() )
{
    foreach ( $model->getErrors() as $_column => $_error )
    {
        $_error = is_array( $_error ) ? implode( '<br/>', $_error ) : $_error;

        $_summary .= <<<HTML
<p><strong>{$_column}</strong>: {$_error}</p>
HTML;
    }

    $_summary = <<<HTML
<div class="alert alert-fixed alert-danger">{$_summary}</div>
HTML;
}
?>
<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Product Support</h2>

        <p>Would you like one month of free engineering support and important product updates from DreamFactory?</p>

        <?php echo $_summary; ?>

        <form class="form form-horizontal" id="register-form" method="POST">
            <input type="hidden" name="SupportForm[skipped]" id="SupportForm_skipped" value="0">

            <div class="form-buttons">
                <button type="submit" class="btn btn-success pull-right">Yes</button>
                <button type="button" id="btn-skip" class="btn btn-default pull-left">No</button>
            </div>
        </form>
    </div>
</div>

<script type="text/javascript">
jQuery(function($) {
    var $_form = $('#register-form');

    $('#btn-skip').on('click', function(e) {
        e.preventDefault();
        $('#SupportForm_emailAddress').val('');
        $('#SupportForm_skipped').val(1);
        $_form.submit();
    });
});
</script>
