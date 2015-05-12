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
var PackageCtrl = function(dfLoadingScreen, $scope, AppsRelatedToService, Service, $http ) {

    $scope.$on(
        '$routeChangeSuccess', function() {
            $( window ).resize();
        }
    );
    Scope = $scope;
    $scope.Apps = AppsRelatedToService.get({}, function () {

        // Stop loading screen
        dfLoadingScreen.stop();
    });
    Scope.schemaData = {};
    Scope.Services = Service.get(
        function (data) {
            angular.forEach(
                data.record, function (service) {
                    // use /db/_schema not /schema
                    if (service.type.indexOf("SQL DB Schema") == -1 && service.type.indexOf(" SQL DB") != -1) {
                        $http.get('/rest/' + service.api_name + '/_schema?app_name=admin&fields=*').success(
                            function (data) {
                                service.components = data.resource;
                            }
                        );
                    }
                }
            )
        }
    );
    $scope.showDetails = function() {
        $( "#splash" ).hide();
        this.app.app_service_relations = [];
        $( "input:checkbox" ).attr( 'checked', false );
        $scope.app = angular.copy( this.app );
        $scope.currentAppId = this.app.id;
        $( "tr.info" ).removeClass( 'info' );
        $( '#row_' + Scope.app.id ).addClass( 'info' );

        $( '#package-form' ).show();

    };
    Scope.isServiceInApp = function() {
        var inApp = false;
        angular.forEach(
            Scope.app.app_service_relations, function( service ) {
                if ( service.service_id == this.service_id ) {
                    console.log( 'a match' );
                    inApp = true;
                }
            }
        );
        return inApp;
    };
    Scope.addServiceToAppWithComponents = function( checked ) {
        var currentService = this.service;
        var currentComponent = this.component;
        if ( checked ) {
            var found = false;
            angular.forEach(
                Scope.app.app_service_relations, function( service ) {
                    if ( service.service_id === currentService.id ) {
                        found = true;
                        if ( service.component.indexOf( currentComponent.name ) === -1 ) {
                            service.component.push( currentComponent.name );
                        }
                    }
                }
            );
            if ( !found ) {
                var packagedService = {"service_id": currentService.id, "api_name": currentService.api_name, component: [currentComponent.name]};
                Scope.app.app_service_relations.push( packagedService );
            }
        }
        else {
            var goodRelations = [];
            angular.forEach(
                Scope.app.app_service_relations, function( service ) {
                    if ( service.service_id === currentService.id ) {
                        var index;
                        while ( (
                            index = service.component.indexOf( currentComponent.name )
                            ) !== -1 ) {
                            service.component.splice( index, 1 );
                        }
                    }
                    if ( !service.component || service.component.length !== 0 ) {
                        goodRelations.push( service );
                    }
                }
            );
            Scope.app.app_service_relations = goodRelations;
        }
    };
    Scope.addServiceToApp = function( checked ) {
        if ( checked ) {
            var packagedService = {"service_id": this.service.id, "api_name": this.service.api_name};
            Scope.app.app_service_relations.push( packagedService );
        }
        else {
            Scope.app.app_service_relations = removeByAttr( Scope.app.app_service_relations, 'service_id', this.service.id );
        }
    };
    //noinspection ReservedWordAsName
    Scope.export = function() {
        var id = Scope.app.id;
        var exportLink = CurrentServer + '/rest/system/app/' + id + '/?app_name=admin&pkg=true';
        if ( Scope.include_files ) {
            exportLink = exportLink + '&include_files=true';
        }
        if ( $( '.include-schema:checkbox:checked' ).length > 0 ) {
            exportLink = exportLink + "&include_schema=true";
        }
        if ( $( '.include-service:checkbox:checked' ).length > 0 ) {
            exportLink = exportLink + "&include_services=true";
        }

        AppsRelatedToService.update(
            {id: id}, Scope.app, function() {
                $( '#download_frame' ).attr( 'src', exportLink );
            }
        );
    }
};
