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
/**
 * @param $scope
 * @param Config
 * @param Role
 * @param EmailTemplates
 * @param Service
 * @constructor
 */
var ConfigCtrl = function( $scope, Config, Role, EmailTemplates, Service ) {
	$scope.allVerbs = ["GET", "POST", "PUT", "MERGE", "PATCH", "DELETE", "COPY"];
	// keys
	$scope.removeKey = function() {

		var rows = $scope.Config.lookup_keys;
		rows.splice( this.$index, 1 );
	};
	$scope.newKey = function() {

		var newKey = {"name": "", "value": "", "private": false};
		$scope.Config.lookup_keys.push( newKey );
	};
	$scope.uniqueKey = function() {
		var size = $scope.Config.lookup_keys.length;
		for ( var i = 0; i < size; i++ ) {
			var _key = $scope.Config.lookup_keys[i];

			var matches = $scope.Config.lookup_keys.filter(
				function( itm ) {
					return _key.name === itm.name;
				}
			);
			if ( matches.length > 1 ) {
				return false;
			}
		}
		return true;
	};
	$scope.emptyKey = function() {

		var matches = $scope.Config.lookup_keys.filter(
			function( itm ) {
				return itm.name === '';
			}
		);
		return matches.length > 0;
	};
	// convert between null and empty string for menus
	$scope.fixValues = function( data, fromVal, toVal ) {
		if ( data.guest_role_id === fromVal ) {
			data.guest_role_id = toVal;
		}
		if ( data.open_reg_role_id === fromVal ) {
			data.open_reg_role_id = toVal;
		}
		if ( data.open_reg_email_service_id === fromVal ) {
			data.open_reg_email_service_id = toVal;
		}
		if ( data.open_reg_email_template_id === fromVal ) {
			data.open_reg_email_template_id = toVal;
		}
		if ( data.invite_email_service_id === fromVal ) {
			data.invite_email_service_id = toVal;
		}
		if ( data.invite_email_template_id === fromVal ) {
			data.invite_email_template_id = toVal;
		}
		if ( data.password_email_service_id === fromVal ) {
			data.password_email_service_id = toVal;
		}
		if ( data.password_email_template_id === fromVal ) {
			data.password_email_template_id = toVal;
		}
	};
	$scope.Config = Config.get(
		function( response ) {
			$scope.fixValues( response, null, '' );
		}
	);
	// roles
	$scope.Roles = Role.get(
		function() {
		}
	);
	$scope.Service = Service.get(
		function() {
		}
	);
	$scope.addHost = function() {
		$scope.Config.allowed_hosts.push( $scope.CORS.host );
		$scope.CORS.host = "";
	};
	$scope.save = function() {
		if ( $scope.emptyKey() ) {
            $(function(){
                new PNotify({
                    title: 'Configuration',
                    type:  'error',
                    text:  'Empty key names are not allowed.'
                });
            });

			return;
		}
		if ( !$scope.uniqueKey() ) {
            $(function(){
                new PNotify({
                    title: 'Configuration',
                    type:  'error',
                    text:  'Duplicate key names are not allowed.'
                });
            });
			return;
		}
		var data = angular.copy( $scope.Config );
		$scope.fixValues( data, '', null );
		Config.update(
			data, function( response ) {

				$scope.Config.lookup_keys = angular.copy( response.lookup_keys );
                $(function(){
                    new PNotify({
                        title: 'Configuration',
                        text: 'Updated Successfully',
                        type: 'success'
                    });
                });
			}
		);
	};
	$scope.upgrade = function() {

		window.top.location = CurrentServer + '/web/upgrade';
	};
	$scope.removeHost = function() {
		var index = this.$index;
		$scope.Config.allowed_hosts.splice( index, 1 );
	};
	$scope.selectAll = function( $event ) {

		if ( $event.target.checked ) {
			this.host.verbs = $scope.allVerbs;
		}
		else {
			this.host.verbs = [];
		}

	};
	$scope.toggleVerb = function() {

		var index = this.$parent.$index;
		if ( $scope.Config.allowed_hosts[index].verbs.indexOf( this.verb ) === -1 ) {
			$scope.Config.allowed_hosts[index].verbs.push( this.verb );
		}
		else {
			$scope.Config.allowed_hosts[index].verbs.splice( $scope.Config.allowed_hosts[index].verbs.indexOf( this.verb ), 1 );
		}
	};
	$scope.promptForNew = function() {
		var newhost = {};
		newhost.verbs = $scope.allVerbs;
		newhost.host = "";
		newhost.is_enabled = true;
		$scope.Config.allowed_hosts.unshift( newhost );
	};

	// EMAIL TEMPLATES
	// ------------------------------------

	// Store current user
	$scope.currentUser = window.CurrentUserID;

	// Store the id of an email template we have selected
	$scope.selectedEmailTemplateId = '';

	// Stores a copy email template that is currently being created or edited
	$scope.getSelectedEmailTemplate = {};

	// Stores email templates
	$scope.emailTemplates = EmailTemplates.get(
		function() {
		}
	);

	// Facade: determines whether an email should be updated or created
	// and calls the appropriate function
	$scope.saveEmailTemplate = function( templateParams ) {

		if ( (
			 templateParams.id === ''
			 ) || (
			 templateParams.id === undefined
			 ) ) {

			$scope._saveNewEmailTemplate( templateParams );
		}
		else {
			$scope._updateEmailTemplate( templateParams );
		}
	};

	// Updates an existing email
	$scope._updateEmailTemplate = function( templateParams ) {

		templateParams.last_modified_by_id = $scope.currentUser;

		EmailTemplates.update(
			{id: templateParams.id}, templateParams, function() {
				$.pnotify(
					{
						title: 'Email Template',
						type:  'success',
						text:  'Updated Successfully'
					}
				);
			}
		);

		$scope.$emit( 'updateTemplateListExisting' );

	};

	// Creates a new email in the database
	$scope._saveNewEmailTemplate = function( templateParams ) {

		templateParams.created_by_id = $scope.currentUser;
		templateParams.last_modified_by_id = $scope.currentUser;

		EmailTemplates.save(
			{}, templateParams, function( data ) {

				var emitArgs, d = {}, key;

				for ( key in data ) {
					if ( data.hasOwnProperty( key ) ) {
						d[key] = data[key];
					}
				}

				emitArgs = d;

				$scope.$emit( 'updateTemplateListNew', emitArgs );

				$.pnotify(
					{
						title: 'Email Template',
						type:  'success',
						text:  'Created Successfully'
					}
				);
			}
		);
	};

	// Deletes and email from the database
	$scope.deleteEmailTemplate = function( templateId ) {

		if ( !confirm( 'Delete Email Template: \n\n' + $scope.getSelectedEmailTemplate.name ) ) {
			return;
		}

		EmailTemplates.delete(
			{id: templateId}, function() {
				$.pnotify(
					{
						title: 'Email Templates',
						type:  'success',
						text:  'Template Deleted'
					}
				);
			}
		);

		$scope.$emit( 'templateDeleted' );

	};

	// Special Functions
	// Duplicates an email template for editing
	$scope.duplicateEmailTemplate = function() {

		var templateCopy;

		if ( (
			 $scope.getSelectedEmailTemplate.id === ''
			 ) || (
			 $scope.getSelectedEmailTemplate.id === undefined
			 ) || (
			 $scope.getSelectedEmailTemplate === null
			 ) ) {
			console.log( 'No email template Selected' );

			$.pnotify(
				{
					title: 'Email Templates',
					type:  'error',
					text:  'No template selected.'
				}
			);
		}
		else {
			templateCopy = angular.copy( $scope.getSelectedEmailTemplate );

			templateCopy.id = '';
			templateCopy.name = 'Clone of ' + templateCopy.name;
			templateCopy.created_date = '';
			templateCopy.created_by_id = '';

			$scope.getSelectedEmailTemplate = angular.copy( templateCopy );
		}
	};

	// Events
	// Update existing $scope.emailTemplates.record entry
	$scope.$on(
		'updateTemplateListExisting', function() {

			// Loop through emailTemplates.record to find our currently selected
			// email template by its id
			angular.forEach(
				$scope.emailTemplates.record, function( v, i ) {
					if ( v.id === $scope.selectedEmailTemplateId ) {

						// replace that email template with the one we are currently working on
						$scope.emailTemplates.record.splice( i, 1, $scope.getSelectedEmailTemplate );
					}
				}
			);
		}
	);

	// Add a newly created email template to $scope.emailTemplates.record
	$scope.$on(
		'updateTemplateListNew', function( event, emitArgs ) {

			$scope.emailTemplates.record.push( emitArgs );
			$scope.newEmailTemplate();

		}
	);

	// Delete email template from $scope.emailTemplates.record
	$scope.$on(
		'templateDeleted', function() {

			var templateIndex = null;

			// Loop through $scope.emailTemplates.record
			angular.forEach(
				$scope.emailTemplates.record, function( v, i ) {

					// If we find a template id that matches our currently selected
					// template id, store the index of that template object
					if ( v.id === $scope.selectedEmailTemplateId ) {
						templateIndex = i;
					}
				}
			);

			// Check to make sure our template exists
			if ( (
				 templateIndex != ''
				 ) && (
				 templateIndex != undefined
				 ) && (
				 templateIndex != null
				 ) ) {

				// If it does splice it out
				$scope.emailTemplates.record.splice( templateIndex, 1 );
			}

			// Reset $scope.getSelectedEmailTemplate and $scope.selectedEmailTemplateId
			$scope.newEmailTemplate();
		}
	);

	// UI Functions
	// Reset $scope.selectedEmailTemplateId and $scope.getSelectedEmailTemplate
	$scope.newEmailTemplate = function() {
		// set selected email template to none and clear fields
		$scope.getSelectedEmailTemplate = {};
		$scope.selectedEmailTemplateId = '';
		$scope.showCreateEmailTab( 'template-info-pane' );
	};

	// Create Email Nav
	// Store the nav tab we are currently on
	$scope.currentCreateEmailTab = 'template-info-pane';

	// Set the nav tab to the one we clicked
	$scope.showCreateEmailTab = function( id ) {
		$scope.currentCreateEmailTab = id;
	};

	// Watch email template selection and assign proper template
	$scope.$watch(
		'selectedEmailTemplateId', function() {

			// Store our found emailTemplate
			// Initialize with an empty record
			var result = [];

			// Loop through $scope.emailTemplates..record
			angular.forEach(
				$scope.emailTemplates.record, function( value, index ) {

					// If we find our email template
					if ( value.id === $scope.selectedEmailTemplateId ) {

						// Store it
						result.push( value );
					}
				}
			);

			// the result array should contain a single element
			if ( result.length !== 1 ) {
				//console.log(result.length + 'templates found');
				return;
			}

			$scope.getSelectedEmailTemplate = angular.copy( result[0] );
		}
	);
};
