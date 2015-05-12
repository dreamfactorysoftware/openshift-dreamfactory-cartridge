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
/* @var $this WebController */
/* @var $model InitDataForm */
/* @var $form CActiveForm */

$this->pageTitle = Yii::app()->name . ' - Install System Data';
$this->breadcrumbs = array(
    'Install System Data',
);
?>
<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Data Initialization</h2>

        <?php if ( Yii::app()->user->hasFlash( 'init-data' ) ): ?>

            <div class="flash-success">
                <?php echo Yii::app()->user->getFlash( 'init-data' ); ?>
            </div>

        <?php else: ?>

            <p>Your DSP requires the installation of system data in order to be properly configured. <br /> When you are ready, click the
                <strong>Install</strong> button to add this data.</p>

            <?php $form = $this->beginWidget(
                'CActiveForm',
                array(
                    'id'                     => 'init-data-form',
                    'enableClientValidation' => true,
                    'clientOptions'          => array(
                        'validateOnSubmit' => true,
                    ),
                )
            ); ?>

            <input type="hidden" name="InitDataForm[dummy]" id="InitDataForm_dummy" value="1">

            <?php echo $form->errorSummary( $model ); ?>


            <div class="form-buttons">
                <button type="submit" class="btn btn-success pull-right">Install</button>
            </div>

            <?php $this->endWidget(); ?>

        <?php endif; ?>
    </div>
</div>
