<?php
use Kisma\Core\Utility\Inflector;
use Kisma\Core\Utility\Option;

/**
 * @var array $resourceColumns
 */
$_content = $_tabs = null;

$_class = ' class="active"';

foreach ( $resourceColumns as $_resource => $_config )
{
	$_html = '<h3>Coming Soon!</h3>';
	$_labels = null;
	$_active = $_resource == 'apps' ? ' active' : null;

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

		$_html
			= <<<HTML
<h3>{$_config['header']}<div id="admin-toolbar" class=" pull-right"></div></h3>
<div id="{$_resource}-table"></div>
HTML;
		/**
		 * <table class="table table-striped table-hover table-bordered" id="{$_resource}-table">
		 * <thead>
		 * <tr>{$_labels}</tr>
		 * </thead>
		 *
		 * <tbody>
		 * <tr>
		 * <td colspan="{$_count}" class="dataTables_empty">Momentito...</td>
		 * </tr>
		 * </tbody>
		 * </table>

		 */
	}

	$_content .= '<div class="tab-pane' . $_active . '" id="tab-' . $_resource . '">' . $_html . '</div>';

	$_tabs .= '<li ' . $_class . '><a href="#tab-' . $_resource . '" data-toggle="tab"><i class="icon-gear"></i> ' . $_menuName . '</a></li> ';
	$_class = null;
}

//	Fix up functions
$_dtConfig = json_encode( $resourceColumns );
$_dtConfig = str_replace( array( '"##', '##"', '\"' ), array( null, null, '"' ), $_dtConfig );

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

	$('a[data-toggle="tab"]').on('shown', function(e) {
		var _type = $(e.target).attr('href').replace('#tab-', '');
		var _id = '#' + _type + '-table';

		var _table = $(_id).data('jtable');

		if (!_table) {
			if (_dtColumns && _dtColumns[_type]) {
				var _fields = _dtColumns[ _type ].fields;
				var _resource = _dtColumns[ _type ].resource;
				var _columns = _dtColumns[ _type ].columns;
				var _header = _dtColumns[ _type ].header || _type;

				_table = $(_id).jtable({
					itemName:     _dtColumns[ _type ].resourceName || _type,
					useHttpVerbs: true,
					title:        _header,
					ajaxSettings: {
						data: {
							'app_name': 'admin',
							'format':   101
						}
					},
					actions:      {
						listAction:   '/rest/system/' + _resource + '?fields=' + ( _dtColumns[ _type ].listFields || 'id,name'),
						createAction: '/rest/system/' + _resource,
						updateAction: '/rest/system/' + _resource,
						deleteAction: '/rest/system/' + _resource
					},
					fields:       _fields
				}).jtable('load');

				$(_id).data('jtable', _table);
			}
		} else {
			if (_table && _table.oApi) {
				_table.oApi.fnReloadAjax();
			}
		}
	});

//	Make the first tab load
	$('li.active a').trigger('shown');
});
</script>