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
var UserCtrl = function( $scope, Config, User, Role, Service ) {
   window.Scope = $scope;
	$scope.$on(
		'$routeChangeSuccess', function() {
			$( window ).resize();
		}
	);
	$scope.getResources = function( resources ) {
		resources.forEach(
			function( resource ) {
				$scope.getResource( resource.factory, resource.collection, resource.success );
			}
		)
	};
	$scope.getResource = function( factory, collection, success ) {

		factory.get().$promise.then(
			function( resource ) {
				$scope[collection] = resource;
				if ( success ) {
					success();
				}
			}
		).catch(
			function( error ) {

			}
		);

	};
	$scope.init = function() {
		$scope.defaultEmailService = null;
		$scope.getResources(
			[
				{
					factory:    User,
					collection: "Users"
				},
				{
					factory:    Role,
					collection: "Roles"
				},
				{
					factory:    Service,
					collection: "Services",
					success:    function() {
						$scope.buildServices()
					}
				},
				{
					factory:    Config,
					collection: "Config"
				}

			]
		);
		$scope.action = "Create";

		$scope.passwordEdit = false;
		$scope.user = {};
		$scope.user.password = '';
		$scope.passwordRepeat = '';
		$scope.supportedExportFormats = ['CSV', 'JSON', 'XML'];
		$scope.selectedExportFormat = 'CSV';
		// keys
		$scope.user.lookup_keys = [];
	};

	$scope.buildServices = function() {
		$scope.Services.record.forEach(
			function( service ) {
				if ( service.type.indexOf( "Email Service" ) != -1 ) {
					$scope.defaultEmailService = service.api_name;
				}
			}
		)
	};

	$scope.removeKey = function() {

		var rows = $scope.user.lookup_keys;
		rows.splice( this.$index, 1 );
	};


	$scope.newKey = function() {

		var newKey = {"name": "", "value": "", "private": false, "allow_user_update": false};
		$scope.user.lookup_keys.push( newKey );
	};
	$scope.uniqueKey = function() {
		var size = $scope.user.lookup_keys.length;
		for ( i = 0; i < size; i++ ) {
			var key = $scope.user.lookup_keys[i];
			var matches = $scope.user.lookup_keys.filter(
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

		var matches = $scope.user.lookup_keys.filter(
			function( itm ) {
				return itm.name === '';
			}
		);
		return matches.length > 0;
	};



	$scope.formChanged = function() {

		$( '#save_' + this.user.id ).removeClass( 'disabled' );
	};

	$scope.save = function() {

		if ( $scope.emptyKey() ) {
            $(function(){
                new PNotify({
                    title: 'Error',
                    text:     'Empty key names are not allowed',
                    type: 'error'
                });
            });
			return;
		}
		if ( !$scope.uniqueKey() ) {
            $(function(){
                new PNotify({
                    title: 'Error',
                    text:     'Duplicate key names are not allowed',
                    type: 'error'
                });
            });
			return;
		}
		if ( !this.user.display_name ) {
			this.user.display_name = this.user.first_name + ' ' + this.user.last_name;
		}
		if ( this.passwordEdit ) {
			if ( this.user.password == '' || this.user.password != this.passwordRepeat ) {
                $(function(){
                    new PNotify({
                        title: 'Error',
                        text:     'Passwords do not match',
                        type: 'error'
                    });
                });
				return;
			}
		}
		else {
			delete this.user.password;
		}
		var id = $scope.user.id;
		User.update(
			{id: id}, $scope.user, function( response ) {
				$scope.user.lookup_keys = angular.copy( response.lookup_keys );
				updateByAttr( $scope.Users.record, 'id', id, $scope.user );
				$scope.promptForNew();
                $(function(){
                    new PNotify({
                        title: 'Users',
                        text:     'Updated Successfully',
                        type: 'success'
                    });
                });
			}
		);
	};

	$scope.create = function() {

		if ( $scope.emptyKey() ) {
            $(function(){
                new PNotify({
                    title: 'Error',
                    text:     'Empty key names are not allowed',
                    type: 'error'
                });
            });
			return;
		}
		if ( !$scope.uniqueKey() ) {
            $(function(){
                new PNotify({
                    title: 'Error',
                    text:     'Duplicate key names are not allowed',
                    type: 'error'
                });
            });
			return;
		}
		var newRec = this.user;
		if ( this.passwordEdit ) {
			if ( newRec.password == '' || newRec.password != this.passwordRepeat ) {
                $(function(){
                    new PNotify({
                        title: 'Error',
                        text:     'Passwords do not match',
                        type: 'error'
                    });
                });
				return;
			}
		}
		else {
			delete newRec.password;
		}
		if ( !newRec.display_name ) {
			newRec.display_name = newRec.first_name + ' ' + newRec.last_name;
		}




        // Invites
		var send_invite = $scope.sendInvite ? "true" : "false";
		User.save(
			{send_invite: send_invite}, newRec, function( response ) {

				$scope.Users.record.push( response );
                $(function(){
                    new PNotify({
                        title: 'Users',
                        text:     'Created Successfully',
                        type: 'success'
                    });
                });
                if( $scope.create_another){
                    $scope.promptForNew();
                }else {
                    $scope.action = "Edit";
                    $scope.user = response;
                    $scope.currentUserId = $scope.user.id;
                    $scope.passwordEdit = false;


                }
			}
		);
	};


	$scope.invite = function() {

		$.ajax(
			{
				dataType: 'json',
				type:     'PATCH',
				url: CurrentServer + '/rest/system/user/' + this.user.id + '?app_name=admin&send_invite=true',
				data:     {},
				cache:    false,
				success:  function() {

                    $(function(){
                        new PNotify({
                            title: 'Users',
                            text: "Invite Sent",
                            type: 'success'
                        });
                    });
				}
			}
		);
	};

	$scope.promptForNew = function() {
        $scope.currentUserId = '';
		$scope.action = "Create";
		$scope.passwordEdit = false;
		$scope.user = {};
		$scope.user.password = '';
		$scope.passwordRepeat = '';
		$scope.user.lookup_keys = [];
		//$( "tr.info" ).removeClass( 'info' );
		$( window ).scrollTop( 0 );
		$scope.userform.$setPristine();
	};

	//noinspection ReservedWordAsName
	$scope.delete = function() {

		var which = this.user.display_name;
		if ( !which || which == '' ) {
			which = "the user?";
		}
		else {
			which = "the user '" + which + "'?";
		}
		if ( !confirm( "Are you sure you want to delete " + which ) ) {
			return;
		}
		var id = this.user.id;
		User.delete(
			{ id: id }, function() {
				$scope.promptForNew();
				$( "#row_" + id ).fadeOut();
                $(function(){
                    new PNotify({
                        title: 'Users',
                        text: "Deleted Successfully",
                        type: 'success'
                    });
                });
			}
		);
	};

	$scope.showDetails = function() {

		$scope.action = "Edit";
		$scope.passwordEdit = false;
		$scope.user = angular.copy( this.user );
		$scope.user.password = '';
		$scope.passwordRepeat = '';
       $scope.currentUserId = $scope.user.id;
		$scope.userform.$setPristine();
	};

	$scope.toggleRoleSelect = function( checked ) {

		if ( checked == true ) {
			$( '#role_select' ).prop( 'disabled', true );
		}
		else {
			$( '#role_select' ).prop( 'disabled', false );
		}
	};

	$scope.showImportModal = function() {

		$( '#importUsersModal' ).modal( 'toggle' );
	};

	$scope.importUsers = function() {

		var params = 'app_name=admin';
		var filename = $( '#userInput' ).val();
		if ( filename == '' ) {
            $(function(){
                new PNotify({
                    title: 'Error',
                    text:     'Please specify a file to import',
                    type: 'error'
                });
            });

			return;
		}
		var fmt = getFileExtension( filename );
		fmt = fmt.toUpperCase();
		if ( fmt !== 'CSV' && fmt !== 'JSON' && fmt !== 'XML' ) {
            $(function(){
                new PNotify({
                    title: 'Error',
                    text:     'Supported file types are CSV, JSON, and XML.',
                    type: 'error'
                });
            });

			return;
		}
		$( "#importUsersForm" ).attr( 'action', '/rest/system/user?' + params );
		$( "#importUsersForm" ).submit();
	};




	$scope.showExportModal = function() {

		$( '#exportUsersModal' ).modal( 'toggle' );
	};




	$scope.exportUsers = function() {

		var fmt = $scope.selectedExportFormat;
		fmt = fmt.toLowerCase();
		var params = 'app_name=admin&file=true&format=' + fmt;
		var url = CurrentServer + '/rest/system/user?' + params;
		$( '#exportUsersFrame' ).attr( 'src', url );
		$( '#exportUsersModal' ).modal( 'toggle' );
	};





	window.checkImportResults = function( iframe ) {

		var str = $( iframe ).contents().text();
		if ( str && str.length > 0 ) {
			if ( isErrorString( str ) ) {
				var response = {};
				response.responseText = str;
                $(function(){
                    new PNotify({
                        title:    'Error',
                        type:     'error',
                        hide:     false,
                        addclass: "stack-bottomright",
                        text:     getErrorString( response )
                    });
                });

			}
			else {
                $(function(){
                    new PNotify({
                        title: 'User Import',
                        type:  'success',
                        text:  'Users Imported Successfully'
                    });
                });

			}
			$scope.Users = User.get();
			$scope.promptForNew();
			$( '#importUsersModal' ).modal( 'toggle' );
		}
	};
	$scope.init();
};

window.checkImportResults = function( iframe ) {
};