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
 * @var InitAdminForm $model
 * @var CActiveForm   $form
 */

Validate::register(
    'form#init-form',
    array(
        'ignoreTitle'    => true,
        'errorClass'     => 'error',
        'errorPlacement' => 'function(error,element){error.appendTo(element.closest("div.form-group"));error.css("margin","-10px 0 0");}',
        'rules'          => array(
            'InitAdminForm[email]'          => array(
                'required'  => true,
                'minlength' => 5,
            ),
            'InitAdminForm[first_name]'     => array(
                'required' => true,
            ),
            'InitAdminForm[last_name]'      => array(
                'required' => true,
            ),
            'InitAdminForm[display_name]'   => array(
                'required' => true,
            ),
            'InitAdminForm[password]'       => array(
                'required'  => true,
                'minlength' => 5,
            ),
            'InitAdminForm[passwordRepeat]' => array(
                'required'  => true,
                'minlength' => 5,
                'equalTo'   => '#InitAdminForm_password',
            ),
        ),
    )
);
?>
<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Create a System Admin User</h2>

        <p>Your DSP requires at least one system administrator. Complete this form to create your first admin user. More users can be easily added using the DSP's built-in 'Admin' application.
        </p>

        <?php
        $form = $this->beginWidget(
            'CActiveForm',
            array(
                'id'                     => 'init-form',
                'enableClientValidation' => true,
                'clientOptions'          => array(
                    'validateOnSubmit' => true,
                ),
            )
        );
        ?>

        <div class="form-group">
            <label for="InitAdminForm_email" class="sr-only">Email Address</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-envelope fa-fw"></i></span>

                <input tabindex="1" class="form-control email required" autofocus type="email" id="InitAdminForm_email"
                       name="InitAdminForm[email]" placeholder="Email Address"
                       value="<?php echo( $model->email ? $model->email : '' ); ?>" />
            </div>
        </div>
        <div class="form-group">
            <label for="InitAdminForm_password" class="sr-only">Password</label>

            <div class="input-group">
                <span class="input-group-addon bg_ly"><i class="fa fa-lock fa-fw"></i></span>

                <input tabindex="2" class="form-control password required" type="password" id="InitAdminForm_password"
                       name="InitAdminForm[password]" placeholder="Password" />
            </div>
        </div>
        <div class="form-group">
            <label for="InitAdminForm_passwordRepeat" class="sr-only">Verify Password</label>

            <div class="input-group">
                <span class="input-group-addon bg_ly"><i class="fa fa-check fa-fw"></i></span>

                <input tabindex="3" class="form-control password required" type="password" id="InitAdminForm_passwordRepeat"
                       name="InitAdminForm[password_repeat]" placeholder="Verify Password" />
            </div>
        </div>
        <div class="form-group">
            <label for="InitAdminForm_firstName" class="sr-only">First Name</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-user fa-fw"></i></span>

                <input tabindex="4" class="form-control required" type="text" id="InitAdminForm_firstName"
                       name="InitAdminForm[first_name]" placeholder="First Name"
                       value="<?php echo( $model->first_name ? $model->first_name : '' ); ?>" />
            </div>
        </div>
        <div class="form-group">
            <label for="InitAdminForm_lastName" class="sr-only">Last Name</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-user fa-fw"></i></span>

                <input tabindex="5" class="form-control required" type="text" id="InitAdminForm_lastName"
                       name="InitAdminForm[last_name]" placeholder="Last Name"
                       value="<?php echo( $model->last_name ? $model->last_name : '' ); ?>" />
            </div>
        </div>
        <div class="form-group">
            <label for="InitAdminForm_displayName" class="sr-only">Display Name</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-eye fa-fw"></i></span>

                <input tabindex="6" class="form-control" type="text" id="InitAdminForm_displayName"
                       name="InitAdminForm[display_name]" placeholder="Display Name"
                       value="<?php echo( $model->display_name ? $model->display_name : '' ); ?>" />
            </div>
        </div>

        <?php echo $form->errorSummary( $model ); ?>

        <div class="form-buttons">
            <button type="submit" class="btn btn-success pull-right">Create</button>
        </div>

        <?php $this->endWidget(); ?>
    </div>
</div>

<script type="text/javascript">
jQuery(function($) {
    var $_name = $('#InitAdminForm_displayName');
    $('#init-form').on('focus', 'input#InitAdminForm_displayName', function(e) {
        if (!$_name.val().trim().length) {
            $_name.val($('#InitAdminForm_firstName').val() + ' ' + $('#InitAdminForm_lastName').val())
        }
    });
});
</script>
