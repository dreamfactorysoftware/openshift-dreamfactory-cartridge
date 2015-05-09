<?php
/**
 * _provider.form.php
 *
 * @var WebController           $this
 * @var array                   $schema
 * @var BasePlatformSystemModel $model
 * @var array                   $_formOptions Provided by includer
 * @var array                   $errors       Errors if any
 * @var string                  $resourceName The name of this resource (i.e. App, AppGroup, etc.) Essentially the model name
 * @var string                  $displayName
 * @var string                  $statusMessage
 */
use DreamFactory\Common\Enums\PageLocation;
use DreamFactory\Platform\Yii\Models\BasePlatformSystemModel;
use DreamFactory\Yii\Utility\BootstrapForm;
use DreamFactory\Yii\Utility\Pii;
use Kisma\Core\Utility\Bootstrap;
use Kisma\Core\Utility\Option;

Pii::cssFile( '//cdnjs.cloudflare.com/ajax/libs/x-editable/1.4.5/bootstrap-editable/css/bootstrap-editable.css' );
Pii::scriptFile( '//cdnjs.cloudflare.com/ajax/libs/x-editable/1.4.5/bootstrap-editable/js/bootstrap-editable.min.js', PageLocation::End );

$_css .= '<link href="" rel="stylesheet" />';
echo '<script src=""></script>';


//@TODO error handling from resource request
$_errors = isset( $errors ) ? Option::clean( $errors ) : array();
$_update = !$model->isNewRecord;
$_prefix = @end( @explode( '\\', $this->getModelClass() ) );

$_resourcePath = $resourceName;

if ( $_update )
{
	$_resourcePath .= '/' . $model->id;
}

if ( !empty( $_errors ) )
{
	$_headline = ( isset( $alertMessage ) ? $alertMessage : 'Sorry pal...' );
	$_messages = null;

	foreach ( $_errors as $_error )
	{
		foreach ( $_error as $_message )
		{
			$_messages .= '<p>' . $_message . '</p>';
		}
	}

	echo <<<HTML
<div class="alert alert-error alert-block alert-fixed fade in" data-alert="alert">
	<strong>{$_headline}</strong>
	{$_messages}</div>
HTML;
}

if ( null !== ( $_status = Pii::getState( 'status_message' ) ) )
{
	echo <<<HTML
<div class="alert alert-success alert-block fade in" data-alert="alert">
	<strong>Success!</strong><br/>
	{$_status}
</div>
HTML;

	Pii::clearState( 'status_message' );
}

$_hashedId = $model->isNewRecord ? null : $this->hashId( $model->id );

$_form = new BootstrapForm(
	Bootstrap::Horizontal,
	array(
		'id'             => 'update-resource',
		'method'         => 'POST',
		'x_editable_url' => '/admin/' . $resourceName . '/update',
		'x_editable_pk'  => $_hashedId,
		'prefix'         => $_prefix,
	)
);

//	Make sure the renderer removes these...
$_form->setRemovePrefix( ConsoleController::SCHEMA_PREFIX );

$_form->setFormData( $model->getAttributes() );

$_fields = array(
	'Basic Settings' => array(
		'api_name'      => array(
			'type'        => 'text',
			'class'       => $model->isNewRecord ? 'required' : 'uneditable-input',
			'placeholder' => 'How to address this provider via REST',
			'hint'        => 'The URI portion to be used when calling this provider. For example: "github", or "facebook".',
			'maxlength'   => 64,
		),
		'provider_name' => array(
			'type'      => 'text',
			'class'     => 'required' . ( $_update ? ' x-editable' : null ),
			'hint'      => 'The real name, or "display" name for this provider.',
			'maxlength' => 64,
		),
	),
	'Configuration'  => $schema,
	'Metrics'        => array(
		'created_date'       => array(
			'type'  => 'text',
			'class' => 'uneditable-input',
		),
		'last_modified_date' => array(
			'type'  => 'text',
			'class' => 'uneditable-input',
		),
	),
);
?>
<div class="row-fluid" style="border-bottom:1px solid #ddd">
	<div class="pull-right">
		<h2 style="margin-bottom: 0"><?php echo $displayName ?>
			<small><?php echo( $_update ? 'Edit' : 'New' ); ?></small>
		</h2>
	</div>
</div>

<div class="row-fluid">
	<div class="span12">
		<form id="update-platform"
			method="POST"
			class="form-horizontal tab-form"
			action="/admin/<?php echo $resourceName; ?>/update<?php echo isset( $model, $model->id ) ? '/' . $model->id : null; ?>">
			<?php $_form->renderFields( $_fields, $_prefix ); ?>

			<div class="pull-right" style="display: inline-block; margin-top: 10px;">
				<div id="form-button-bar" style="display:inline;">
					<button class=" btn btn-danger" id="delete-resource"> Delete</button>
					<button type="submit" class="btn btn-success btn-primary" id="save-resource"> Save</button>
				</div>
			</div>
		</form>
	</div>
</div>

<script type="text/javascript">
jQuery(function($) {
	$('form#form-button-bar').on('click', 'button', function(e) {
		e.preventDefault();
		var _cmd = $(this).attr('id').replace('-resource', '');
		var _id = $(this).data('row-id');

		if ('delete' == _cmd) {
			if (!confirm('Do you REALLY REALLY wish to perform this action? It is irreversible!')) {
				return false;
			}
		}

		$.ajax({url:         '/admin/provider/update',
				   method:   'POST',
				   dataType: 'json',
				   data:     {id: _id, action: _cmd },
				   async:    false,
				   success:  function(data) {
					   if (data && data.success) {
						   alert('Your provider request has been queued.');
					   } else {
						   alert('There was an error: ' + data.details.message);
					   }
				   }
			   });

		return false;
	});

	$('.legend-button-bar a').on('click', function(e) {
		alert('Not available');
	});

	$.fn.editable.defaults.mode = 'inline';
	$('a.x-editable').editable({
								   url:         '/admin/provider/update',
								   emptytext:   'None',
								   ajaxOptions: {
									   dataType: 'json'
								   },
								   error:       function(errors) {
									   var _data = JSON.parse(errors.responseText);
									   return _data.details.message;
								   }
							   });
});
</script>
