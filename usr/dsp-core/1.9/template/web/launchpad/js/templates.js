/**
 * Created with JetBrains PhpStorm.
 * User: jasonsykes
 * Date: 1/7/13
 * Time: 11:37 AM
 * To change this template use File | Settings | File Templates.
 */
var Templates = {
	thumbPanel:   "<h1>{{name}}</h1><br/>{{desc}}",
	alertMessage: '<div class="alert">' +
				  '<a class="close" data-dismiss="alert">x</a>' +
				  '{{message}}' +
				  '</div>',
	gridTemplate: '<table id="db-tables" class="table table-bordered table-striped">' +
				  '<thead>' +
				  '<tr>' +
				  '<th class="table-names-header">Table Name</th>' +
				  '</tr>' +
				  '</thead>' +
				  '<tbody>' +
				  '{{#table}}' +
				  '<tr>' +
				  '<td onclick = "Actions.loadSchema(\'{{name}}\')")>{{name}}</td>' +
				  '</tr> ' +
				  '{{/table}}' +
				  '</tbody>' +
				  '</table>',
	appTemplate: '<table id="db-tables" class="table table-bordered table-striped">' +
				 '<thead>' +
				 '<tr>' +
				 '<th class="table-names-header">Applications</th>' +
				 '</tr>' +
				 '</thead>' +
				 '<tbody>' +
				 '{{#record}}' +
				 '<tr>' +
				 '<td>{{fields.label}}</td>' +
				 '</tr> ' +
				 '{{/record}}' +
				 '</tbody>' +
				 '</table>',
	appIconTemplate: '<div class="accordion" id="app-groups-container">' +
					 '{{#Applications.app_groups}}' +
					 '<div class="accordion-group">' +
					 '<div class="accordion-heading">' +
					 '<a class="accordion-toggle" data-toggle="collapse" data-parent="#app-groups-container" href="#collapse-{{id}}">' +
					 '<div class="make-inline">' +
					 '<div class="group-icon pull-left">' +
					 '<i class="icon-chevron-right group-icon-position"></i>' +
					 '</div>' +

					 '<h3 class="group-title pull-left">{{name}}</h3>' +
					 //'<p class="group-description">{{description}}</p>' +
					 '</div>' +
					 '</a>' +
					 '</div>' +
					 '<div id="collapse-{{id}}" class="accordion-body collapse">' +
					 '<div class="accordion-inner group-items">' +
					 '<ul>' +
					 '{{#apps}}' +

					 '<li>' +
					 '<a onclick = "Actions.showApp(\'{{api_name}}\',\'{{launch_url}}\',\'{{is_url_external}}\',{{requires_fullscreen}})">' +
					 '<h4>{{name}}</h4>' +
					 '<p>{{description}}</p>' +
					 '</a>' +
					 '</li>' +
					 '{{/apps}}' +
					 '</ul>' +
					 '</div>' +
					 '</div>' +
					 '</div>' +
					 '{{/Applications.app_groups}}' +
					 '{{#Applications.mnm_ng_apps}}' +
					 '<div class="accordion-group">' +
					 '<div class="accordion-heading">' +
					 '<a class="accordion-toggle" data-toggle="collapse" data-parent="#app-groups-container" href="#collapse-no-group">' +
					 '<div class="make-inline">' +
					 '<div class="group-icon pull-left">' +
					 '<i class="icon-chevron-right group-icon-position"></i>' +
					 '</div>' +
					 '<h3 class="group-title pull-left">Default Group</h3>' +
					 //'<p class="group-description">{{description}}</p>' +
					 '</div>' +
					 '</a>' +
					 '</div>' +
					 '<div id="collapse-no-group" class="accordion-body in collapse">' +
					 '<div class="accordion-inner group-items">' +
					 '<ul>' +
					 '{{#apps}}' +
					 '<li>' +
					 '<a onclick = "Actions.showApp(\'{{api_name}}\',\'{{launch_url}}\',\'{{is_url_external}}\',{{requires_fullscreen}}, {{allow_fullscreen_toggle}})">' +
					 '<h4>{{name}}</h4>' +
					 '<p>{{description}}</p>' +
					 '</a>' +
					 '</li>' +
					 '{{/apps}}' +
					 '</ul>' +
					 '</div>' +
					 '</div>' +
					 '</div>' +
					 '{{/Applications.mnm_ng_apps}}' +
					 '</div>',
	navBarTemplate: '<div class="navbar navbar-inverse">' +
					'<div class="container-fluid df-navbar">' +
					'<div class="navbar-spacer">' +
					'<div class="pull-left df-logo"><a href="/"><img src="/img/logo-navbar-194x42.png"></a></div>' +
					'<a class="btn btn-navbar pull-right" data-toggle="collapse" data-target="#main-nav">' +
					'<span class="icon-bar"></span>' +
					'<span class="icon-bar"></span>' +
					'<span class="icon-bar"></span>' +
					'</a>' +
					'</div>' +
					'<div id="error-container" class="alert alert-error center"></div>' +
					'<!-- Everything you want hidden at 940px or less, place within here -->' +
					'<div id="main-nav" class="nav-collapse collapse pull-right">' +
					'<!-- .nav, .navbar-search, .navbar-form, etc -->' +
					'{{#User.activeSession}}' +
					'<a id="apps-list-btn" onclick="Actions.showAppList()" class="btn btn-inverse btn-launch btn-stack disabled" title="Show Apps"><i class="icon-list"></i></a>' +
					'<a onclick="Actions.doProfileDialog()" id="dfProfileLnk" class="btn btn-inverse btn-launch btn-stack" title="Change Your Profile"><i class="icon-user"></i></a>' +
					'<a id="dfPasswordLnk" onclick="Actions.doChangePasswordDialog()" class="btn btn-inverse btn-launch btn-stack" title="Change Your Password"><i class="icon-key"></i></a>' +
					'<a id="fs_toggle" class="btn btn-inverse btn-launch btn-stack" title="Full Screen" ><i class="icon-resize-full"></i></a>' +
					'{{#User.is_sys_admin}}' +
					'<a id="adminLink" class="btn btn-inverse btn-launch btn-stack" title="Admin Console"><i class="icon-cog"></i></a>' +
					'{{/User.is_sys_admin}}' +
					'<a id="helpLink" target="df-new" class="btn btn-inverse btn-launch btn-stack" href="http://www.dreamfactory.com/developers" title="Help"><i class="icon-question-sign"></i></a>' +
					'<a id="dfSignOutLink" onclick="Actions.doSignOutDialog()" class="btn btn-inverse btn-launch btn-stack" title="End Your Session Now"><i class="icon-signout"></i></a>' +
					'{{/User.activeSession}}' +
					'{{^User.activeSession}}' +
					'{{#User.allow_guest_user}}' +
					'<a id="apps-list-btn" onclick="Actions.showAppList()" class="btn btn-inverse btn-launch btn-stack disabled" title="Show Apps"><i class="icon-list"></i></a>' +
					'<a id="fs_toggle" class="btn btn-inverse btn-launch btn-stack" title="Full Screen" ><i class="icon-resize-full"></i></a>' +
					'{{/User.allow_guest_user}}' +
					'<a id="helpLink" target="df-new" class="btn btn-inverse btn-launch btn-stack" href="http://www.dreamfactory.com/developers" title="Help"><i class="icon-question-sign"></i></a>' +
					' <a class="btn btn-inverse btn-launch btn-stack btn-signin" onclick="Actions.doSignInDialog()"><li class="icon-signin"></li>&nbsp;Sign In</a>' +
					'{{#User.allow_open_registration}}' +
					'<a class="btn btn-inverse btn-launch btn-stack btn-signin" onclick="Actions.createAccount()"><li class="icon-key"></li>&nbsp;Create Account</a>' +
					'{{/User.allow_open_registration}}' +
					'{{/User.activeSession}}' +
					'</div>' +
					'</div>' +
					'</div>',
	errorTemplate: '{{#error}}<div class="alert">' +
				   '<button type="button" class="close" data-dismiss="alert">x</button>' +
				   '<strong>{{message}}</strong>' +
				   '</div>{{/error}}',
	loadTemplate: function(template, data, renderTo) {
		var _html = Mustache.render(template, data);
		$('#' + renderTo).html(_html);
	}
};
