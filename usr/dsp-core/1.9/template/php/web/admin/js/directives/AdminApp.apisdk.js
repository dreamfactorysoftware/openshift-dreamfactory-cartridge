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

angular.module( 'AdminApp.apisdk', [] ).directive(
	'apisdk', [
		'$window', function( $window ) {
			return {
				restrict:    'E',
				replace:     true,
				controller:  function( $scope, $element ) {

					$scope.activeTab = 'swagger';

					$scope.init = function() {
						$scope.activateTab( 'swagger' );
						$scope.getCurrentServer();
					};

					$scope.activateTab = function( tabIdStr ) {

						$scope.activeTab = tabIdStr;
						$scope.$broadcast( 'tab:activate:tab', tabIdStr );
					};

					$scope.getActiveTab = function() {
						return $scope.activeTab;
					};

					$scope.getCurrentServer = function() {

						return $window.location.protocol + '\/\/' + $window.location.host;
					};

					$scope.$on(
						'tab:active', function( e ) {

							$scope.$broadcast( 'tab:active:tab', $scope.getActiveTab() );
						}
					);

					$scope.$on(
						'swagger:getServer', function( e ) {

							$scope.$broadcast( 'swagger:getServer:address', $scope.getCurrentServer() );
						}
					);

					$scope.$on(
						'sdk:getServer', function( e ) {

							$scope.$broadcast( 'sdk:getServer:address', $scope.getCurrentServer() );
						}
					);
                    $scope.reload = function(){
                      console.log(this);
                    };

					$scope.init();

				},
				templateUrl: 'views/directives/apisdk/main.html',
				link:        function( scope, elem, attrs ) {

				}
			}
		}
	]
).directive(
	'swagger', [
		'$window', function( $window ) {

			return {
				restrict:    'E',
				require:     '^?apisdk',
				replace:     true,
				scope:       {},
				templateUrl: 'views/directives/apisdk/swagger.html',
				link:        function( scope, elem, attrs ) {

					scope.active = false;
					scope.id = 'swagger';
					scope.iframeUrl = null;

					scope.init = function() {

						if ( attrs.standAlone === 'true' ) {

							scope.iframeUrl = scope.getCurrentServer() + '/swagger/'
						}
						else {

							scope.$emit( 'tab:active' );
							scope.$emit( 'swagger:getServer' );
						}
					};

					scope.getCurrentServer = function() {

						return $window.location.protocol + '\/\/' + $window.location.host;
					};

					scope.$on(
						'swagger:on', function( e, serviceNameStr ) {
							if ( serviceNameStr ) {
                                console.log(this);
								scope.iframeUrl = scope.getCurrentServer() + '/swagger/#!/' + serviceNameStr;
							}
                            var iframe = $('#swaggerFrame')[0].contentWindow;
                            if(iframe && iframe.Docs){
                                iframe.Docs.toggleEndpointListForResource(serviceNameStr);
                            }

							scope.active = true;
						}
					);

					scope.$on(
						'swagger:off', function( e ) {

							scope.active = false;
							scope.iframeUrl = null;
						}
					);

					scope.$on(
						'tab:activate:tab', function( e, tabIdStr ) {

							scope.active = scope.id === tabIdStr;

							if ( scope.active && !scope.iframeUrl ) {
								scope.$emit( 'swagger:getServer' );
							}
						}
					);

					scope.$on(
						'tab:active:tab', function( e, tabIdStr ) {

							scope.active = scope.id === tabIdStr;
						}
					);

					scope.$on(
						'swagger:getServer:address', function( e, addressStr ) {

							scope.iframeUrl = addressStr + '/swagger/';
						}
					);


//                var swaggerDiv = $('#swagger');
//                var docsIframe = $('#docsFrame');
//                var apiContainer = $('#swagctrl');
//                var docsDiv = $('#docs');
//                var mainDiv = $('.main');
//
//
//                    swaggerIframe.css('height', mainDiv.height() - 230).css('width', '100%')
//                    swaggerDiv.css({
//                        'height': mainDiv.height() - 220,
//                        'width': '95%'
//                    })

					scope.init();
				}
			}
		}
	]
).directive(
	'sdk', [
		function() {

			return {
				restrict:    'E',
				require:     '^apisdk',
				replace:     true,
				scope:       {},
				templateUrl: 'views/directives/apisdk/sdk.html',
				link:        function( scope, elem, attrs ) {

					scope.active = false;
					scope.id = 'sdk';
					scope.iframeUrl = null;

					scope.init = function() {

						scope.$emit( 'tab:active' );
						scope.$emit( 'sdk:getServer' );
					};

					scope.$on(
						'tab:activate:tab', function( e, tabIdStr ) {

							scope.active = scope.id === tabIdStr;

							if ( scope.active && !scope.iframeUrl ) {
								scope.$emit( 'sdk:getServer' );
							}
						}
					);

					scope.$on(
						'tab:active:tab', function( e, tabIdStr ) {

							scope.active = scope.id === tabIdStr

						}
					);

					scope.$on(
						'sdk:getServer:address', function( e, addressStr ) {

							scope.iframeUrl = addressStr + '/docs/';

							angular.element( '#docsFrame' ).attr( 'src', scope.iframeUrl );
						}
					);

					scope.init();
				}
			}
		}
	]
);