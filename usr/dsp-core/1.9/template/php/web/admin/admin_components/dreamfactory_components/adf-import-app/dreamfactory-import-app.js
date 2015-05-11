


angular.module('dfImportApp', ['ngRoute', 'dfUtility'])
    .constant('MODIMPORTAPP_ROUTER_PATH', '/import')
    .constant('MODIMPORTAPP_ASSET_PATH', 'admin_components/dreamfactory_components/adf-import-app/')
    .config(['$routeProvider', 'MODIMPORTAPP_ROUTER_PATH', 'MODIMPORTAPP_ASSET_PATH',
        function ($routeProvider, MODIMPORTAPP_ROUTER_PATH, MODIMPORTAPP_ASSET_PATH) {
            $routeProvider
                .when(MODIMPORTAPP_ROUTER_PATH, {
                    templateUrl: MODIMPORTAPP_ASSET_PATH + 'views/main.html',
                    controller: 'ImportAppCtrl',
                    resolve: {
                        startLoadingScreen: ['dfLoadingScreen', function (dfLoadingScreen) {

                            // start the loading screen
                            //dfLoadingScreen.start();
                        }],
                        getStorageServices: ['DSP_URL', '$http', function(DSP_URL, $http) {

                            return $http.get(DSP_URL + '/rest/system/service', {params: {filter: "type_id in ( 4098, 2 )"}})
                        }]
                    }
                });
        }])
    .run(['DSP_URL', 'dfLoadingScreen', function (DSP_URL, dfLoadingScreen) {


    }])
    .controller('ImportAppCtrl', ['dfLoadingScreen', 'DSP_URL', '$scope', '$http', 'getStorageServices',
        function(dfLoadingScreen, DSP_URL, $scope, $http, getStorageServices){


            $scope.__getDataFromHttpResponse = function(httpResponseObj) {

                if (httpResponseObj.hasOwnProperty('data')) {
                    if (httpResponseObj.data.hasOwnProperty('record')) {
                        return httpResponseObj.data.record;
                    }
                    else if (httpResponseObj.data.hasOwnProperty('resource')) {
                        return httpResponseObj.data.resource;
                    }
                }

                return [];
            };

            $scope.services = $scope.__getDataFromHttpResponse(getStorageServices);

            $scope.appPath = null;
            $scope.storageService = '';
            $scope.storageContainer = '';
            $scope.field = angular.element('#upload');
            $scope.uploadFile = null;

            $scope.sampleApps = [
                {
                    name: 'Todo List jQuery',
                    descr: 'Learn how to authenticate and make CRUD calls to your DSP using the JavaScript SDK.',
                    url: 'https://raw.github.com/dreamfactorysoftware/app-todo-jquery/master/todojquery.dfpkg'
                },
                {
                    name: 'Todo List AngularJS',
                    descr: 'The Todo List app with AngularJS.',
                    url: 'https://raw.github.com/dreamfactorysoftware/app-todo-angular/master/todoangular.dfpkg'
                },
                {
                    name: 'Todo List Sencha',
                    descr: 'The Todo List app with Sencha Touch (phone/tablet only).',
                    url: 'https://raw.github.com/dreamfactorysoftware/app-todo-sencha/master/todosencha.dfpkg'
                },
                {
                    name: 'Calendar',
                    descr: 'Another sample application showing how to perform CRUD operations on your DSP.',
                    url: 'https://raw.github.com/dreamfactorysoftware/app-calendar/master/calendar.dfpkg'
                },
                {
                    name: 'Address Book',
                    descr: 'An address book for mobile and desktop written by Modus Create. Based on Sencha Touch and Ext JS.',
                    url: 'https://raw.github.com/dreamfactorysoftware/app-address-book/master/add_min.dfpkg'
                }
            ]


            // PUBLIC API
            $scope.submitApp = function () {

                if (!$scope.appPath) {
                    return false;
                }

                $scope._submitApp();
            };

            $scope.browseFileSystem = function () {

                $scope._resetImportApp();
                $scope.field.trigger('click');
            };

            $scope.loadSampleApp = function (appObj) {

                $scope._loadSampleApp(appObj);
            };


            // PRIVATE API
            $scope._isAppPathUrl = function (appPathStr) {

                return appPathStr.substr(0, 7) === 'http://' || appPathStr.substr(0, 8) === 'https://';
            };

            $scope._importAppToServer = function(requestDataObj) {

                dfLoadingScreen.start();

                var _options = {
                    method: "POST",
                    url: DSP_URL + '/rest/system/app',
                    data: requestDataObj
                };

                if ($scope._isAppPathUrl($scope.appPath)) {

                    _options['headers'] = {
                        "Content-type" : 'application/json'
                    }

                }
                else {
                    _options['headers'] = {"Content-type" : undefined};
                    _options['transformRequest'] = angular.identity
                }

                return $http(_options);

            };

            $scope._isDFPackage = function (appPathStr) {

                return appPathStr.substr(appPathStr.lastIndexOf('.')) === '.dfpkg'
            };

            $scope._getContainersFromServer = function (requestDataObj) {

                return $http({
                    method: 'GET',
                    url: DSP_URL + '/rest/' + requestDataObj.serviceApiName
                })
            };

            $scope._resetImportApp = function () {

                $scope.appPath = null;
                $scope.storageService = '';
                $scope.storageContainer = '';
                $scope.uploadFile = null;
                $scope.field.val('');
            }


            // COMPLEX IMPLEMENTATION
            $scope._loadSampleApp = function (appObj) {

                $scope.appPath = appObj.url;
            };

            $scope._submitApp = function () {

                var requestDataObj = {};

                if ($scope._isAppPathUrl($scope.appPath)) {

                    requestDataObj = {
                        import_url: $scope.appPath,
                        storage_service_id: $scope.storageService.id,
                        storage_container: $scope.storageContainer.path
                    }
                }
                else {


                    var fd = new FormData();
                    fd.append('files', $scope.uploadFile);
                    requestDataObj = fd
                }

                $scope._importAppToServer(requestDataObj).then(

                    function(result) {


                        $scope.$broadcast('success:request', 'App imported successfully.');
                        window.top.Actions.updateSession("update");

                    },
                    function(reject) {

                        //Error handled by api error handler in app.js
                       /* throw {
                            module: 'DreamFactory Import App Module',
                            type: 'error',
                            provider: 'dreamfactory',
                            exception: reject
                        }*/
                    }
                )
                    .finally(
                        function(success) {

                            dfLoadingScreen.stop();
                            $scope._resetImportApp();

                        },

                        function (error) {

                            dfLoadingScreen.stop();
                            $scope._resetImportApp();
                        }
                    )
            };


            // WATCHERS AND INIT
            $scope.$watch('uploadFile', function(newValue, oldValue) {

                if (!newValue) return false;

                if (!$scope._isDFPackage(newValue.name)) {

                    throw {
                        module: 'DreamFactory Import App Module',
                        type: 'error',
                        provider: 'dreamfactory',
                        exception: 'Only files with "dfpkg" extensions can be uploaded.'
                    }
                }

                $scope.appPath = newValue.name;
            });

            $scope.$watch('storageService', function(newValue, oldValue) {

                if (!newValue) return false;

                var requestDataObj = {
                    serviceApiName: newValue.api_name
                };

                $scope._getContainersFromServer(requestDataObj).then(
                    function(result) {

                        $scope.containers = $scope.__getDataFromHttpResponse(result);
                    },

                    function(reject) {

                        throw {
                            module: 'DreamFactory Import App Module',
                            type: 'error',
                            provider: 'dreamfactory',
                            exception: reject
                        }
                    }
                )
            });


            //  MESSAGES
            $scope.$on('success:request', function (e, message) {


                // Needs to be replaced with angular messaging
                $(function(){
                    new PNotify({
                        title: 'Dreamfactory App Import Module',
                        type:  'success',
                        text:  message
                    });
                });

            })

        }]);