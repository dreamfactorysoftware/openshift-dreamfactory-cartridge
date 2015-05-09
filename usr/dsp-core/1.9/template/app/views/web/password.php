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
use DreamFactory\Yii\Utility\Validate;

/**
 * @var WebController $this
 * @var PasswordForm  $model
 * @var CActiveForm   $form
 * @var string        $backUrl
 */

Validate::register(
    'form#password-form',
    array(
        'ignoreTitle'    => true,
        'errorClass'     => 'error',
        'errorPlacement' => 'function(error,element){error.appendTo(element.closest("div.form-group"));error.css("margin","-10px 0 0");}',
        'rules'          => array(
            'PasswordForm[old_password]'    => array(
                'required'  => true,
                'minlength' => 5,
            ),
            'PasswordForm[new_password]'    => array(
                'required'  => true,
                'minlength' => 5,
            ),
            'PasswordForm[repeat_password]' => array(
                'required'  => true,
                'minlength' => 5,
                'equalTo'   => '#PasswordForm_newPassword',
            ),
        ),
    )
);
?>
<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Change Password</h2>

        <p>All fields are required.</p>

        <?php
        $form = $this->beginWidget(
            'CActiveForm',
            array(
                'id'                     => 'password-form',
                'enableClientValidation' => true,
                'clientOptions'          => array(
                    'validateOnSubmit' => true,
                ),
            )
        );
        ?>

        <?php if ( Yii::app()->user->hasFlash( 'password-form' ) ): ?>

            <div class="alert alert-success">
                <?php echo Yii::app()->user->getFlash( 'password-form' ); ?>
            </div>

        <?php endif; ?>

        <div class="form-group">
            <label for="PasswordForm_oldPassword" class="sr-only">Old Password</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-lock fa-fw"></i></span>

                <input tabindex="1" class="form-control password required" autofocus type="password"
                       id="PasswordForm_oldPassword" name="PasswordForm[old_password]" placeholder="Old Password" />
            </div>
        </div>
        <div class="form-group">
            <label for="PasswordForm_newPassword" class="sr-only">New Password</label>

            <div class="input-group">
                <span class="input-group-addon bg_ly"><i class="fa fa-lock fa-fw"></i></span>

                <input tabindex="2" class="form-control password required" type="password"
                       id="PasswordForm_newPassword" name="PasswordForm[new_password]" placeholder="New Password" />
            </div>
        </div>
        <div class="form-group">
            <label for="PasswordForm_repeatPassword" class="sr-only">Verify New Password</label>

            <div class="input-group">
                <span class="input-group-addon bg_ly"><i class="fa fa-check fa-fw"></i></span>

                <input tabindex="3" class="form-control password required" type="password"
                       id="PasswordForm_repeatPassword" name="PasswordForm[repeat_password]" placeholder="Verify NewPassword" />
            </div>
        </div>

        <?php echo $form->errorSummary( $model ); ?>

        <div class="form-buttons">
            <button type="submit" class="btn btn-success pull-right">Save</button>
            <button type="button" id="btn-back" class="btn btn-default pull-left">Back</button>
        </div>

        <?php $this->endWidget(); ?>
    </div>
</div>

<script type="text/javascript">
jQuery(function($) {
    $('#btn-back').on('click', function(e) {
        e.preventDefault();
        window.location.href = '<?php echo $backUrl?>';
    });
});
</script>
