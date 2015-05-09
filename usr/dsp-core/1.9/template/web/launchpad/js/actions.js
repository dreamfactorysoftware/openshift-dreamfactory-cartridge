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
Actions = {
	/** @type {*} */
	_config:       {}, /** @type {*}[] */
	_apps:         [], /** @type {jQuery} */
	$_app:         null, /** @type {jQuery} */
	$_appList:     null, /** @type {jQuery} */
	$_error:       null, /** @type {jQuery} */
	$_adminLink:   null, /** @type {jQuery} */
	$_navbar:      null, /** @type {boolean} */
	enableOverlay: false,

	//-------------------------------------------------------------------------
	//	Functions
	//-------------------------------------------------------------------------

	/**
	 * Initialize the component
	 */
	init: function () {
		this.$_error = $('#error-container').hide();
		this.getConfig();
	},

	/**
	 * Loads the DSP configuration and caches
	 * @returns {*}
	 */
	getConfig: function () {
		if (this._config && this._config.length) {
			return this._config;
		}

		var _this = this;

		$.getJSON(this.endpoint('/system/config')).done(
			function (data) {
				Config = _this._config = data;
				document.title = 'LaunchPad ' + data.dsp_version;

				_this.updateSession('init');
			}
		).fail(
			function (response) {
				alertErr(response);
			}
		);

		return false;
	},

	/**
	 * Auto run an app passed in on the command line:
	 *
	 *    https://dsp-awesome.cloud.dreamfactory.com/?run=app-xyz
	 */
	autoRunApp: function () {
		//	Auto-run an app?
		var _appToRun = $.QueryString('run'), _pos = -1, _this = this;

		if (_appToRun && this._apps.length) {
			_appToRun = decodeURIComponent(_appToRun.replace(/\+/g, '%20'));
			//	Strip off any hash
			if (-1 !=
				(
					_pos = _appToRun.indexOf('#')
				)) {
				_appToRun = _appToRun.substr(0, _pos);
			}

			this._apps.forEach(
				function (app) {
					if (app.api_name == _appToRun) {
                        if (app.is_sys_admin) {
                            app.requires_fullscreen = false;
                        }
                        Actions.showApp(
                            app.api_name, app.launch_url, app.is_url_external, app.requires_fullscreen, app.allow_fullscreen_toggle
                        );
                        return false;
					}

					return true;
				}
			);
		}
	},

	/**
	 * Builds an endpoint from an uri
	 *
	 * @param {string} uri
	 * @param {string} [appName]
	 * @returns {string}
	 */
	endpoint: function (uri, appName) {
		var _appName = appName || 'launchpad';
		var _url = CurrentServer + '/rest' + uri;

		return _url +=
			(
				-1 == _url.indexOf('?') ? '?' : '#'
			) + 'app_name=' + _appName;
	},

	createAccount: function () {
		this._redirect('/web/register?return_url=' + encodeURI(window.top.location));
	},

	/**
	 * Load all available apps
	 * @param data
	 * @param action
	 */
	getApps: function (data, action) {
		var _apps = [], _appIds = [], _defaultShown = false, $_defaultApps = $('#default_app'), _options, _this = this;

		this.$_error.hide().empty();

		$_defaultApps.empty();

        // build a unique list of apps, an app can belong to multiple groups

        if (data && data.app_groups) {
            data.app_groups.forEach(
                function (group) {
                    group.apps.forEach(
                        function (app) {
                            if (_appIds.indexOf(app.id) === -1) {
                                _appIds.push(app.id);
                                _apps.push(app);
                            }
                        }
                    );
                }
            );
        }

        if (data && data.no_group_apps) {
            data.no_group_apps.forEach(
                function (app) {
                    if (_appIds.indexOf(app.id) === -1) {
                        _appIds.push(app.id);
                        _apps.push(app);
                    }
                }
            );
        }

		this._apps = _apps;

		_options = '';

		_apps.forEach(
			function (app) {
				if (!_defaultShown && app.is_default) {
					Actions.showApp(app.api_name, app.launch_url, app.is_url_external, !data.is_sys_admin, app.allow_fullscreen_toggle);
					_defaultShown = true;
					// _this.toggleAdminLink(false);
				}

				_options += '<option value="' + app.id + '">' + app.name + '</option>';
			}
		);

		$_defaultApps.append(_options + '<option value>None</option>');

		if ('update' == action) {
			return;
		}

		if (data.is_sys_admin) {
			if (_defaultShown) {
				return;
			}
            this.showAdmin();
			return ;
		}

        // If no apps present show error.
        if (_apps.length === 0) {
            this.$_error.html("Sorry, it appears you have no active applications.  Please contact your system administrator").show();
            return this;
        }

        // If there is a single app present we should launch it immediately.

        var _app = null;
        if (_apps.length === 1) {
            _app = _apps[0];
        }

		if (_app) {


            this.showApp(_app.api_name, _app.launch_url, _app.is_url_external, _app.requires_fullscreen, _app.allow_fullscreen_toggle);
            return this;
		}

		return this.showAppList();
	},

	showApp: function (name, url, type, fullscreen, allowFullScreenToggle) {
		this._showHideAppList(false);

        // For some reason were getting a string for false and a bool for true
        // Convert false to bool here
        allowFullScreenToggle = allowFullScreenToggle !== 'false' && allowFullScreenToggle != false;


		$('iframe').hide();

		//	Show the admin if your an admin
		if ('admin' === name) {
			var $_admin = $('#admin');

			if ($_admin.length) {
				$_admin.show();
			} else {
				var $_adminApp = this.buildAppFrame(name, url);

				if ($_admin.length) {
					$_admin.replaceWith($_adminApp);
				}
			}

            // console.log('ShowApp fn: admin')
			// this.toggleLinksForApp('admin');
            // this.toggleFullScreen(false);
			return;
		}

		var $_app = $('#' + name);

		//	Check if there is an element with this id
		if (!$_app.length) {
			var _url = replaceParams(url, name);
			$_app.appendTo(this.buildAppFrame(name, _url));
		}

		//check if that element requires fullscreen
		if (fullscreen) {
			this.requireFullScreen();
		}

		// Show the app
		// this.toggleAdminLink(true);
		this.toggleAppsListLink(true);

		this.toggleFullScreenLink(allowFullScreenToggle);
        this.toggleFullScreen(!allowFullScreenToggle);

		$_app.show();
	},

	/**
	 * Builds a standard iframe
	 * @param {string} name
	 * @param {string} url
	 * @param {boolean} [doNotAppend]
	 * @returns {*|jQuery|HTMLElement}
	 */
	buildAppFrame: function (name, url, doNotAppend) {
		var $_frame = $(
			'<iframe seamless="seamless" id="' + name + '" name="' + name + '" class="app-loader" src="' + url + '"></iframe>'
		);

		if (!doNotAppend) {
			$_frame.appendTo('#app-container');
		}

		return $_frame;
	},

	showAppList: function () {
		this.$_app.css({'z-index': 1});
		this._showHideAppList(true);
	},

	toggleAdminLink: function (on) {
		if (!this.$_adminLink) {
			this.$_adminLink = $('#adminLink');
		}

		if (on) {
			this.toggleLink(
				'#adminLink', false, function () {
					Actions.showAdmin();
				}
			);
		} else {
			this.toggleLink('#adminLink', true, true);
		}
	},

	toggleFullScreenLink: function (on) {

		if (on) {
			this.toggleLink(
				'#fs_toggle', false, Actions.toggleFullScreen(true)
			);
		} else {
			this.toggleLink(
				'#fs_toggle', true, Actions.toggleFullScreen(false)
			);
		}

	},

	toggleAppsListLink: function (on) {
		this.toggleLink('#apps-list-btn', !on);
	},

	/**
	 * Show the admin app
	 */
	showAdmin: function () {

		var name = 'admin', url = '/admin/#/', type = 0, fullscreen = false, allowToggle = false;

		this.showApp(name, url, type, fullscreen, allowToggle);

        // console.log('ShowAdmin func')
		// this.toggleAdminLink(false);
		// this.toggleFullScreenLink(true);

		return this;
	},

	appGrouper: function (sessionInfo) {

		// Check if sessionInfo has any apps in the no_group_apps array
		if (sessionInfo.no_group_apps.length > 0) {
			// It does have apps!

			//create an array variable to store these apps
			sessionInfo.mnm_ng_apps = [];

			// Fire up an new object
			var apps = {};

			// create the property 'apps' on our new object
			apps.apps = sessionInfo.no_group_apps;

			// remove apps not launchable from here
			var no_url_apps = [];

			$.each(
				apps.apps, function (k, v) {
					if ('' === v.launch_url) {
						no_url_apps.push(k);
					}
				}
			);

			no_url_apps.reverse();

			$.each(
				no_url_apps, function (k, v) {
					apps.apps.splice(v, 1);
				}
			);

			// push this new app object onto our array
			sessionInfo.mnm_ng_apps.push(apps);

			return false;

			// **Note** I'm doing all this to mimick how the app_groups are returned
			// in order to put ungrouped apps into a group for display.
			// I know there is a better way...
		}
	},

	updateSession: function (action) {
		var _this = this;

		this.$_navbar = $('#navbar-container');
		this.$_app = $('#app-container');
		this.$_appList = $('#app-list-container');

		$.ajax({dataType: 'json', url: CurrentServer + '/rest/user/session?app_name=launchpad'}).done(
			function (sessionInfo) {
				CurrentSession = sessionInfo;
				Actions.appGrouper(sessionInfo);
				sessionInfo.activeSession = false;

				CurrentUserID = sessionInfo.id;

				if (CurrentUserID) {
					sessionInfo.activeSession = true;
				}

				sessionInfo.allow_open_registration = Config.allow_open_registration;
				sessionInfo.allow_guest_user = Config.allow_guest_user;
				sessionInfo.show_apps_list_btn =
					(
					sessionInfo.activeSession || sessionInfo.allow_guest_user
					);

                // A few helper functions
                var hasAppGroups = function(sessionInfo) {

                    return sessionInfo.app_groups.length > 0;

                }
                var hasOneAppInGroup = function (sessionInfo) {

                    if (sessionInfo.app_groups.length === 1) {

                        if (sessionInfo.app_groups[0].apps.length === 1) {

                            return true;
                        }

                    }
                    return false;
                }

                var hasAnyDefaultApp = function (sessionInfo) {

                    var _hasDefaultApp = false;


                    if (hasAppGroups(sessionInfo)) {

                        _hasDefaultApp = hasDefaultApp(sessionInfo.app_groups[0].apps);
                    }

                    if (!_hasDefaultApp && sessionInfo.mnm_ng_apps && sessionInfo.mnm_ng_apps[0].apps.length > 0) {

                        _hasDefaultApp = hasDefaultApp(sessionInfo.mnm_ng_apps[0].apps);

                    }

                    return _hasDefaultApp;
                };



                var hasDefaultApp = function (appsArr) {

                    var _hasDefaultApp = false,
                        i = 0;


                    while(!_hasDefaultApp && i < appsArr.length) {

                        if (appsArr[i].is_default) {
                            _hasDefaultApp = true;
                        }

                        i++
                    }

                    return _hasDefaultApp;
                };




				$.get(
					'views/_navbar.mustache', function (template) {
						var _html = Mustache.render(template, {user: sessionInfo});
						_this.$_navbar.html(_html);
					}
				);

                var _template = 'views/_app-list.mustache';
                if (sessionInfo.app_groups.length === 0) {
                    var _template = 'views/_app-list-no-groups.mustache';
                }


                $.get(
					_template, function(template) {
						var _html = Mustache.render(template, {Applications: sessionInfo});
						_this.$_appList.html(_html);

                        // Are we an admin.
                        if (sessionInfo.is_sys_admin) {

                            // Yes!  Admin app will load and we should never lock out app list button
                            $('#apps-list-btn').addClass('app-list-hidden');

                        }

                        // Do we have any apps
                        else if (!sessionInfo.mnm_ng_apps && !hasAppGroups(sessionInfo)) {

                            // No.
                            // Apps list is hidden
                            $('#apps-list-btn').addClass('app-list-hidden');

                            // No toggle bc we have only one app
                            _this.toggleAppsListLink(false);

                        }

                        // Not an admin
                        // Do we have only one app that is not grouped
                        else if (sessionInfo.mnm_ng_apps && (sessionInfo.mnm_ng_apps[0].apps.length === 1 && !hasAppGroups(sessionInfo))) {

                            // Apps list is hidden
                            $('#apps-list-btn').addClass('app-list-hidden');

                            // No toggle bc we have only one app
                            _this.toggleAppsListLink(false);
                        }

                        // Not admin
                        // Do we have only one app that is grouped
                        else if (!sessionInfo.mnm_ng_apps && hasOneAppInGroup(sessionInfo)) {

                            // Apps list is hidden
                            $('#apps-list-btn').addClass('app-list-hidden');

                            // No toggle bc we have only one app
                            _this.toggleAppsListLink(false);
                        }

                        // We have multiple apps
                        else {

                            if (hasAnyDefaultApp(sessionInfo)) {
                                $('#apps-list-btn').addClass('app-list-hidden');
                                $('#app-list-container').css({
                                    display: 'none'
                                })
                            } else {

                                // Apps list is being shown
                                $('#apps-list-btn').removeClass('app-list-hidden');
                            }
                        }
					}
				);


				if (sessionInfo.is_sys_admin && (action !== 'update')) {

					// _this.toggleAdminLink(false);
					//_this.toggleFullScreenLink(true);
					//_this.toggleAppsListLink(true);
				}




				if ('init' == action) {
					_this.getApps(sessionInfo, action);
                    _this.autoRunApp();
				}
			}
		).fail(
			function (response) {
				if (401 == response.status || 403 == response.status) {
					_this.doSignInDialog();
				} else if (500 == response.status) {
					_this.showStatus(response.statusText, "error");
				}
			}
		);

	},

	//*************************************************************************
	//* User Management
	//*************************************************************************

	doSignInDialog: function () {
		this._redirect('/web/login?redirected=1');
	},

	doProfileDialog: function () {
		this._redirect('/web/profile');
	},

	doChangePasswordDialog: function () {
		this._redirect('/web/password');
	},

	doSignOutDialog: function (off) {
		$('#logoffDialog').modal(off ? 'hide' : 'show')
	},

	signOut: function () {
		this._redirect('/web/logout');
	},

	showStatus: function (message, type) {
		this.$_error.html(message).removeClass('alert-danger alert-warning alert-success').addClass(
			'error' == type ? 'alert-danger' : 'alert-success'
		).show().fadeOut('error' == type ? 10000 : 5000);
	},

	toggleFullScreen: function (toggle) {

		this.toggleNavbar(toggle);
	},

	requireFullScreen: function () {
		this._showHideNavbar(false);
	},

	/**
	 * Toggles a link/button on/off
	 * @param selector
	 * @param [disabled]
	 * @param [click]
	 */
	toggleLink: function (selector, disabled, click) {

		var $_link = $(selector);

		if (disabled) {
			$_link.addClass('disabled');

			if (click) {
				$_link.off('click', click);
			}
		} else {
			$_link.removeClass('disabled');

			if (click) {
				$_link.on('click', click);
			}
		}
	},

	toggleLinksForApp: function (apiName) {
		var _isAdmin = (
		'admin' == apiName
		);

		// this.toggleAdminLink(!_isAdmin);
		this.toggleAppsListLink(_isAdmin);
		this.toggleFullScreenLink(true);
	},

	/**
	 * Toggles the navbar
	 * @param {bool} [how]
	 * @returns {*}
	 */
	toggleNavbar: function (how) {

		var _this = this, _visible = this.$_navbar.is(':visible');

		if (false === how || $('#navbar-container').is(':visible')) {

			return this._showHideNavbar(false);
		}

		else if (true === how || $('#navbar-container').is(':hidden')) {

			return this._showHideNavbar(true);
		}
	},

	flushPlatformCache: function () {
		$.get(CurrentServer + '/web/flush?cache=platform').done(
			function () {
				// console.log('Platform cache flushed.');
				alert('Flushed!');
			}
		);
	},

	flushSwaggerCache: function () {
		$.get(CurrentServer + '/web/flush?cache=swagger').done(
			function () {
				// console.log('Swagger cache flushed. Rebuild on next request.');
				alert('Flushed!');
			}
		);
	},

	/**
	 * Redirects the page to url
	 * @param {string} url
	 * @private
	 */
	_redirect: function (url) {
		window.top.location = url;
	},

	/**
	 * Show/hide launchpad overlay (different from inner-admin overlay)
	 * @param {bool} hide
	 *
	 * @private
	 */
	_showHideOverlay: function (hide) {
		if (this.enableOverlay) {
			var $_overlay = $('.loading-screen');

			if (!hide) {
				if (!$_overlay.hasClass('active')) {
					$_overlay.addClass('active');
				}
			} else {
				if ($_overlay.hasClass('active')) {
					$_overlay.removeClass('active');
				}
			}
		}
	},

	/**
	 * Show/hide the navbar
	 * @param {bool} hide
	 *
	 * @private
	 */
	_showHideNavbar: function (hide) {
		var _this = this;

		if (false === hide) {
			this.$_navbar.hide();
			this.$_app.css({top: 0});
			$('#fs-exit').show();
		} else {
			this.$_navbar.show();
			this.$_app.css({top: '50px'});
			$('#fs-exit').hide();
		}

		//return this;
	},


	toggleAppList: function (hide) {

        return this._showHideAppList(hide || $('#apps-list-btn').hasClass('app-list-hidden'));
	},

	_showHideAppList: function (hide) {

		if (true === hide) {
			this.$_appList.slideDown('fast').css({zIndex: 998});
			$('#apps-list-btn').removeClass('app-list-hidden');
		} else {
			this.$_appList.slideUp('fast').css({zIndex: 1});
			$('#apps-list-btn').addClass('app-list-hidden');
		}

		return this;
	}

};

/**
 * DocReady
 */
jQuery(
	function ($) {
		$(document).on(
			'touchstart.dropdown', '.dropdown-menu', function (e) {
				e.stopPropagation();
			}
			//	Global loading page
		);

		if (Actions.enableOverlay) {
			$(document).ajaxSend(
				function () {
					Actions._showHideOverlay();
				}
			).ajaxStop(
				function () {
					Actions._showHideOverlay(true);
				}
			);
		}

		Actions.init();


        // Hide/Show Error Container on modal event;
        var hasError = false;

        $(document).on('show.bs.modal', function () {
            if ($('#error-container').is(':visible')) {
                hasError = true;
                $('#error-container').hide();
            }
        });

        $(document).on('hide.bs.modal', function() {
            if (hasError) {
                $('#error-container').fadeIn();
            }
        });
	}
);
