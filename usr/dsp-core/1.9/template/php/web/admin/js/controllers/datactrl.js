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
var DataCtrl = function( dfLoadingScreen, $scope, Schema, DB, $http, DSP_URL, getDataServices) {

    dfLoadingScreen.stop();


    $scope.__getDataFromResponse = function (httpResponseObj) {
        return httpResponseObj.data.record;
    };


    $scope.__services__ = $scope.__getDataFromResponse(getDataServices);
    // $scope.__services__.push({api_name:'system', name: 'System'});

    $scope.selected = {
        service: null,
        resource: null
    };

    $scope.options = {
        service: $scope.selected.service,
        table: $scope.selected.resource,
        url: DSP_URL + '/rest/' + $scope.selected.service + '/' + $scope.selected.resource,
        allowChildTable: true,
        childTableAttachPoint: '#child-table-attach'
    };

    $scope.$watchCollection('selected', function (newValue, oldValue) {

        var options = {
            service: newValue.service,
            table: newValue.resource,
            url: DSP_URL + '/rest/' + newValue.service + '/' + newValue.resource,
            allowChildTable: true,
            childTableAttachPoint: '#child-table-attach'
        };

        $scope.options = options;

    });
};


