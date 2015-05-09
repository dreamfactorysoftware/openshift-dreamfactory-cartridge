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
angular.module('dfNavBar', ['ngRoute', 'dfUtility'])
	.constant('MODSIDEBARNAV_ROUTER_PATH', '/sidebar')
	.constant('MODSIDEBARNAV_ASSET_PATH', 'admin_components/dreamfactory_components/adf-navbar/')
	.config(
	[
		'$routeProvider', 'MODSIDEBARNAV_ROUTER_PATH', 'MODSIDEBARNAV_ASSET_PATH',
		function($routeProvider, MODSIDEBARNAV_ROUTER_PATH, MODSIDEBARNAV_ASSET_PATH) {
			$routeProvider
				.when(
				MODSIDEBARNAV_ROUTER_PATH, {
					templateUrl: MODSIDEBARNAV_ASSET_PATH + 'views/main.html',
					controller: 'SideBarNavCtrl',
					resolve:    {}
				}
			);
		}]
)
	.controller(
	'NavBarCtrl', [
		'$scope', '$location', 'SystemConfigDataService', function($scope, $location, SystemConfigDataService) {

			$scope.isHostedSystem = SystemConfigDataService.getSystemConfig().is_hosted;

			$scope.links = [
				{
					name:     'quickstart',
					label:    'Quickstart',
					active:   true,
					url:      '/',
					icon:     'fa fa-info-circle',
					disabled: false
				},
				{
					name:     'apps',
					label:    'Apps',
					active:   true,
					url:      '/app',
					icon:     'fa fa-cloud',
					disabled: false
				},
				{
					name:     'app-groups',
					label:    'App Groups',
					active:   true,
					url:      '/group',
					icon:     'fa fa-list',
					disabled: false
				},
				{
					name:     'user',
					label:    'Users',
					active:   true,
					url:      '/user',
					icon:     'fa fa-user',
					disabled: false
				},
				{
					name:     'roles',
					label:    'Roles',
					active:   true,
					url:      '/role',
					icon:     'fa fa-group',
					disabled: false
				},
				{
					name:     'services',
					label:    'Services',
					active:   true,
					url:      '/service',
					icon:     'fa fa-exchange',
					disabled: false
				},
				{
					name:     'data',
					label:    'Data',
					active:   true,
					url:      '/data',
					icon:     'fa fa-database',
					disabled: false
				},
				{
					name:     'schema',
					label:    'Schema',
					active:   true,
					url:      '/schema',
					icon:     'fa fa-table',
					disabled: false
				},
				{
					name:     'files',
					label:    'Files',
					active:   true,
					url:      '/file',
					icon:     'fa fa-folder',
					disabled: false
				},
				{
					name:     'api-sdk',
					label:    'API Docs',
					active:   true,
					url:      '/api#swagger',
					icon:     'fa fa-institution',
					disabled: false
				},
				{
					name:     'packages',
					label:    'Packages',
					active:   true,
					url:      '/package',
					icon:     'fa fa-gift',
					disabled: false
				},
				{
					name:     'config',
					label:    'Config',
					active:   true,
					url:      '/config',
					icon:     'fa fa-cog',
					disabled: false
				},
				{
					name:     'scripts',
					label:    'Scripts',
					active:   true,
					url:      '/scripts',
					icon:     'fa fa-file-text',
					disabled: $scope.isHostedSystem
				}
			];

			$scope.currentPage = null;

			$scope.navigateTo = function(linkObj) {

				if ($location.$$path === '/import') {
					$scope._navigateTo(linkObj);
				} else if (linkObj.url === $scope.currentPage.url) {
					return false;
				}

				$scope._navigateTo(linkObj);
			};

			$scope._setCurrentPage = function(linkObj) {

				$scope.currentPage = linkObj;
			};

			$scope._navigateTo = function(linkObj) {

				$location.url(linkObj.url);
				$scope._setCurrentPage(linkObj);
			};

			$scope.$watch(
				'currentPage', function(newValue, oldValue) {

					if (newValue == null) {

						var link = $scope.links[0],
							i = 0;

						while ((link.url !== $location.$$path) && (i < $scope.links.length - 1)) {

							link = $scope.links[i];

							i++
						}

						$scope._setCurrentPage(link);

						return false;
					}

				}
			)

		}]
)
	.directive(
	'sidebarNavOne', [
		'MODSIDEBARNAV_ASSET_PATH', function(MODSIDEBARNAV_ASSET_PATH) {

			return {
				restrict: 'E',
				scope:    false,
				templateUrl: MODSIDEBARNAV_ASSET_PATH + 'views/sidebar-nav-one.html',
				link:     function(scope, elem, attrs) {
				}
			}
		}]
)
	.directive(
	'topbarNavOne', [
		'MODSIDEBARNAV_ASSET_PATH', function(MODSIDEBARNAV_ASSET_PATH) {

			return {
				restrict: 'E',
				scope:    false,
				templateUrl: MODSIDEBARNAV_ASSET_PATH + 'views/topbar-nav-one.html',
				link:     function(scope, elem, attrs) {
				}
			}
		}]
);