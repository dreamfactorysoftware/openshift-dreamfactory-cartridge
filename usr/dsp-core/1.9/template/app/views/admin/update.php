<?php
/**
 * @var WebController           $this
 * @var array                   $schema
 * @var BasePlatformSystemModel $model
 * @var array                   $_formOptions Provided by includer
 * @var array                   $errors       Errors if any
 * @var string                  $resourceName The name of this resource (i.e. App, AppGroup, etc.) Essentially the model name
 * @var string                  $displayName
 * @var array                   $_data_
 */
use DreamFactory\Yii\Utility\BootstrapForm;
use Kisma\Core\Utility\Inflector;

$update = false;

$_form = new BootstrapForm();

$_options = array(
	'breadcrumbs' => array(
		'Admin Dashboard'                         => '/admin',
		Inflector::display( $resourceName ) . 's' => '/admin',
		$displayName                              => false,
	)
);

$_formOptions = $_form->pageHeader( $_options );

//	Render the form
$this->renderPartial( '_' . $resourceName . '_form', $_data_ );
