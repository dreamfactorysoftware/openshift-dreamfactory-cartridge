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

angular.module('dfSystemConfig', ['ngRoute', 'dfUtility'])
    .constant('MODSYSCONFIG_ROUTER_PATH', '/config')
    .constant('MODSYSCONFIG_ASSET_PATH', 'admin_components/dreamfactory_components/adf-system-config/')
    .config(['$routeProvider', 'MODSYSCONFIG_ROUTER_PATH', 'MODSYSCONFIG_ASSET_PATH',
        function ($routeProvider, MODSYSCONFIG_ROUTER_PATH, MODSYSCONFIG_ASSET_PATH) {
            $routeProvider
                .when(MODSYSCONFIG_ROUTER_PATH, {
                    templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/main.html',
                    controller: 'SystemConfigurationCtrl',
                    resolve: {
                        startLoadingScreen: ['dfLoadingScreen', function (dfLoadingScreen) {

                            // start the loading screen
                            dfLoadingScreen.start();
                        }],

                        getSystemConfigData: ['DSP_URL', '$http', function(DSP_URL, $http) {

                            return $http.get(DSP_URL + '/rest/system/config')
                                .success(function (data) {
                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory System Config Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })
                        }],

                        getRolesData: ['DSP_URL', '$http', function (DSP_URL, $http) {

                            return $http.get(DSP_URL + '/rest/system/role')
                                .success(function (data) {
                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory System Config Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })
                        }],

                        getEmailTemplatesData: ['DSP_URL', '$http', function(DSP_URL, $http) {

                            return $http.get(DSP_URL + '/rest/system/email_template')
                                .success(function (data) {
                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory System Config Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })

                        }],

                        getServicesData: ['DSP_URL', '$http', function (DSP_URL, $http) {

                            return $http.get(DSP_URL + '/rest/system/service')
                                .success(function (data) {
                                    return data
                                })
                                .error(function(error) {

                                    throw {
                                        module: 'DreamFactory System Config Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })
                        }]
                    }
                });
        }])
    .run(['DSP_URL', '$http', 'SystemConfigDataService', function (DSP_URL, $http, SystemConfigDataService) {

    }])
    .controller('SystemConfigurationCtrl', ['dfLoadingScreen','DSP_URL', '$scope', '$http', 'SystemConfigDataService','SystemConfigEventsService', 'getRolesData', 'getEmailTemplatesData', 'getServicesData', 'getSystemConfigData',
        function (dfLoadingScreen, DSP_URL, $scope, $http, SystemConfigDataService, SystemConfigEventsService, getRolesData, getEmailTemplatesData, getServicesData, getSystemConfigData) {

            dfLoadingScreen.stop();

            // PRE-PROCESS API
            $scope.__setNullToEmptyString = function (systemConfigDataObj) {

                angular.forEach(systemConfigDataObj, function(value, key) {

                    if (systemConfigDataObj[key] == null) {

                        systemConfigDataObj[key] = '';
                    }
                });

                return systemConfigDataObj;

            };

            $scope.__getDataFromResponse = function (httpResponseObj) {
                return httpResponseObj.data.record;
            };



            // CREATE SHORT NAMES
            $scope.es = SystemConfigEventsService.systemConfigController;

            // PUBLIC API

            $scope.systemConfig = $scope.__setNullToEmptyString(getSystemConfigData.data);
            $scope.rolesDataObj = $scope.__getDataFromResponse(getRolesData);
            $scope.emailTemplatesDataObj = $scope.__getDataFromResponse(getEmailTemplatesData);
            $scope.servicesDataObj = $scope.__getDataFromResponse(getServicesData);



            $scope.updateConfig = function () {

                $scope._updateConfig()
            };



            // PRIVATE API
            $scope._updateConfigData = function (systemConfigDataObj) {

                return $http.put(DSP_URL + '/rest/system/config', systemConfigDataObj)
            };

            $scope._updateSystemConfigService = function (systemConfigDataObj) {

                SystemConfigDataService.setSystemConfig(systemConfigDataObj);
            };



            // COMPLEX IMPLEMENTATION
            $scope._updateConfig = function () {

                $scope._updateConfigData($scope.systemConfig).then(
                    function(result) {

                        var systemConfigDataObj = result.data;

                        // We no longer store the system config in the SystemConfigDataService
                        // You can only get the config and then use as necessary.  The point
                        // being that you always have a fresh config in the event of a refresh.
                        // We used to store in a cookie for refresh.  Now we just get it and
                        // return the promise.

                        //$scope._updateCookie(systemConfigDataObj);
                        $scope._updateSystemConfigService(systemConfigDataObj);

                        // Needs to be replaced with angular messaging
                        $(function(){
                            new PNotify({
                                title: 'Config',
                                type:  'success',
                                text:  'Updated Successfully.'
                            });
                        });

                        $scope.$emit($scope.es.updateSystemConfigSuccess, systemConfigDataObj);
                    },
                    function(reject) {

                        throw {
                            module: 'DreamFactory System Config Module',
                            type: 'error',
                            provider: 'dreamfactory',
                            exception: reject
                        }
                    }
                )
            }
    }])
    .directive('dreamfactorySystemInfo', ['MODSYSCONFIG_ASSET_PATH', 'DSP_URL', function (MODSYSCONFIG_ASSET_PATH, DSP_URL) {

        return {
            restrict: 'E',
            scope: false,
            templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/system-info.html',
            link: function(scope, elem, attrs) {

            }
        }

    }])
    .directive('dreamfactoryCorsConfig', ['MODSYSCONFIG_ASSET_PATH', 'SystemConfigDataService',
        function (MODSYSCONFIG_ASSET_PATH, SystemConfigDataService) {

            return {
                restrict: 'E',
                templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/cors-config.html',
                scope: true,
                link: function (scope, elem, attrs) {

                    scope.allowedHosts = scope.systemConfig.allowed_hosts;

                    scope.supportedVerbs = [
                        'GET',
                        'POST',
                        'PUT',
                        'PATCH',
                        'MERGE',
                        'DELETE',
                        'COPY'
                    ];


                    // PUBLIC API
                    scope.addNewHost = function () {

                        scope._addNewHost();
                    };

                    scope.removeHost = function (hostDataObjIndex) {

                        scope._confirmRemoveHost(hostDataObjIndex) ? scope._removeHost(hostDataObjIndex) : false;
                    };


                    // PRIVATE API
                    scope._createNewHostModel = function () {

                        return {
                            host: null,
                            is_enabled: false,
                            verbs: []
                        }
                    };

                    scope._addNewHostData = function () {

                        scope.allowedHosts.push(scope._createNewHostModel());
                    };

                    scope._removeHostData = function (hostDataObjIndex) {

                        scope.allowedHosts.splice(hostDataObjIndex, 1);
                    };

                    scope._confirmRemoveHost = function (hostDataObjIndex) {

                        return confirm('Delete Host: ' + scope.allowedHosts[hostDataObjIndex].host)
                    };


                    // COMPLEX IMPLEMENTATION
                    scope._addNewHost = function () {

                        scope._addNewHostData();
                    };

                    scope._removeHost = function (hostDataObjIndex) {

                        scope._removeHostData(hostDataObjIndex);
                    };


                    // WATCHERS AND INIT

                }
            }
        }])
    .directive('dreamfactoryCorsVerbSelector', ['MODSYSCONFIG_ASSET_PATH', function(MODSYSCONFIG_ASSET_PATH) {

        return {
            restrict: 'E',
            templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/cors-verb-selector.html',
            scope: {
                host: '='
            },
            link: function (scope, elem, attrs) {


                scope.toggleState = false;

                scope.hostVerbs = scope.host.verbs;

                scope.verbs = {
                    "GET": false,
                    "POST": false,
                    "PUT": false,
                    "PATCH": false,
                    "MERGE": false,
                    "DELETE": false,
                    "COPY": false
                };


                // PUBLIC API

                scope.toggleAllVerbs = function () {

                    scope._toggleAllVerbs();
                };

                scope.getToggleState = function () {

                    scope._getToggleState();
                };


                // PRIVATE API

                scope._toggleEachProperty = function () {

                    scope.toggleState = !scope.toggleState;

                    angular.forEach(scope.verbs, function(value, key) {
                        scope.verbs[key] = scope.toggleState;
                    });
                };

                scope._verbsToArray = function (verbsDataObj) {

                    var verbsArr = [];

                    angular.forEach(verbsDataObj, function (value, key) {

                        if (value != false) {
                            verbsArr.push(key);
                        }
                    });

                    return verbsArr;
                };



                //COMPLEX IMPLEMENTATION

                scope._toggleAllVerbs = function () {

                    scope._toggleEachProperty();
                };

                scope._getToggleState = function () {

                    return scope.toggleState;
                };



                // WATCHERS AND INIT
                // Watch verbs obj for change
                scope.$watchCollection('verbs', function(newValue, oldValue) {

                    // On change calculate new arr
                    scope.host.verbs = scope._verbsToArray(newValue);
                });

                scope.$watchCollection('hostVerbs', function(newValue, oldValue) {

                    angular.forEach(newValue, function(value, index) {
                        scope.verbs[value] = true;
                    });
                })

            }
        }

    }])
    .directive('dreamfactoryGuestUsersConfig', ['MODSYSCONFIG_ASSET_PATH',
        function (MODSYSCONFIG_ASSET_PATH) {

            return {
                restrict: 'E',
                templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/guest-users-config.html',
                scope: true
            }
    }])
    .directive('dreamfactoryOpenRegistrationConfig', ['MODSYSCONFIG_ASSET_PATH', function(MODSYSCONFIG_ASSET_PATH) {

        return {
            restrict: 'E',
            templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/open-registration-config.html',
            scope: true
        }
    }])
    .directive('dreamfactoryUserInvitesConfig', ['MODSYSCONFIG_ASSET_PATH', function(MODSYSCONFIG_ASSET_PATH) {

        return {
            restrict: 'E',
            templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/user-invites-config.html',
            scope: true

        }
    }])
    .directive('dreamfactoryPasswordResetConfig', ['MODSYSCONFIG_ASSET_PATH', function(MODSYSCONFIG_ASSET_PATH) {

        return {

            restrict: 'E',
            templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/password-reset-config.html',
            scope: true

        }


    }])
    .directive('dreamfactoryEmailTemplates', ['MODSYSCONFIG_ASSET_PATH', 'EmailTemplates', function(MODSYSCONFIG_ASSET_PATH, EmailTemplates) {


        return {
            restrict: 'E',
            scope:false,
            templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/email-templates.html',
            link: function (scope, elem, attrs) {


                // EMAIL TEMPLATES
                // ------------------------------------

                // Store current user
                scope.currentUser = window.CurrentUserID;

                // Store the id of an email template we have selected
                scope.selectedEmailTemplateId = '';

                // Stores a copy email template that is currently being created or edited
                scope.getSelectedEmailTemplate = {};

                // Stores email templates
                scope.emailTemplates = EmailTemplates.get();


                // Facade: determines whether an email should be updated or created
                // and calls the appropriate function
                scope.saveEmailTemplate = function( templateParams ) {

                    if ( (
                        templateParams.id === ''
                        ) || (
                        templateParams.id === undefined
                        ) ) {

                        scope._saveNewEmailTemplate( templateParams );
                    }
                    else {
                        scope._updateEmailTemplate( templateParams );
                    }
                };



                // Updates an existing email
                scope._updateEmailTemplate = function( templateParams ) {

                    templateParams.last_modified_by_id = scope.currentUser;


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

                    scope.$emit( 'updateTemplateListExisting' );

                };

                // Creates a new email in the database
                scope._saveNewEmailTemplate = function( templateParams ) {

                    templateParams.created_by_id = scope.currentUser;
                    templateParams.last_modified_by_id = scope.currentUser;

                    EmailTemplates.save(
                        {}, templateParams, function( data ) {

                            var emitArgs, d = {}, key;

                            for ( key in data ) {
                                if ( data.hasOwnProperty( key ) ) {
                                    d[key] = data[key];
                                }
                            }

                            emitArgs = d;

                            scope.$emit( 'updateTemplateListNew', emitArgs );

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
                scope.deleteEmailTemplate = function( templateId ) {

                    if ( !confirm( 'Delete Email Template: \n\n' + scope.getSelectedEmailTemplate.name ) ) {
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

                    scope.$emit( 'templateDeleted' );

                };

                // Special Functions
                // Duplicates an email template for editing
                scope.duplicateEmailTemplate = function() {

                    var templateCopy;

                    if ( (
                        scope.getSelectedEmailTemplate.id === ''
                        ) || (
                        scope.getSelectedEmailTemplate.id === undefined
                        ) || (
                        scope.getSelectedEmailTemplate === null
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
                        templateCopy = angular.copy( scope.getSelectedEmailTemplate );

                        templateCopy.id = '';
                        templateCopy.name = 'Clone of ' + templateCopy.name;
                        templateCopy.created_date = '';
                        templateCopy.created_by_id = '';

                        scope.getSelectedEmailTemplate = angular.copy( templateCopy );
                    }
                };

                // Events
                // Update existing scope.emailTemplates.record entry
                scope.$on(
                    'updateTemplateListExisting', function() {

                        // Loop through emailTemplates.record to find our currently selected
                        // email template by its id
                        angular.forEach(
                            scope.emailTemplates.record, function( v, i ) {
                                if ( v.id === scope.selectedEmailTemplateId ) {

                                    // replace that email template with the one we are currently working on
                                    scope.emailTemplates.record.splice( i, 1, scope.getSelectedEmailTemplate );
                                }
                            }
                        );
                    }
                );

                // Add a newly created email template to scope.emailTemplates.record
                scope.$on(
                    'updateTemplateListNew', function( event, emitArgs ) {

                        scope.emailTemplates.record.push( emitArgs );
                        scope.newEmailTemplate();

                    }
                );

                // Delete email template from scope.emailTemplates.record
                scope.$on(
                    'templateDeleted', function() {

                        var templateIndex = null;

                        // Loop through scope.emailTemplates.record
                        angular.forEach(
                            scope.emailTemplates.record, function( v, i ) {

                                // If we find a template id that matches our currently selected
                                // template id, store the index of that template object
                                if ( v.id === scope.selectedEmailTemplateId ) {
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
                            scope.emailTemplates.record.splice( templateIndex, 1 );
                        }

                        // Reset scope.getSelectedEmailTemplate and scope.selectedEmailTemplateId
                        scope.newEmailTemplate();
                    }
                );

                // UI Functions
                // Reset scope.selectedEmailTemplateId and scope.getSelectedEmailTemplate
                scope.newEmailTemplate = function() {
                    // set selected email template to none and clear fields
                    scope.getSelectedEmailTemplate = {};
                    scope.selectedEmailTemplateId = '';
                    scope.showCreateEmailTab( 'template-info-pane' );
                };

                // Create Email Nav
                // Store the nav tab we are currently on
                scope.currentCreateEmailTab = 'template-info-pane';

                // Set the nav tab to the one we clicked
                scope.showCreateEmailTab = function( id ) {
                    scope.currentCreateEmailTab = id;
                };

                // Watch email template selection and assign proper template
                scope.$watch(
                    'selectedEmailTemplateId', function() {

                        // Store our found emailTemplate
                        // Initialize with an empty record
                        var result = [];

                        // Loop through scope.emailTemplates..record
                        angular.forEach(
                            scope.emailTemplates.record, function( value, index ) {

                                // If we find our email template
                                if ( value.id === scope.selectedEmailTemplateId ) {

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

                        scope.getSelectedEmailTemplate = angular.copy( result[0] );
                    }
                );
            }
        }
    }])
    .directive('dreamfactoryGlobalLookupKeysConfig', ['MODSYSCONFIG_ASSET_PATH', function(MODSYSCONFIG_ASSET_PATH) {

        return {
            restrict: 'E',
            templateUrl: MODSYSCONFIG_ASSET_PATH + 'views/global-lookup-keys-config.html',
            scope: false,
            link: function (scope, elem, attrs) {

                // PUBLIC API
                scope.newKey = function () {

                    scope._newKey();
                };

                scope.removeKey = function() {

                    scope._removeKey();
                };


                // PRIVATE API
                scope._createLookupKeyModel = function () {

                    return {
                        name: "",
                        value: "",
                        private: false
                    };
                };


                scope._isUniqueKey = function() {

                    var size = scope.systemConfig.lookup_keys.length - 1;
                    for ( var i = 0; i < size; i++ ) {
                        var key = scope.systemConfig.lookup_keys[i];
                        var matches = scope.systemConfig.lookup_keys.filter(
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



                // COMPLEX IMPLEMENTATION
                scope._newKey = function () {

                    scope.systemConfig.lookup_keys.push(scope._createLookupKeyModel());
                };

                scope._removeKey = function () {

                    scope.systemConfig.lookup_keys.splice( this.$index, 1 );
                };

            }
        }


    }])
    .service('SystemConfigEventsService', [function() {

        return {
            systemConfigController: {
                updateSystemConfigRequest: 'update:systemconfig:request',
                updateSystemConfigSuccess: 'update:systemconfig:success',
                updateSystemConfigError: 'update:systemconfig:error'
            }
        }
    }]);
