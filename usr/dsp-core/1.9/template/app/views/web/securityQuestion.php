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
 * @var SecurityForm  $model
 * @var CActiveForm   $form
 */

Validate::register(
    'form#security-form',
    array(
        'ignoreTitle'    => true,
        'errorClass'     => 'error',
        'errorPlacement' => 'function(error,element){error.appendTo(element.closest("div.form-group"));error.css("margin","-10px 0 0");}',
        'rules'          => array(
            'SecurityForm[answer]'         => array(
                'required' => true,
            ),
            'SecurityForm[password]'       => array(
                'required'  => true,
                'minlength' => 5,
            ),
            'SecurityForm[passwordRepeat]' => array(
                'required'  => true,
                'minlength' => 5,
                'equalTo'   => '#SecurityForm_password',
            ),
        ),
    )
);

CHtml::$errorSummaryCss = 'alert alert-danger';

?>
<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Password Reset Security Question</h2>

        <p>Please enter your answer to the following security question.</p>

        <p>Also, enter and confirm your desired new password.</p>

        <?php
        $form = $this->beginWidget(
            'CActiveForm',
            array(
                'id'                     => 'security-form',
                'enableClientValidation' => true,
                'clientOptions'          => array(
                    'validateOnSubmit' => true,
                ),
            )
        );
        ?>

        <?php if ( Yii::app()->user->hasFlash( 'security-form' ) ): ?>

            <div class="alert alert-success">
                <?php echo Yii::app()->user->getFlash( 'security-form' ); ?>
            </div>

        <?php endif; ?>
        <?php echo $form->errorSummary(
            $model,
            '<strong>Please check your entries...</strong>',
            null,
            array( 'style' => 'margin-bottom: 15px;' )
        ); ?>

        <input type="hidden" name="SecurityForm[email]" id="SecurityForm_email" value="<?php echo $model->email; ?>">

        <div class="form-group">
            <label for="SecurityForm_question" class="sr-only">Security Question</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-question fa-fw"></i></span>

                <input class="form-control" type="text" readonly id="SecurityForm_question" name="SecurityForm[question]"
                       value="<?php echo $model->question; ?>" />
            </div>
        </div>
        <div class="form-group">
            <label for="SecurityForm_answer" class="sr-only">Security Answer</label>

            <div class="input-group">
                <span class="input-group-addon bg_dg"><i class="fa fa-key fa-fw"></i></span>

                <input tabindex="1" class="form-control password required" autofocus type="password" id="SecurityForm_answer"
                       name="SecurityForm[answer]" placeholder="Security Answer" />
            </div>
        </div>
        <div class="form-group">
            <label for="SecurityForm_password" class="sr-only">Password</label>

            <div class="input-group">
                <span class="input-group-addon bg_ly"><i class="fa fa-lock fa-fw"></i></span>

                <input tabindex="2" class="form-control password required" type="password" id="SecurityForm_password"
                       name="SecurityForm[password]" placeholder="Password" />
            </div>
        </div>
        <div class="form-group">
            <label for="SecurityForm_passwordRepeat" class="sr-only">Verify Password</label>

            <div class="input-group">
                <span class="input-group-addon bg_ly"><i class="fa fa-check fa-fw"></i></span>

                <input tabindex="3" class="form-control password required" type="password" id="SecurityForm_passwordRepeat"
                       name="SecurityForm[passwordRepeat]" placeholder="Verify Password" />
            </div>
        </div>

        <div class="form-buttons">
            <button type="submit" class="btn btn-success pull-right">Save</button>
        </div>

        <?php $this->endWidget(); ?>
    </div>
</div>
