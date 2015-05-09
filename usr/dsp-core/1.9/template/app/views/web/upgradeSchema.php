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
/* @var $model UpgradeSchemaForm */
/* @var $form CActiveForm */

$this->pageTitle = Yii::app()->name . ' - Upgrade Schema';
$this->breadcrumbs = array(
    'Upgrade Schema',
);
?>

<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">
        <h2 class="inset">Database Update Required</h2>

        <?php if ( Yii::app()->user->hasFlash( 'upgrade-schema' ) ): ?>

            <div class="flash-success">
                <?php echo Yii::app()->user->getFlash( 'upgrade-schema' ); ?>
            </div>

        <?php else: ?>

            <p>A database schema upgrade is required for this DreamFactory Services Platform&trade;. If you would like to backup your database, now is the time to do so. Click the
                <strong>Upgrade</strong> button below to proceed.</p>

            <?php $form = $this->beginWidget(
                'CActiveForm',
                array(
                    'id'                     => 'upgrade-schema-form',
                    'enableClientValidation' => true,
                    'clientOptions'          => array(
                        'validateOnSubmit' => true,
                    ),
                )
            ); ?>

            <input type="hidden" name="UpgradeSchemaForm[dummy]" id="UpgradeSchemaForm_dummy" value="1">

            <?php echo $form->errorSummary( $model ); ?>


            <div class="form-buttons">
                <button type="submit" class="btn btn-success pull-right">Upgrade</button>
            </div>

            <?php $this->endWidget(); ?>

        <?php endif; ?>
    </div>
</div>