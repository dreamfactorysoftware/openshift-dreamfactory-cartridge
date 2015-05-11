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
/* @var $model UpgradeDspForm */
/* @var $form CActiveForm */

$this->pageTitle = Yii::app()->name . ' - Upgrade';
$this->breadcrumbs = array(
    'Upgrade DSP',
);
?>

<div class="box-wrapper">
    <div id="formbox" class="form-light boxed drop-shadow lifted">

        <?php if ( Yii::app()->user->hasFlash( 'upgrade-dsp' ) ): ?>
            <h2 class="inset">Upgrade DSP</h2>

            <div class="flash-success">
                <?php echo Yii::app()->user->getFlash( 'upgrade-dsp' ); ?>
            </div>

        <?php elseif ( empty( $model->versions ) ): ?>
            <h2 class="inset">No Upgrade Available</h2>

            <p>This DSP is currently running the latest available version. <br />
                If you have just successfully upgraded, please clear your browser cache to ensure you have the latest interface.
            </p>

            <div class="form-buttons">
                <button type="button" id="btn-home" class="btn btn-default pull-left">Home</button>
            </div>

        <?php
        else: ?>
            <h2 class="inset">Upgrade Available</h2>

            <p>There is a newer software version available for this DSP. <br /> Peruse the available versions and select 'How To Upgrade' button below for instructions on upgrading your DSP.
            </p>

            <?php $form = $this->beginWidget(
                'CActiveForm',
                array(
                    'id'                     => 'upgrade-dsp-form',
                    'enableClientValidation' => true,
                    'clientOptions'          => array(
                        'validateOnSubmit' => true,
                    ),
                )
            ); ?>

            <div class="row">
                <?php echo $form->hiddenField( $model, 'dummy' ); ?>
            </div>
            <div class="form-group">
                <?php echo $form->dropDownList( $model, 'selected', $model->versions, array( 'class' => 'btn btn-default' ) ); ?>
            </div>

            <?php echo $form->errorSummary( $model ); ?>

            <div class="form-buttons">
                <button type="button" id="btn-home" class="btn btn-default pull-left">Home</button>
                <a href="https://github.com/dreamfactorysoftware/dsp-core/wiki/Product-Upgrades" target="_blank" class="btn btn-success pull-right">How To Upgrade</a>
            </div>

            <?php $this->endWidget(); ?>

        <?php endif; ?>
    </div>
</div>

<script type="text/javascript">
jQuery(function($) {
    $('#btn-home').on('click', function(e) {
        e.preventDefault();
        window.location.href = '/';
    });
});
</script>