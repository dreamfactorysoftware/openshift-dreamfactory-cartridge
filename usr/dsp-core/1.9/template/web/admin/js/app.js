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
'use strict';
var loginFrame = $("#login-frame");
var loginPage = $("#login-page");
var container = $("#container");

/**
 * Angular module declaration
 */
angular.module(
	"AdminApp", [
		"ngRoute", "ngResource", "ui.bootstrap.accordion", "AdminApp.controllers", "AdminApp.apisdk", "dfTable", "dfUtility", "dfSystemConfig", "dfUsers", "dfNavBar", "dfScripting", "dfImportApp"
	])
	.constant("DSP_URL", CurrentServer)
    .constant("API_KEY", "admin")
    .config(
        function($httpProvider, API_KEY) {
            $httpProvider.defaults.headers.common["X-DREAMFACTORY-APPLICATION-NAME"] = API_KEY;
        })
    .config(
	[
		'$provide', function($provide) {
		$provide.decorator(
			'$exceptionHandler', [
				'$delegate', '$injector', function($delegate, $injector) {
					return function(exception) {

						// Was this error thrown explicitly by a module
						if (exception.provider && (
							exception.provider === 'dreamfactory'
							)) {
							$injector.invoke(
								[
									function() {


										// Custom function to pull the DreamFactory Error out of a
										// DreamFactory error object
										var parseDreamFactoryError = function(errorDataObj) {

											//console.log(errorDataObj);

											// create a place to store the error
											var error = null;

											// If the exception type is a string we don't need to go any further
											// This was thrown explicitly by the module due to a module error
											// unrelated to the server
											if (typeof errorDataObj.exception === 'string') {

												// store the error
												// and we're done
												error = errorDataObj.exception;

												// the exception is not a string
												// let's assume it came from the server
											} else {

												// is there more than one error contained in the object
												if (errorDataObj.exception.data.error.length > 1) {

													// yes. Let's loop through and concat these to display to the user
													angular.forEach(
														errorDataObj.exception.data.error, function(obj) {

															// add the message from each error obj to the error store
															error += obj.message + '\n';
														}
													);

													// We only have one error
												} else {

													// store that error message
													error = errorDataObj.exception.data.error[0].message;
												}
											}

											// return the built message to display to the user
											return errorDataObj.module + ': ' + error

										};

										_showMessage(exception.module, parseDreamFactoryError(exception), exception.type);
									}
								]
							);

							$injector.invoke(
								[
									'$rootScope', function($rootScope) {
									$rootScope.$broadcast('dfclient:error');
								}
								]
							)
						}

						else {
							// Continue on to normal error handling
							return $delegate(exception);
						}
					}
				}
			]
		);
	}
	]
)

	.config(
	[
		'$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

		$routeProvider.when(
			'/', {
				controller: QuickStartCtrl, templateUrl: 'quick-start.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							//dfLoadingScreen.start()
						}
					]
				}
			}
		);
		$routeProvider.when(
			'/app', {
				controller: AppCtrl, templateUrl: 'applications.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start()
						}
					]
				}
			}
		);
		$routeProvider.when(
			'/role', {
				controller: RoleCtrl, templateUrl: 'roles.html', resolve: {
					startLoadingScreen:          [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start();
						}
					], getServicesAndComponents: [
						'DSP_URL', '$http', function(DSP_URL, $http) {

							var requestDataObj = {
								include_components: true,
                                filter : "type!='Local Portal Service'"
							};

							return $http.get(DSP_URL + '/rest/system/service', {params: requestDataObj});
						}
					]
				}

			}
		);
		$routeProvider.when(
			'/group', {
				controller: GroupCtrl, templateUrl: 'groups.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start();
						}
					]
				}
			}
		);
		$routeProvider.when(
			'/schema', {
				controller: SchemaCtrl, templateUrl: 'schema.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start();
						}
					],

					getSchemaServices: [
						'DSP_URL', '$http', function(DSP_URL, $http) {

							var requestDataObj = {
								filter: 'type_id in (4, 4100)'
							};

							return $http.get(DSP_URL + '/rest/system/service', {params: requestDataObj});
						}
					]
				}
			}
		);
		$routeProvider.when(
			'/service', {
				controller: ServiceCtrl, templateUrl: 'services.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start();
						}
					]
				}
			}
		);
		$routeProvider.when(
			'/file', {
				controller: FileCtrl, templateUrl: 'files.html'
			}
		);
		$routeProvider.when(
			'/package', {
				controller: PackageCtrl, templateUrl: 'package.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start();
						}
					]
				}
			}
		);
		$routeProvider.when(
			'/data', {
				controller: DataCtrl, templateUrl: 'data.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start();
						}
					],

					getDataServices: [
						'DSP_URL', '$http', function(DSP_URL, $http) {

							var requestDataObj = {
								include_schema: true, filter: 'type_id in (4,4100)'
							};

							return $http.get(DSP_URL + '/rest/system/service', {params: requestDataObj});
						}
					]
				}
			}
		);
		$routeProvider.when(
			'/api', {
				controller: 'ApiSDKCtrl', templateUrl: 'apisdk.html', resolve: {
					startLoadingScreen: [
						'dfLoadingScreen', function(dfLoadingScreen) {

							// start the loading screen
							dfLoadingScreen.start();
						}
					]
				}
			}
		);

		var interceptor = [
			'$location', '$q', '$rootScope', function($location, $q, $rootScope) {
				function success(response) {

					return response;
				}

				function error(response) {

					if (response.status === 401 || response.status === 403) {
						if (response.config.method === "GET") {
							$rootScope.$broadcast(
								"error:401", function() {
									window.location.reload(true);
								}
							);
						} else {
							$rootScope.$broadcast("error:401", null);
						}

						return $q.reject(response);
					} else if (response.status === 404) {
						return $q.reject(response);
					} else {

						_showMessage('API Error',response.data.error[0].message, 'error');
						return $q.reject(response);
					}
				}

				return function(promise) {
					return promise.then(success, error);
				}
			}
		];


		$httpProvider.responseInterceptors.push(interceptor);
        $httpProvider.interceptors.push('httpVerbInterceptor');
	}
	]
)
    .factory('httpVerbInterceptor', ['SystemConfigDataService', function(SystemConfigDataService) {

        return {

            request: function(config) {

                if (!SystemConfigDataService.getSystemConfig().restricted_verbs) return config;

                var restricted_verbs = SystemConfigDataService.getSystemConfig().restricted_verbs,
                    i = 0,
                    restricted = false,
                    currMethod = config.method;

                while(!restricted && i < restricted_verbs.length) {

                    if (currMethod === restricted_verbs[i]) {
                        config.method = "POST";
                        config.headers['X-HTTP-METHOD'] = currMethod;
                        restricted = true;
                    }

                    i++
                }

                return config;
            }
        }

    }])
    .factory(
	'AppsRelated', function($resource) {
		return $resource(
			'/rest/system/app/:id/?app_name=admin&fields=*&related=roles', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'AppsRelatedToService', function($resource) {
		return $resource(
			'/rest/system/app/:id/?app_name=admin&fields=*&related=app_service_relations', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'App', function($resource) {
		return $resource(
			'/rest/system/app/:id/?app_name=admin&fields=*', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'User', function($resource) {
		return $resource(
			'/rest/system/user/:id/?app_name=admin&fields=*&related=lookup_keys&order=display_name%20ASC', {
				send_invite: false
			}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'Role', function($resource) {
		return $resource(
			'/rest/system/role/:id/?app_name=admin&fields=*', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		)
	}
).factory(
	'RolesRelated', function($resource) {
		return $resource(
			'/rest/system/role/:id/?app_name=admin&fields=*&related=users,apps,role_service_accesses,role_system_accesses,lookup_keys', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'Service', function($resource) {
		return $resource(
			"/rest/system/service/:id/?app_name=admin&fields=*&filter=type!='Local Portal Service'", {}, {
				update:   {
					method: 'PUT', params: {
						related: 'docs'
					}
				}, query: {
					method: 'GET', isArray: false
				}, get:   {
					method: 'GET', isArray: false, params: {
						related: 'docs'
					}
				}
			}
		);
	}
).factory(
	'Schema', function($resource) {
		return $resource(
			'/rest/schema/:name/?app_name=admin&fields=*', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'DB', function($resource) {
		return $resource(
			'/rest/db/:name/?app_name=admin&fields=*&include_schema=true', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'Group', function($resource) {
		return $resource(
			'/rest/system/app_group/:id/?app_name=admin&fields=*&related=apps', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'Config', function($resource) {
		return $resource(
			'/rest/system/config/?app_name=admin', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'Event', function($resource) {
		return $resource(
			'/rest/system/event/?app_name=admin', {}, {
				update:   {
					method: 'PUT'
				}, query: {
					method: 'GET', isArray: false
				}
			}
		);
	}
).factory(
	'Script', function($resource) {
		return $resource(
			'/rest/system/script/:script_id/?app_name=admin', {}, {
				update:   {
					method: 'PUT', headers: {'Content-Type': 'text/plain'}
				}, query: {
					method: 'GET', isArray: false, headers: {'Content-Type': 'text/plain'}
				}
			}
		);
	}
).factory(
	'EmailTemplates', function($resource) {
		return $resource(
			'/rest/system/email_template/:id/?app_name=admin&fields=*', {}, {
				update: {
					method: 'PUT'
				}
			}
		);
	}
).run(
	function($rootScope) {
		$rootScope.$on(
			"error:401", function(message, data) {
				$rootScope.showLogin();
				$rootScope.onReturn = function() {

					if (data) {
						data();
					}
				};

			}
		);
		$rootScope.showLogin = function() {
			container.hide();
			loginFrame.attr("src", "");
			loginFrame.attr("src", "../web/login");
			loginFrame.load(
				function() {
					$rootScope.checkLogin();
				}
			);
			loginPage.show();
		};
		$rootScope.hideLogin = function() {
			container.show();
			loginPage.hide();
			$rootScope.onReturn();

		};
		$rootScope.checkLogin = function() {
			var loginLocation = document.getElementById("login-frame").contentWindow.location;
			loginLocation = loginLocation.toString();
			if (loginLocation.indexOf("launchpad") != -1) {
				$rootScope.hideLogin();
			}
		};

	}
).run(
	[
		'SystemConfigDataService', function(SystemConfigDataService) {
		var SystemConfig = SystemConfigDataService.getSystemConfigFromServerSync();
		SystemConfigDataService.setSystemConfig(SystemConfig);
	}

	]
);

var setCurrentApp = function(currentApp) {
	//$('.active').removeClass('active');
	$("#nav_" + currentApp).addClass("active");
};

var showFileManager = function() {
	$("#root-file-manager").find("iframe").css('height', $(window).height() - 200).attr("src", CurrentServer + '/filemanager/').show();

};

/**
 * Shows a pnotify message
 * @param {string} title
 * @param {string} text
 * @param {string} [type] Defaults to "success"
 * @param {*} [options] An object of options to override on the PNotify message
 * @returns {PNotify}
 */
var _showMessage = function(title, text, type, options) {
	return new PNotify($.extend({title: title, type: type || 'success', text: text, hide: false}, options || {}));
};

/**
 * Document Ready
 */
jQuery(
	function($) {
		//	Turn on font-awesome for PNotify
		$.extend(
			PNotify.prototype.options,
			{
				styling:                'fontawesome',
				effect_in:              'show',
				effect_out:             'slide',
				cornerclass:            'ui-pnotify-sharp',
				delay:                  2000,
				mouse_reset:            false,
				animate_speed:          250,
				position_animate_speed: 250
			}
		);
	}
);

