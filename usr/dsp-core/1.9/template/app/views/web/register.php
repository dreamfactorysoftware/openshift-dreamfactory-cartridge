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
 * @var WebController    $this
 * @var RegisterUserForm $model
 * @var CActiveForm      $form
 * @var string           $backUrl
 */

$_rules = array(
    'RegisterUserForm[email]'        => array(
        'required'  => true,
        'minlength' => 5,
    ),
    'RegisterUserForm[first_name]'   => array(
        'required' => true,
    ),
    'RegisterUserForm[last_name]'    => array(
        'required' => true,
    ),
    'RegisterUserForm[display_name]' => array(
        'required' => true,
    ),
);

if ( !$model->getViaEmail() )
{
    $_rules = array_merge(
        $_rules,
        array(
            'RegisterUserForm[password]'        => array(
                'required'  => true,
                'minlength' => 5,
            ),
            'RegisterUserForm[password_repeat]' => array(
                'required'  => true,
                'minlength' => 5,
                'equalTo'   => '#RegisterUserForm_password',
            )
        )
    );
}

Validate::register(
    'form#register-user-form',
    array(
        'ignoreTitle'    => true,
        'errorClass'     => 'error',
        'errorPlacement' => 'function(error,element){error.appendTo(element.closest("div.form-group"));error.css("margin","-10px 0 0");}',
        'rules'          => $_rules,
    )
);
?>
<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">DSP User Registration</h2>

        <?php if ( $model->getViaEmail() )
        {
            echo '<p>Please enter your email address and name. An email will be sent to you to confirm registration.</p>';
        }
        else
        {
            echo '<p>Please enter your email address, name, and desired password to complete the registration.</p>';
        }
        ?>

        <?php
        $form
            = $this->beginWidget(
            'CActiveForm',
            array(
                'id'                     => 'register-user-form',
                'enableClientValidation' => true,
                'clientOptions'          => array(
                    'validateOnSubmit' => true,
                ),
            )
        );
        ?>

        <div class="form-group">
            <label for="RegisterUserForm_email" class="sr-only">Email Address</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-envelope fa-fw"></i></span>

                <input tabindex="1" class="form-control email required" autofocus type="email" id="RegisterUserForm_email"
                       name="RegisterUserForm[email]" placeholder="Email Address"
                       value="<?php echo( $model->email ? $model->email : '' ); ?>" />
            </div>
        </div>

        <?php if ( !$model->getViaEmail() ): ?>
            <div class="form-group">
                <label for="RegisterUserForm_password" class="sr-only">Password</label>

                <div class="input-group">
                    <span class="input-group-addon bg_ly"><i class="fa fa-lock fa-fw"></i></span>

                    <input tabindex="2" class="form-control password required" type="password" id="RegisterUserForm_password"
                           name="RegisterUserForm[password]" placeholder="Password" />
                </div>
            </div>
            <div class="form-group">
                <label for="RegisterUserForm_passwordRepeat" class="sr-only">Verify Password</label>

                <div class="input-group">
                    <span class="input-group-addon bg_ly"><i class="fa fa-check fa-fw"></i></span>

                    <input tabindex="3" class="form-control password required" type="password" id="RegisterUserForm_passwordRepeat"
                           name="RegisterUserForm[password_repeat]" placeholder="Verify Password" />
                </div>
            </div>
        <?php endif; ?>

        <div class="form-group">
            <label for="RegisterUserForm_firstName" class="sr-only">First Name</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-user fa-fw"></i></span>

                <input tabindex="4" class="form-control required" type="text" id="RegisterUserForm_firstName"
                       name="RegisterUserForm[first_name]" placeholder="First Name"
                       value="<?php echo( $model->first_name ? $model->first_name : '' ); ?>" />
            </div>
        </div>
        <div class="form-group">
            <label for="RegisterUserForm_lastName" class="sr-only">Last Name</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-user fa-fw"></i></span>

                <input tabindex="5" class="form-control required" type="text" id="RegisterUserForm_lastName"
                       name="RegisterUserForm[last_name]" placeholder="Last Name"
                       value="<?php echo( $model->last_name ? $model->last_name : '' ); ?>" />
            </div>
        </div>
        <div class="form-group">
            <label for="RegisterUserForm_displayName" class="sr-only">Display Name</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-eye fa-fw"></i></span>

                <input tabindex="6" class="form-control" type="text" id="RegisterUserForm_displayName"
                       name="RegisterUserForm[display_name]" placeholder="Display Name"
                       value="<?php echo( $model->display_name ? $model->display_name : '' ); ?>" />
            </div>
        </div>

        <?php if ( Yii::app()->user->hasFlash( 'register-user-form' ) ): ?>

            <div class="alert alert-success">
                <?php echo Yii::app()->user->getFlash( 'register-user-form' ); ?>
            </div>

        <?php endif; ?>
        <?php echo $form->errorSummary( $model ); ?>

        <div class="form-buttons">
            <button type="submit" class="btn btn-success pull-right">Register</button>
            <button type="button" id="btn-back" class="btn btn-default pull-left">Back</button>
        </div>

        <?php $this->endWidget(); ?>
    </div>
</div>
<script type="text/javascript">
jQuery(function($) {
    $('#register-user-form').on('focus', 'input#RegisterUserForm_displayName', function(e) {
        if (!$('#RegisterUserForm_displayName').val().trim().length) {
            $('#RegisterUserForm_displayName').val($('#RegisterUserForm_firstName').val() + ' ' + $('#RegisterUserForm_lastName').val())
        }
    });
    $('#btn-back').on('click', function(e) {
        e.preventDefault();
        window.location = '<?php echo $backUrl?>';
    });
});
</script>

