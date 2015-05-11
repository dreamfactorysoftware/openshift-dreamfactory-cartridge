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
var QuickStartCtrl = function( $scope, App, Config, Service, $location ) {
Scope = $scope;

	(
		function() {
			setCurrentApp( 'getting_started' );
			$scope.Config = Config.get(
				function( data ) {
					$scope.CORSConfig = {"id": data.id, "verbs": ["GET", "POST", "PUT", "MERGE", "PATCH", "DELETE", "COPY"], "host": "*", "is_enabled": true};
				}
			);

			$scope.Services = Service.get(
				function() {

					$scope.Services.record.forEach(
						function( service ) {
							if ( service.type.indexOf( "Local File Storage" ) != -1 ) {
								$scope.defaultStorageID = service.id;
								$scope.defaultStorageName = service.api_name;
							}

						}
					);
				}
			);
			$scope.app = {native: 0};
			$scope.step = 1;

		}()
	);

	$scope.setStep = function( step ) {
		if ( step == 2 && $scope.app.native == 1 ) {
			//$scope.step = 4;
			$scope.create();
			return;
		}
		else if ( step == 3 ) {
			$scope.step = 4;
			return;
		}

		$scope.step = step;
	};
	$scope.launchApp = function() {
		window.open(
			location.protocol + '//' + location.host + '/' + $scope.defaultStorageName + '/applications/' + $scope.app.api_name + '/index.html', "df-new"
		);
	};
	$scope.downloadSDK = function() {
		$( "#sdk-download" ).attr( 'src', location.protocol + '//' + location.host + '/rest/system/app/' + $scope.app.id + '?sdk=true&app_name=admin' )
	};
	$scope.goToApps = function() {
		$location.path( '/app' );
	};
	$scope.goToDocs = function() {
		$location.path( '/api' );
	};
	$scope.saveConfig = function() {
		if ( $scope.app.storage_service_id != 0 ) {
			return;
		}

		Config.update(
			$scope.CORSConfig, function() {

			}, function( response ) {
                $(function(){
                    new PNotify({
                        title:    'Error',
                        type:     'error',
                        hide:     false,
                        text:     getErrorString( response )
                    });
                });


			}
		);
	};
	$scope.create = function() {

		if ( $scope.app.native == '1' ) {
			$scope.app.storage_service_id = null;
			$scope.app.storage_container = null;
			$scope.app.launch_url = "";

		}
		else if ( $scope.app.storage_service_id == 0 ) {
			$scope.app.storage_service_id = null;
			$scope.app.storage_container = null;

		}
		else {
			$scope.app.storage_service_id = $scope.defaultStorageID;
			$scope.app.storage_container = "applications"
		}
		$scope.app.name = $scope.app.api_name;
		App.save(
			$scope.app, function( data ) {
				//$scope.Apps.record.push(data);
				$scope.app.id = data.id;
				//$scope.app = data;
				if ( window.top.Actions ) {
					window.top.Actions.updateSession( "update" );
				}
                $(function(){
                    new PNotify({
                        title: $scope.app.api_name,
                        type:  'success',
                        text:  'Created Successfully'
                    });
                });

				//Service.newApp = data;
                $scope.step = 4;
			}
		);

	};
};