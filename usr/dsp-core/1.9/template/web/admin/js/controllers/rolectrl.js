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
var RoleCtrl = function(dfLoadingScreen, $window, $scope, RolesRelated, User, App, Service, $http ,getServicesAndComponents ) {
Scope = $scope;
	$scope.$on(
		'$routeChangeSuccess', function() {
			$( window ).resize();
		}
	);
    var componentServices = [2,4, 8,16,32, 4098, 4100];
    $scope.action = "Create New ";
    $scope.actioned = "Created";
    $( '.update_button' ).hide();
    $scope.AllUsers = User.get();
    $scope.Apps = App.get();
    // service access
    $scope.ServiceComponents = {};
	$scope.role = {
		users:                 [],
		apps:                  [],
		role_service_accesses: [],
		role_system_accesses:  [],
		lookup_keys:           []
	};
    $scope.masterServiceList = getServicesAndComponents.data.record;
    $scope.masterServiceList.forEach(
        function( service, index ) {
            $scope.ServiceComponents[index] = [];
            $scope.ServiceComponents[index] = $scope.ServiceComponents[index].concat( service.components );
        }
    );

	$scope.Services = Service.get(function(data){
        var services = data.record;

        services.unshift(
            {
                id:   0,
                name: "All",
                type: ""
            }
        );
    //$scope.ServiceComponents.push(allRecord);
    });



    // Used to let us know when the roles are loaded
    $scope.rolesLoaded = false;

	$scope.cleanServiceAccess = function() {
		var size = $scope.role.role_service_accesses.length;
		for ( i = 0; i < size; i++ ) {
			delete $scope.role.role_service_accesses[i].show_filters;
		}
	};
	// system access
	$scope.SystemComponents = [];
	var allRecord = {
		name:   '*',
		label:  'All',
		plural: 'All'
	};
	$scope.SystemComponents.push( allRecord );
	$http.get( '/rest/system?app_name=admin&fields=*' ).success(
		function( data ) {
			$scope.SystemComponents = $scope.SystemComponents.concat( data.resource );
		}
	).error(
		function() {
		}
	);
	$scope.cleanSystemAccess = function() {
		var size = $scope.role.role_system_accesses.length;
		for ( i = 0; i < size; i++ ) {
			delete $scope.role.role_system_accesses[i].show_filters;
		}
	};

	$scope.FilterOps = ["=", "!=", ">", "<", ">=", "<=", "in", "not in", "starts with", "ends with", "contains", "is null", "is not null"];

    //
	$scope.Roles = RolesRelated.get(
        {}, //params
        function( data ) { //success
            // Let us know we're loaded for HACKY div to keep UI from bouncing
            $scope.rolesLoaded = true;

            // Stop loading screen
            dfLoadingScreen.stop();


            angular.forEach(data.record, function( role ) {
                    angular.forEach(
                        role.role_service_accesses, function( access ) {
                            // ng-options doesn't play nice with null so we change it to 0
                            // server will accept 0 for "all services" but returns null
                            if ( !access.service_id ) {
                                access.service_id = 0;
                            }
                        }
                    );
                }
            );
        }
    );



	$scope.save = function() {

		if ( $scope.emptyKey() ) {
            $(function(){
                new PNotify({
                    title: 'Roles',
                    type:  'error',
                    text:  'Empty key names are not allowed.'
                });
            });

			return;
		}
		if ( !$scope.uniqueKey() ) {
            $(function(){
                new PNotify({
                    title: 'Roles',
                    type:  'error',
                    text:  'Duplicate key names are not allowed.'
                });
            });

			return;
		}
		$scope.cleanServiceAccess();
		$scope.cleanSystemAccess();

		var id = this.role.id;
		RolesRelated.update(
			{
				id: id
			}, $scope.role, function( response ) {
				$scope.role.lookup_keys = angular.copy( response.lookup_keys );
				updateByAttr( $scope.Roles.record, 'id', id, $scope.role );
				$scope.promptForNew();
				//window.top.Actions.showStatus("Updated Successfully");


                // added for small devices
                $scope.close();

				// Success Message
                $(function(){
                    new PNotify({
                        title: 'Roles',
                        type:  'success',
                        text:  'Role Updated Successfully'
                    });
                });

			}
		);
	};
	$scope.create = function() {

		if ( $scope.emptyKey() ) {
            $(function(){
                new PNotify({
                    title: 'Roles',
                    type:  'error',
                    text:  'Empty key names are not allowed.'
                });
            });

			return;
		}
		if ( !$scope.uniqueKey() ) {
            $(function(){
                new PNotify({
                    title: 'Roles',
                    type:  'error',
                    text:  'Duplicate key names are not allowed.'
                });
            });

			return;
		}
		$scope.cleanServiceAccess();
		$scope.cleanSystemAccess();
		RolesRelated.save(
			$scope.role, function( data ) {
				$scope.Roles.record.push( data );
				//window.top.Actions.showStatus("Created Successfully");
				$scope.promptForNew();

                // added for small devices
                $scope.close();

				// Success Message
                $(function(){
                    new PNotify({
                        title: 'Roles',
                        type:  'success',
                        text:  'Role Created Successfully'
                    });
                });


			}
		);
	};

	$scope.isUserInRole = function() {
		var currentUser = this.user;
		var inRole = false;
		if ( $scope.role.users ) {
			angular.forEach(
				$scope.role.users, function( user ) {
					if ( angular.equals( user.id, currentUser.id ) ) {
						inRole = true;
					}
				}
			);
		}
		return inRole;
	};

	$scope.isAppInRole = function() {

		var currentApp = this.app;
		var inRole = false;
		if ( $scope.role.apps ) {
			angular.forEach(
				$scope.role.apps, function( app ) {
					if ( angular.equals( app.id, currentApp.id ) ) {
						inRole = true;
					}
				}
			);
		}
		return inRole;
	};
	$scope.addAppToRole = function() {
		if ( checkForDuplicate( $scope.role.apps, 'id', this.app.id ) ) {
			$scope.role.apps = removeByAttr( $scope.role.apps, 'id', this.app.id );
		}
		else {
			$scope.role.apps.push( this.app );
		}
	};
	$scope.updateUserToRole = function() {
		if ( checkForDuplicate( $scope.role.users, 'id', this.user.id ) ) {
			$scope.role.users = removeByAttr( $scope.role.users, 'id', this.user.id );
		}
		else {
			$scope.role.users.push( this.user );
		}
	};

	// service access

	$scope.removeServiceAccess = function() {

		var rows = $scope.role.role_service_accesses;
		rows.splice( this.$index, 1 );
	};

	$scope.newServiceAccess = function() {

		var newAccess = {
			"verb_mask": 0,
			"component": "*",
			"service_id": 0,
            "filters": [],
            "filter_op": "AND",
            "show_filters": false,
            "requestor_mask": 1
		};

		$scope.role.role_service_accesses.push( newAccess );
	};

	$scope.newServiceAccessFilter = function() {

		var newFilter = {
			"name":     "",
			"operator": "=",
			"value":    ""
		};
		this.service_access.filters.push( newFilter );
	};

	$scope.removeServiceAccessFilter = function() {

		var rows = this.service_access.filters;
		rows.splice( this.$index, 1 );
	};

	$scope.selectService = function() {

		this.service_access.component = "*";
		if ( !$scope.allowFilters( this.service_access.service_id ) ) {
			this.service_access.filter_op = "AND";
			this.service_access.filters = [];
		}
	};

	$scope.serviceId2Index = function( id ) {

		var size = $scope.Services.record.length;
		for ( i = 0; i < size; i++ ) {
			if ( $scope.Services.record[i].id === id ) {
				return i;
			}
		}
		return -1;
	};

	$scope.allowFilters = function( id ) {

		var size = $scope.Services.record.length;
		for ( i = 0; i < size; i++ ) {
			if ( $scope.Services.record[i].id === id ) {
				switch ( $scope.Services.record[i].type ) {
					case "Local SQL DB":
					case "Remote SQL DB":
					case "NoSQL DB":
					case "Salesforce":
						return true;
					default:
						return false;
				}
			}
		}
		return false;
	};

	$scope.updateServiceAccessFilter = function() {

		angular.forEach(
			this.service_access.filters, function( filter ) {
				if ( filter.operator === "is null" || filter.operator === "is not null" ) {
					filter.value = "";
				}
			}
		);
	};

	$scope.toggleServiceAccessFilter = function() {

		this.service_access.show_filters = !this.service_access.show_filters;
	};

	$scope.toggleServiceAccessOp = function() {

		if ( this.service_access.filter_op === "AND" ) {
			this.service_access.filter_op = "OR";
		}
		else {
			this.service_access.filter_op = "AND";
		}
	};

	// system access

	$scope.removeSystemAccess = function() {

		var rows = $scope.role.role_system_accesses;
		rows.splice( this.$index, 1 );
	};

	$scope.newSystemAccess = function() {

		var newAccess = {
            "verbs": ["GET"],
            "component": "user",
            "filters": [],
            "filter_op": "AND",
            "show_filters": false,
            "requestor_mask": 1
        };

		$scope.role.role_system_accesses.push( newAccess );
	};

	$scope.newSystemAccessFilter = function() {

		var newFilter = {
			"name":     "",
			"operator": "=",
			"value":    ""
		};
		this.system_access.filters.push( newFilter );
	};

	$scope.removeSystemAccessFilter = function() {

		var rows = this.system_access.filters;
		rows.splice( this.$index, 1 );
	};

	$scope.updateSystemAccessFilter = function() {

		angular.forEach(
			this.system_access.filters, function( filter ) {
				if ( filter.operator === "is null" || filter.operator === "is not null" ) {
					filter.value = "";
				}
			}
		);
	};

	$scope.toggleSystemAccessFilter = function() {

		this.system_access.show_filters = !this.system_access.show_filters;
	};

	$scope.toggleSystemAccessOp = function() {

		if ( this.system_access.filter_op === "AND" ) {
			this.system_access.filter_op = "OR";
		}
		else {
			this.system_access.filter_op = "AND";
		}
	};

	// keys

	$scope.removeKey = function() {

		var rows = $scope.role.lookup_keys;
		rows.splice( this.$index, 1 );
	};

	$scope.newKey = function() {

		var newKey = {
			"name":    "",
			"value":   "",
			"private": false
		};
		$scope.role.lookup_keys.push( newKey );
	};

	$scope.uniqueKey = function() {
		var size = $scope.role.lookup_keys.length;
		for ( i = 0; i < size; i++ ) {
			var key = $scope.role.lookup_keys[i];
			var matches = $scope.role.lookup_keys.filter(
				function( itm ) {
					return itm.name === key.name;
				}
			);
			if ( matches.length > 1 ) {
				return false;
			}
		}
		return true;
	};

	$scope.emptyKey = function() {

		var matches = $scope.role.lookup_keys.filter(
			function( itm ) {
				return itm.name === '';
			}
		);
		return matches.length > 0;
	};

	//ADDED PNOTIFY
	//noinspection ReservedWordAsName
	$scope.delete = function() {
		var which = this.role.name;
		if ( !which || which == '' ) {
			which = "the role?";
		}
		else {
			which = "the role '" + which + "'?";
		}
		if ( !confirm( "Are you sure you want to delete " + which ) ) {
			return;
		}
		var id = this.role.id;
		RolesRelated.delete(
			{
				id: id
			}, function() {
				$scope.promptForNew();

				$( "#row_" + id ).fadeOut();

                // Added for small devices
                $scope.close();

				// Success message
                $(function(){
                    new PNotify({
                        title: 'Roles',
                        type:  'success',
                        text:  'Role deleted.'
                    });
                });
			}
		);

	};
	$scope.promptForNew = function() {
		angular.element( ":checkbox" ).attr( 'checked', false );
        $scope.currentRoleId = '';
		$scope.action = "Create New";
		$scope.actioned = "Created";
		$scope.role = {
			users:                 [],
			apps:                  [],
			role_service_accesses: [],
			role_system_accesses:  [],
			lookup_keys:           []
		};
		$( '.save_button' ).show();
		$( '.update_button' ).hide();
		$( "tr.info" ).removeClass( 'info' );
		$( window ).scrollTop( 0 );

        // Added for small devices
        $scope.open();
	};
	$scope.showDetails = function() {
		$scope.action = "Edit ";
		$scope.actioned = "Updated";
		$scope.role = angular.copy( this.role );
        $scope.currentRoleId = $scope.role.id;
		$scope.users = angular.copy( $scope.role.users );
		$scope.apps = angular.copy( $scope.role.apps );
		$( '.save_button' ).hide();
		$( '.update_button' ).show();
		$( "tr.info" ).removeClass( 'info' );
		$( '#row_' + $scope.role.id ).addClass( 'info' );

        // Added for small devices
        $scope.open();
	};
	$scope.makeDefault = function() {
		$scope.role.default_app_id = this.app.id;
	};
	$scope.clearDefault = function() {
		$scope.role.default_app_id = null;
	};




    // Added controls for dealing with xs small devices
    $scope.xsWidth = $(window).width() <= 992 ? true : false;
    $scope.activeView = 'list';

    $scope.setActiveView = function (viewStr) {

        $scope.activeView = viewStr;
    };

    $scope.close = function () {

        $scope.setActiveView('list');
    };

    $scope.open = function () {

        $scope.setActiveView('form');
    };

    $scope.$watch('xsWidth', function (newValue, oldValue) {

        if (newValue == false) {
            $scope.close();
        }
    });

    $(window).resize(function(){
        if(!$scope.$$phase) {
            $scope.$apply(function () {
                if ($(window).width() <= 992) {
                    $scope.xsWidth = true;
                }else {
                    $scope.xsWidth = false;
                }
            })
        }
    });
};