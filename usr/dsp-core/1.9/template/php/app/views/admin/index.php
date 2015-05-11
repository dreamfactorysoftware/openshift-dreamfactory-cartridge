<?php
/**
 * @var array $resourceColumns
 */
use DreamFactory\Common\Enums\PageLocation;
use DreamFactory\Platform\Enums\ResponseFormats;
use DreamFactory\Yii\Utility\Pii;
use Kisma\Core\Utility\Inflector;
use Kisma\Core\Utility\Option;

$_state = $_content = $_tabs = null;

Pii::scriptFile( '/js/df.datatables.js', PageLocation::End );

//if ( null !== ( $_state = Pii::getState( 'admin.state' ) ) )

$_state = array();

$_class = ' class="active"';

foreach ( $resourceColumns as $_resource => $_config )
{
	$_html = '<h3>Coming Soon!</h3>';
	$_buttons = $_labels = null;
	$_active = $_resource == 'app' ? ' active' : null;

	//	Get/create a menu name
	$_menuName = Option::get(
		$_config,
		'menu_name',
		Option::get(
			$_config,
			'header',
			Inflector::pluralize( $_config['resource'] )
		)
	);

	if ( isset( $_config['labels'] ) && !empty( $_config['labels'] ) )
	{
		$_id = 'tab-' . $_resource;
		$_count = 0;

		foreach ( $_config['labels'] as $_label )
		{
			$_labels .= '<th>' . $_label . '</th>';
			$_count++;
		}

		if ( null !== ( $_displayName = Option::get( $_config, 'display_name' ) ) )
		{
			$_buttons = '<button class="btn btn-success" id="create-' . $_resource . '">Add ' . $_displayName . '</button>';
		}

		$_html
			= <<<HTML
<h3>{$_config['header']}<div id="admin-toolbar" class=" pull-right">{$_buttons}</div></h3>
<table class="table table-striped table-hover table-bordered table-resource" id="{$_resource}-table">
<thead>
	<tr>{$_labels}</tr>
</thead>
<tbody>
	<tr>
		<td colspan="{$_count}" class="dataTables_empty">Nothing to see here. Move along...</td>
	</tr>
</tbody>
</table>
HTML;
	}

	$_content .= '<div class="tab-pane' . $_active . '" id="tab-' . $_resource . '">' . $_html . '</div>';

	$_tabs .= '<li ' . $_class . '><a href="#tab-' . $_resource . '" data-toggle="tab"><i class="icon-gear"></i> ' . $_menuName . '</a></li> ';
	$_class = null;
}

//	Fix up functions
$_dtConfig = json_encode( $resourceColumns );
$_dtConfig = str_replace( array( '"##', '##"', '\"' ), array( null, null, '"' ), $_dtConfig );

$_state['dtConfig'] = $_dtConfig;
$_state['content'] = $_content;
$_state['tabs'] = $_tabs;

//	Pii::setState( 'admin.state', json_encode( $_state ) );
//}
//else
//{
//	$_state = json_decode( $_state, true );
//
//	$_dtConfig = $_state['dtConfig'];
//	$_content = $_state['content'];
//	$_tabs = $_state['tabs'];
//}

?>
<div class="container">
	<div class="tabbable tabs-left">
		<ul class="nav nav-tabs">
			<?php echo $_tabs; ?>
		</ul>

		<div class="tab-content"><?php echo $_content; ?></div>
	</div>
</div>

<script type="text/javascript">
jQuery(function($) {
	var _dtColumns = <?php echo $_dtConfig; ?>, _fields;

	if (window.location.hash) {
		var _hash = window.location.hash.replace('#tab-', '');

		$('li.active').removeClass('active');
		var $_tab = $('li a[href="' + window.location.hash + '"]');
		$_tab.parent().addClass('active');
		if (_tables[_hash]) {
			console.log('clearing prior hash ' + _hash);
			_tables[_hash] = null;
		}
		console.log('showing: ' + _hash);
		$_tab.trigger('shown');
	}

	$('button[id^="create-"]').on('click', function(e) {
		var _resource = $(this).attr('id').replace('create-', '');
		window.location.href = '/admin/create?resource=' + _resource;
		return false;
	});

	$('a[data-toggle="tab"]').on('shown', function(e) {
		var _type = $(e.target).attr('href').replace('#tab-', '');
		var _id = '#' + _type + '-table';

		console.log('shown ' + _type);

		if ($.fn.DataTable.fnIsDataTable($(_id)[0])) {
			$(_id).dataTable().fnDestroy();
			$(_id).empty();
		}

		if (_dtColumns[_type]) {
			var _fields = _dtColumns[_type].fields;
			var _resource = _dtColumns[_type].resource;
			var _columns = _dtColumns[_type].columns;

			$(_id).dataTable({
								 bProcessing:     true,
								 bServerSide:     true,
								 bStateSave:      true,
								 sAjaxSource: "/rest/system/" + _resource,
								 sPaginationType: "bootstrap",
								 aoColumns:       _columns,
								 oLanguage:       {
									 sSearch: "Filter:"
								 },
								 fnServerParams:  function(aoData) {
									 aoData.push({ "name": "format", "value": <?php echo ResponseFormats::DATATABLES; ?> },
												 { "name": "app_name", "value": "php-admin" }, { "name": "fields", "value": _fields });
								 }
							 });
		}
	});

	//	Make the active tab load
	$('li.active a').trigger('shown');

	/* Add events */
	$('.table-resource').on('click', 'tbody tr', function() {
		var _row = $('td', this);
		var _id = $(_row[0]).text();
		window.location.href = '/admin/' + $(this).closest('table').attr('id').replace('-table', '') + '/update/' + _id;
		return false;
	});
});

</script>
