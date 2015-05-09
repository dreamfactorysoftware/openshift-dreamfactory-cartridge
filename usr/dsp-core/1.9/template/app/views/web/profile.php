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
use Kisma\Core\Utility\Option;

/**
 * @var WebController $this
 * @var ProfileForm   $model
 * @var CActiveForm   $form
 * @var string        $backUrl
 * @var array         $session
 */

Validate::register(
    'form#profile-form',
    array(
        'ignoreTitle'    => true,
        'errorClass'     => 'error',
        'errorPlacement' => 'function(error,element){error.appendTo(element.closest("div.form-group"));}',
        'rules'          => array(
            'ProfileForm[email]'        => array(
                'required' => true,
                'email'    => true,
            ),
            'ProfileForm[first_name]'   => array(
                'required'  => true,
                'minlength' => 3,
            ),
            'ProfileForm[last_name]'    => array(
                'required'  => true,
                'minlength' => 3,
            ),
            'ProfileForm[display_name]' => array(
                'required'  => true,
                'minlength' => 6,
            ),
        ),
    )
);

CHtml::$errorSummaryCss = 'alert alert-danger';

if ( null !== ( $_flash = Pii::getFlash( 'profile-form' ) ) )
{
    $_flash = <<<HTML
<div class="alert alert-success">
	{$_flash}
</div>
HTML;
}

$_appOptions = '<option name="ProfileForm[default_app_id]" value="0">None</option>';

if ( isset( $session ) )
{
    $_defaultAppId = Option::get( $session, 'default_app_id', 0 );

    /** @var array $_app */
    foreach ( $session['allowed_apps'] as $_app )
    {
        $_selected = ( $_app['id'] == $_defaultAppId );
        $_appOptions .=
            '<option name="ProfileForm[default_app_id]" value="' .
            $_app['id'] .
            '"' .
            ( $_selected ? ' selected="selected" ' : null ) .
            '>' .
            $_app['api_name'] .
            '</option>';
    }
}

?>
<div class="box-wrapper">
    <div id="formbox" class="tall-box form-light boxed drop-shadow lifted">
        <h2 class="inset">User Profile</h2>

        <?php echo $_flash; ?>
        <?php echo CHtml::errorSummary( $model, '<strong>Profile Error...</strong>' ); ?>

        <form id="profile-form" method="POST" role="form">

            <div class="form-group">
                <label for="ProfileForm_email" class="sr-only">Email Address</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-envelope fa-fw"></i></span>

                    <input tabindex="1" class="form-control email required" autofocus type="email" id="ProfileForm_email"
                        name="ProfileForm[email]" placeholder="Email Address"
                        value="<?php echo $model->email; ?>" />
                </div>
            </div>

            <div class="form-group">
                <label for="ProfileForm_firstName" class="sr-only">First Name</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-user fa-fw"></i></span>

                    <input tabindex="2" class="form-control required" type="text" id="ProfileForm_firstName"
                        name="ProfileForm[first_name]" placeholder="First Name"
                        value="<?php echo $model->first_name; ?>" />
                </div>
            </div>
            <div class="form-group">
                <label for="ProfileForm_lastName" class="sr-only">Last Name</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-user fa-fw"></i></span>

                    <input tabindex="3" class="form-control required" type="text" id="ProfileForm_lastName"
                        name="ProfileForm[last_name]" placeholder="Last Name"
                        value="<?php echo $model->last_name; ?>" />
                </div>
            </div>
            <div class="form-group">
                <label for="ProfileForm_displayName" class="sr-only">Display Name</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-eye fa-fw"></i></span>

                    <input tabindex="4" class="form-control" type="text" id="ProfileForm_displayName"
                        name="ProfileForm[display_name]" placeholder="Display Name"
                        value="<?php echo $model->display_name; ?>" />
                </div>
            </div>
            <div class="form-group">
                <label for="ProfileForm_phone" class="sr-only">Phone</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-phone fa-fw"></i></span>

                    <input tabindex="5" class="form-control" type="text" id="ProfileForm_phone"
                        name="ProfileForm[phone]" placeholder="Phone"
                        value="<?php echo $model->phone; ?>" />
                </div>
            </div>
            <div class="form-group">
                <label for="ProfileForm_securityQuestion" class="sr-only">Security Question</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-question fa-fw"></i></span>

                    <input tabindex="6" class="form-control" type="text" id="ProfileForm_securityQuestion"
                        name="ProfileForm[security_question]" placeholder="Security Question"
                        value="<?php echo $model->security_question; ?>" />
                </div>
            </div>
            <div class="form-group">
                <label for="ProfileForm_securityAnswer" class="sr-only">Security Answer</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-question fa-fw"></i></span>

                    <input tabindex="7" class="form-control" type="text" id="ProfileForm_securityAnswer"
                        name="ProfileForm[security_answer]" placeholder="Security Answer"
                        value="<?php echo $model->security_answer; ?>" />
                </div>
            </div>
            <div class="form-group">
                <label for="ProfileForm_default_app_id" class="sr-only">Default Application</label>

                <div class="input-group">
                    <span class="input-group-addon bg_dg"><i class="fa fa-cloud fa-fw"></i></span>

                    <select tabindex="8" class="form-control" id="ProfileForm_default_app_id" name="ProfileForm[default_app_id]">
                        <?php echo $_appOptions; ?>
                    </select>
                </div>
            </div>

            <div class="form-buttons">
                <button type="submit" class="btn btn-success pull-right">Save</button>
                <button type="button" id="btn-back" class="btn btn-default pull-left">Back</button>
            </div>

        </form>
    </div>
</div>

<script type="text/javascript">
jQuery(
    function($) {
        $('#profile-form').on(
            'focus', 'input#ProfileForm_displayName', function(e) {
                if (!$('#ProfileForm_displayName').val().trim().length) {
                    $('#ProfileForm_displayName').val($('#ProfileForm_firstName').val() + ' ' + $('#ProfileForm_lastName').val())
                }
            }
        );
        $('#btn-back').on(
            'click', function(e) {
                e.preventDefault();
                window.location = '<?php echo $backUrl?>';
            }
        );
    }
);
</script>
