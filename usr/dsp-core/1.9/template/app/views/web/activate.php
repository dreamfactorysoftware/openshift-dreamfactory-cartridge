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
use DreamFactory\Yii\Utility\Pii;
use DreamFactory\Yii\Utility\Validate;

/**
 * @var WebController $this
 * @var ActivateForm  $model
 * @var CActiveForm   $form
 */

Validate::register(
    'form#activate-form',
    array(
        'ignoreTitle'    => true,
        'errorClass'     => 'error',
        'errorPlacement' => 'function(error,element){error.appendTo(element.closest("div.form-group"));}',
        'rules'          => array(
            'ActivateForm[username]' => 'required email',
            'ActivateForm[password]' => array(
                'required'  => true,
                'minlength' => 3,
            ),
        ),
        'messages'       => array(
            'ActivateForm[username]' => 'Please enter an actual email address',
            'ActivateForm[password]' => array(
                'required'  => 'You must enter a password to continue',
                'minlength' => 'Your password must be at least 3 characters long',
            ),
        ),
    )
);

CHtml::$errorSummaryCss = 'alert alert-danger';

if ( null !== ( $_flash = Pii::getFlash( 'activate-form' ) ) )
{
    $_flash = <<<HTML
<div class="alert alert-success">
	{$_flash}
</div>
HTML;
}
?>
<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Activation Required</h2>

        <h4 style="text-align: left;">To activate this DSP, please enter your email and password from the main <a target="_blank"
                                                                                                                  href="https://www.dreamfactory.com">DreamFactory site</a>.
        </h4>
        <h4 style="text-align:left;">You will automatically be made an admin user of this DSP. This user can be modified, and more users can be added, once your DSP is activated.</h4>

        <?php echo $_flash; ?>
        <?php echo CHtml::errorSummary( $model, '<strong>Activation Error</strong>' ); ?>

        <form id="activate-form" method="POST" role="form">

            <div class="form-group">
                <label for="ActivateForm_username" class="sr-only">Email Address</label>

                <div class="input-group">
                    <span class="input-group-addon bg-control"><i class="fa fa-fw fa-envelope fa-2x"></i></span>

                    <input tabindex="1" required class="form-control" autofocus type="email" id="ActivateForm_username"
                           name="ActivateForm[username]" placeholder="DSP User Email Address"
                           spellcheck="false" autocapitalize="off" autocorrect="off"
                           value="<?php echo $model->username; ?>" />
                </div>
            </div>

            <div class="form-group">
                <label for="ActivateForm_password" class="sr-only">Password</label>

                <div class="input-group">
                    <span class="input-group-addon bg-control"><i class="fa fa-fw fa-lock fa-2x"></i></span>

                    <input tabindex="2" class="form-control required" type="password" id="ActivateForm_password" name="ActivateForm[password]"
                           autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="false" placeholder="Password" value="" />
                </div>
            </div>

            <div class="form-buttons">
                <small style="padding-top: 10px;" class="pull-left">By activating this DSP you agree to our <a href="https://www.dreamfactory.com/terms_of_use/"
                                                                                                               target="_blank">terms and conditions</a>.
                </small>
                <button type="submit" class="btn btn-success pull-right">Activate</button>
            </div>
        </form>
    </div>
</div>