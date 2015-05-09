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
use Kisma\Core\Utility\Log;

/**
 * @var WebController $this
 * @var LoginForm     $model
 * @var bool          $redirected
 * @var CActiveForm   $form
 * @var array         $loginProviders
 * @var bool          $allowRegistration
 */
$_html = null;

Validate::register(
    'form#login-form',
    array(
        'ignoreTitle'    => true,
        'errorClass'     => 'error',
        'errorPlacement' => 'function(error,element){error.appendTo(element.closest("div.form-group"));}',
        'rules'          => array(
            'LoginForm[username]' => 'required email',
            'LoginForm[password]' => array(
                'minlength' => 3
            ),
        ),
        'messages'       => array(
            'LoginForm[username]' => 'Please enter an actual email address',
            'LoginForm[password]' => array(
                'required'  => 'You must enter a password to continue',
                'minlength' => 'Your password must be at least 3 characters long',
            ),
        ),
    )
);

$_rememberMeCopy = Pii::getParam( 'login.remember_me_copy', 'Remember Me' );

//*************************************************************************
//	Build the remote login provider icon list..
//*************************************************************************

$_providerHtml = null;
$_providerHider = 'hide';

if ( !empty( $loginProviders ) )
{
//    Log::debug( 'login providers: ' . print_r( $loginProviders, true ) );

    foreach ( $loginProviders as $_provider )
    {
        if ( !$_provider['is_active'] || !$_provider['is_login_provider'] )
        {
            continue;
        }

        $_icon = $_providerType = strtolower( $_provider['provider_name'] );

        //	Google icon has a different name
        if ( 'google' == $_icon )
        {
            $_icon = 'google-plus';
        }

        $_providerHtml .= '<i class="fa fa-' . $_icon . ' fa-3x" data-provider="' . $_providerType . '"></i>';
    }

    $_providerHider = !empty( $_providerHtml ) ? null : ' hide ';
}

CHtml::$errorSummaryCss = 'alert alert-danger';

if ( null !== ( $_flash = Pii::getFlash( 'login-form' ) ) )
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
        <h2 class="inset">User Login</h2>
        <h4>Please sign in to continue</h4>

        <?php echo $_flash; ?>
        <?php echo CHtml::errorSummary( $model, '<strong>Login Error</strong>' ); ?>

        <form id="login-form" method="POST" role="form">
            <input type="hidden" name="login-only" value="<?php echo $redirected ? 1 : 0; ?>">
            <input type="hidden" name="forgot" id="forgot" value="0">

            <div class="form-group">
                <label for="LoginForm_username" class="sr-only">DSP Email Address</label>

                <div class="input-group">
                    <span class="input-group-addon bg-control"><i class="fa fa-fw fa-envelope fa-2x"></i></span>

                    <input tabindex="1" required class="form-control" autofocus type="email" id="LoginForm_username"
                        name="LoginForm[username]" placeholder="DSP User Email Address"
                        spellcheck="false" autocapitalize="off" autocorrect="off"
                        value="<?php echo $model->username; ?>" />
                </div>
            </div>

            <div class="form-group">
                <label for="LoginForm_password" class="sr-only">Password</label>

                <div class="input-group">
                    <span class="input-group-addon bg-control"><i class="fa fa-fw fa-lock fa-2x"></i></span>

                    <input tabindex="2" class="form-control required" type="password" id="LoginForm_password"
                        name="LoginForm[password]"
                        autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="false"
                        placeholder="Password" value="" />
                </div>
            </div>

            <div class="form-group">
                <div class="checkbox remember-me pull-right">
                    <label>
                        <input type="checkbox"
                            tabindex="3"
                            <?php echo $model->rememberMe ? ' checked="checked" ' : null; ?>
                            id="LoginForm_rememberMe"
                            name="LoginForm[rememberMe]">
                        <?php echo $_rememberMeCopy; ?>
                    </label>
                </div>
                <div class="clearfix"></div>
            </div>

            <div class="remote-login <?php echo $_providerHider; ?>">
                <p class="lead">Or</p>

                <div class="remote-login-wrapper">
                    <h4 style="">Sign-in with one of these providers</h4>

                    <div class="remote-login-providers"><?php echo $_providerHtml; ?></div>
                </div>
            </div>

            <div class="form-buttons">
                <button type="submit" id="btn-submit" class="btn btn-md btn-success pull-right">Login</button>
                <button type="button" id="btn-forgot" class="btn btn-default btn-md btn-warning">Forgot Password?</button>
                <?php if ( $allowRegistration )
                {
                    ?>
                    <a id="btn-register" href="/web/register" class="btn btn-info btn-md pull-right" style="margin-right:8px;">Register</a>
                <?php } ?>
            </div>
        </form>
    </div>
</div>

<script type="text/javascript">
jQuery(
    function($) {
        $('#btn-forgot').on(
            'click', function(e) {
                e.preventDefault();
                $('#LoginForm_password').removeProp('required').removeClass('required');
                $('input#forgot').val(1);
                $('form#login-form').submit();
            }
        );

        /** Remote authentication redirects **/
        $('.remote-login-providers').on(
            'click', 'i', function(e) {
                e.preventDefault();

                var _provider = $(this).data('provider');

                if (_provider) {
                    window.top.location.href = '/web/remoteLogin?pid=' + _provider + '&return_url=' + encodeURI(window.top.location);
                }
            }
        );
    }
);
</script>
