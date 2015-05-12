<?php
/**
 * @var $this   WebController
 * @var $model  BasePlatformSystemModel
 */

use DreamFactory\Common\Enums\PageLocation;
use DreamFactory\Platform\Yii\Models\BasePlatformSystemModel;
use DreamFactory\Yii\Utility\Pii;

$_html = null;

Pii::cssFile( '/css/df.datatables.css' );
Pii::scriptFile(
	array(
		'/static/datatables/js/jquery.dataTables.js',
		'/js/df.datatables.js'
	),
	PageLocation::End
);

foreach ( $models as $_model )
{
	if ( isset( $_model['email_addr_text'] ) )
	{
		$_email
			= '<a title="Click to view this user in Drupal" target="_blank" href="https://www.dreamfactory.com/user/' . $_model['drupal_id'] . '">' .
			  $_model['email_addr_text'] .
			  '</a>';
		$_lastLogin = $_model['last_login_date'];
	}
	else
	{
		$_email = 'Unknown';
		$_lastLogin = 'Unknown';
	}

	$_html .= '<tr id="' . $this->hashId( $_model['id'] ) . '">';
	$_html .=
		'<td>' .
		$_model['instance_name_text'] .
		'<a title="Click to edit this row" class="pull-right" href="#"><i class="icon-pencil hide edit-row"></i></a></td>';
	$_html
		.= '<td><a title="Click to browse this URL" target="_blank" href="http://' . $_model['public_host_text'] . '">' .
		   $_model['public_host_text'] .
		   '</a></td>';
	$_html .= '<td>' . $_email . '</td>';
	$_html .= '<td>' . $_model['create_date'] . '</td>';
	$_html .= '<td>' . $_lastLogin . '</td>';
	$_html .= '</tr>';
	unset( $_model );
}


?>
<div class="row-fluid" style="border-bottom:1px solid #ddd">
	<div class="span8">
		<h3 style="margin-bottom: 0">Platform Management</h3>
	</div>
	<div class="span4" style="margin-top:10px">
		<span class="pull-right">
			<form method="POST" style="display:inline;">
				<input type="hidden" name="launch_instance" value="1">
				<button class="btn btn-success" id="launch-instance">Launch Instance</button>
			</form>
			<button rel="" disabled="disabled" class="btn btn-danger" id="delete-instance">Delete Instance</button>
		</span>
	</div>
</div>

<div class="row-fluid">
	<div class="span12">
		<table class="table table-striped table-bordered table-hover" id="platforms-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>URL</th>
					<th>Owner</th>
					<th>Create Date</th>
					<th>Last Login</th>
				</tr>
			</thead>
			<tbody>
				<?php echo $_html; ?>
			</tbody>
		</table>
	</div>
</div>
<script type="text/javascript">
var $_table;
jQuery(function($) {
	var $_delete = $('button#delete-instance');

	$_table = $('#platforms-table');

	$_table.dataTable({
						  "sDom":            "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
						  "sPaginationType": "bootstrap",
						  "oLanguage":       {
							  "sSearch":     "Filter:",
							  "sLengthMenu": "_MENU_ records per page"
						  }
					  });

	$_delete.on('click', function(e) {
		e.preventDefault();

		if ($(this).attr('rel')) {
			if (confirm('Really delete DSP "' + $(this).data('platform-name') + '"?')) {
				alert('Not implemented');
			}
		}

		$(this).attr('disabled', 'disabled');
		return false;
	});

	/**
	 * Clicking outside of the table disables the delete button...
	 */
	$('html').on('click', function() {
		$_delete.attr('disabled', 'disabled');
		$_delete.removeAttr('rel');
		$('#platforms-table').find('tbody tr.info').removeClass('info');
	});

	/**
	 * Clicking a table row, enables the delete button
	 */
	$_table.on('click', 'tbody tr', function(e) {
		$(this).parent().find('tr.info').removeClass('info');
		var _name = $('td:first-child', this).html(), _id = $(this).attr('id');
		$_delete.removeAttr('disabled');
		$_delete.attr('rel', _id);
		$_delete.data('platform-name', _name);
		$(this).addClass('info');

		//	Kill propagation of this event
		e.stopPropagation();
	});

	/**
	 * Show the edit icon on hover
	 */
	$_table.on('mouseenter mouseleave', 'tbody tr td:first-child', function(e) {
		if ('mouseenter' == e.type) {
			$('a i.edit-row', $(this)).show();
		} else {
			$('a i.edit-row', $(this)).hide();
		}
	});

	/**
	 * Edit platform when icon is clicked
	 */
	$('td i.edit-row').on('click', function(e) {
		window.location.href = '/platform/update/id/' + $(this).closest('tr').attr('id');
		return false;
	});
});
</script>
