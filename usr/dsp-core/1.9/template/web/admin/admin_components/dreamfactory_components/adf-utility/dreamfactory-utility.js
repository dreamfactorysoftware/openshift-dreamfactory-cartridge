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


angular.module('dfUtility', [])
    .constant('DF_UTILITY_ASSET_PATH', 'admin_components/dreamfactory_components/adf-utility/')
    .directive('dreamfactoryAutoHeight', ['$window', '$route', function ($window) {

        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                // Return jQuery window ref
                scope._getWindow = function () {
                    return $(window);
                };

                // Return jQuery document ref
                scope._getDocument = function () {
                    return $(document);
                };

                // Return jQuery window or document.  If neither just return the
                // string value for the selector engine
                scope._getParent = function (parentStr) {
                    switch (parentStr) {
                        case 'window':
                            return scope._getWindow();
                            break;

                        case 'document':
                            return scope._getDocument();
                            break;

                        default:
                            return $(parentStr);
                    }
                };

                // TODO: Element position/offset out of whack on route change.  Set explicitly.  Not the best move.
                scope._setElementHeight = function () {
                    angular.element(elem).css({height: scope._getParent(attrs.autoHeightParent).height() - 173 - attrs.autoHeightPadding});

                    /*console.log(scope._getParent(attrs.autoHeightParent).height());
                     console.log($(elem).offset().top)
                     console.log(angular.element(elem).height())*/
                };

                scope._setElementHeight();

                // set height on resize
                angular.element($window).on(
                    'resize', function () {
                        scope._setElementHeight();
                    }
                );
            }
        }
    }
    ])
    .directive('resize', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);

            scope.getWindowDimensions = function () {
                return {'h': w.height(), 'w': w.width()};
            };

            scope.$watch(
                scope.getWindowDimensions, function (newValue, oldValue) {
                    scope.windowHeight = newValue.h;
                    scope.windowWidth = newValue.w;

                    angular.element(element).css(
                        {
                            width: (
                                newValue.w - angular.element('sidebar').css('width')
                                ) + 'px'
                        }
                    );

                    /*scope.style = function () {
                     return {
                     'height': (newValue.h - 100) + 'px',
                     'width': (newValue.w - 100) + 'px'
                     };
                     };*/

                }, true
            );

            /* w.bind('resize', function () {
             scope.$apply();
             });*/
        }
    })
    .directive('dfVerbPicker', [
        'DF_UTILITY_ASSET_PATH', function (DF_UTILITY_ASSET_PATH) {

            return {
                restrict: 'E',
                scope: {
                    allowedVerbs: '=?',
                    allowedVerbMask: '=?',
                    description: '=?'
                },
                templateUrl: DF_UTILITY_ASSET_PATH + 'views/verb-picker.html',
                link: function (scope, elem, attrs) {

                    scope.verbs = {
                        GET: {name: 'GET', active: false, description: ' (read)', mask: 1},
                        POST: {name: 'POST', active: false, description: ' (create)', mask: 2},
                        PUT: {name: 'PUT', active: false, description: ' (replace)', mask: 4},
                        PATCH: {name: 'PATCH', active: false, description: ' (update)', mask: 8},
                        MERGE: {name: 'MERGE', active: false, description: ' (update)', mask: 16},
                        DELETE: {name: 'DELETE', active: false, description: ' (remove)', mask: 32}
                    };

                    scope.btnText = 'None Selected';
                    scope.description = true;

                    scope._setVerbState = function (nameStr, stateBool) {
                        var verb = scope.verbs[nameStr];
                        if (scope.verbs.hasOwnProperty(verb.name)) {
                            scope.verbs[verb.name].active = stateBool;
                        }
                    };

                    scope._toggleVerbState = function (nameStr, event) {
                        event.stopPropagation();

                        if (scope.verbs.hasOwnProperty(scope.verbs[nameStr].name)) {
                            scope.verbs[nameStr].active = !scope.verbs[nameStr].active;
                            scope.allowedVerbMask = scope.allowedVerbMask ^ scope.verbs[nameStr].mask;
                        }

                        scope.allowedVerbs = [];

                        angular.forEach(
                            scope.verbs, function (_obj) {
                                if (_obj.active) {
                                    scope.allowedVerbs.push(_obj.name);
                                }

                            }
                        );
                    };

                    scope._isVerbActive = function (verbStr) {

                        return scope.verbs[verbStr].active
                    };

                    scope._setButtonText = function () {

                        var verbs = [];

                        angular.forEach(scope.verbs, function (verbObj) {

                            if (verbObj.active) {
                                verbs.push(verbObj.name);
                            }

                        })

                        scope.btnText = '';

                        var max = 1;
                        if (verbs.length == 0) {
                            scope.btnText = 'None Selected';

                        } else if (verbs.length > 0 && verbs.length <= max) {

                            angular.forEach(
                                verbs, function (_value, _index) {
                                    if (scope._isVerbActive(_value)) {
                                        if (_index != verbs.length - 1) {
                                            scope.btnText +=
                                                (
                                                    _value + ', '
                                                    );
                                        } else {
                                            scope.btnText += _value
                                        }
                                    }
                                }
                            )

                        } else if (verbs.length > max) {
                            scope.btnText = verbs.length + ' Selected';
                        }
                    };

                    scope.$watch('allowedVerbs', function (newValue, oldValue) {

                            if (!newValue) {
                                return false;
                            }

                            angular.forEach(
                                scope.allowedVerbs, function (_value, _index) {

                                    scope._setVerbState(_value, true);
                                }
                            );

                            scope._setButtonText();

                        });

                    scope.$watch('allowedVerbMask', function (n, o) {

                        if (n == null && n == undefined) return false;

                        angular.forEach(scope.verbs, function (verbObj) {

                            if (n & verbObj.mask) {
                                verbObj.active = true;
                            }
                        });

                        scope._setButtonText();
                    });

                    elem.css({
                            'display': 'inline-block', 'position': 'absolute'
                        });

                }
            }
        }
    ])
    .directive('dfRequestorPicker', [
        'DF_UTILITY_ASSET_PATH', function (DF_UTILITY_ASSET_PATH) {

            return {
                restrict: 'E',
                scope: {
                    allowedRequestors: '=?',
                    allowedRequestorMask: '=?'
                },
                templateUrl: DF_UTILITY_ASSET_PATH + 'views/requestor-picker.html',
                link: function (scope, elem, attrs) {

                    scope.requestors = {
                        API: {name: 'API', active: false, mask: 1},
                        SCRIPT: {name: 'SCRIPT', active: false, mask: 2}
                    };

                    scope.btnText = 'None Selected';

                    scope._setRequestorState = function (nameStr, stateBool) {
                        var requestor = scope.requestors[nameStr];
                        if (scope.requestors.hasOwnProperty(requestor.name)) {
                            scope.requestors[requestor.name].active = stateBool;
                        }
                    };

                    scope._toggleRequestorState = function (nameStr, event) {
                        event.stopPropagation();

                        if (scope.requestors.hasOwnProperty(scope.requestors[nameStr].name)) {
                            scope.requestors[nameStr].active = !scope.requestors[nameStr].active;
                            scope.allowedRequestorMask = scope.allowedRequestorMask ^ scope.requestors[nameStr].mask;
                        }

                        scope.allowedRequestors = [];

                        angular.forEach(
                            scope.requestors, function (_obj) {
                                if (_obj.active) {
                                    scope.allowedRequestors.push(_obj.name);
                                }
                            }
                        );
                    };

                    scope._isRequestorActive = function (requestorStr) {

                        return scope.requestors[requestorStr].active
                    };

                    scope._setButtonText = function () {

                        var requestors = [];

                        angular.forEach(scope.requestors, function (rObj) {

                            if (rObj.active) {
                                requestors.push(rObj.name);
                            }
                        });

                        scope.btnText = '';

                        if (requestors.length == 0) {
                            scope.btnText = 'None Selected';

                        } else {

                            angular.forEach(
                                requestors, function (_value, _index) {
                                    if (scope._isRequestorActive(_value)) {
                                        if (_index != requestors.length - 1) {
                                            scope.btnText +=
                                                (
                                                    _value + ', '
                                                    );
                                        } else {
                                            scope.btnText += _value
                                        }
                                    }
                                }
                            )

                        }
                    };

                    scope.$watch('allowedRequestors', function (newValue, oldValue) {

                            if (!newValue) {
                                return false;
                            }

                            angular.forEach(
                                scope.allowedRequestors, function (_value, _index) {

                                    scope._setRequestorState(_value, true);
                                }
                            );

                            scope._setButtonText();

                        });

                    scope.$watch('allowedRequestorMask', function (n, o) {

                        if (n == null && n == undefined) return false;

                        angular.forEach(scope.requestors, function (requestorObj) {

                            if (n & requestorObj.mask) {
                                requestorObj.active = true;
                            }
                        });

                        scope._setButtonText();
                    });

                    elem.css(
                        {
                            'display': 'inline-block', 'position': 'absolute'
                        }
                    );

                }
            }
        }
    ])
    .directive('dfServicePicker', [
        'DF_UTILITY_ASSET_PATH', 'DSP_URL', '$http', function (DF_UTILITY_ASSET_PATH, DSP_URL, $http) {

            return {
                restrict: 'E',
                scope: {
                    services: '=?',
                    selected: '=?'
                },
                templateUrl: DF_UTILITY_ASSET_PATH + 'views/df-service-picker.html', link: function (scope, elem, attrs) {

                    scope.resources = [];
                    scope.activeResource = null;
                    scope.activeService = null;

                    // PUBLIC API
                    scope.setServiceAndResource = function () {

                        if (scope._checkForActive()) {
                            scope._setServiceAndResource();
                        }
                    };

                    // PRIVATE API
                    scope._getResources = function () {
                        return $http(
                            {
                                method: 'GET', url: DSP_URL + '/rest/' + scope.activeService
                            }
                        )
                    };

                    // COMPLEX IMPLEMENTATION
                    scope._setServiceAndResource = function () {
                        scope.selected = {
                            service: scope.activeService, resource: scope.activeResource
                        };
                    };

                    scope._checkForActive = function () {

                        return !!scope.activeResource && scope.activeService;
                    };

                    // WATCHERS AND INIT
                    scope.$watch(
                        'activeService', function (newValue, oldValue) {

                            if (!newValue) {
                                scope.resources = [];
                                scope.activeResource = null;
                                return false;
                            }

                            scope.resources = [];

                            scope._getResources().then(
                                function (result) {

                                    scope.resources = result.data.resource;
                                },

                                function (reject) {
                                    throw {
                                        module: 'DreamFactory Utility Module', type: 'error', provider: 'dreamfactory', exception: reject
                                    }
                                }
                            )
                        }
                    );

                    // MESSAGES
                }
            }
        }
    ])
    .directive('dfAceEditor', ['DSP_URL', 'DF_UTILITY_ASSET_PATH', '$http', function (DSP_URL, DF_UTILITY_ASSET_PATH, $http) {

        return {
            restrict: 'E',
            scope: {
                directData: '=?',
                currentEditor: '=?',
                serviceName: '=?',
                fileName: '=?',
                filePath: '=?',
                isUserCustom: '=?',
                isClean: '=?',
                isEditable: '=?',
                currentScriptObj: '=?'
            },
            templateUrl: DF_UTILITY_ASSET_PATH + 'views/df-ace-editor.html',
            link: function (scope, elem, attrs) {

                scope.editor = null;
                // scope.currentScriptObj = '';
                scope.backupDoc = '';

                // PRIVATE API
                scope._getFileFromServer = function (requestDataObj) {

                    return $http({
                        method: 'GET',
                        url: DSP_URL + '/rest' + requestDataObj.serviceName + '/' + requestDataObj.fileName,
                        cache: false,
                        params: requestDataObj.params
                    })
                };

                scope._saveFileOnServer = function (requestDataObj) {

                    return $http({
                        method: 'PUT',
                        url: DSP_URL + '/rest' + requestDataObj.serviceName + '/' + requestDataObj.fileName,
                        headers: {
                            'Content-Type': 'text/plain'
                        },
                        data: {
                            post_body: requestDataObj.body
                        },
                        params: requestDataObj.params
                    })
                };

                scope._deleteFileOnServer = function (requestDataObj) {

                    return $http({

                        method: 'DELETE',
                        url: DSP_URL + '/rest' + requestDataObj.serviceName + '/' + requestDataObj.fileName,
                        params: requestDataObj.params
                    })
                };

                scope._setEditorInactive = function (stateBool) {

                    if (stateBool) {

                        scope.editor.setOptions({
                            readOnly: true,
                            highlightActiveLine: false,
                            highlightGutterLine: false
                        })
                        scope.editor.renderer.$cursorLayer.element.style.opacity=0;
                    }else {
                        scope.editor.setOptions({
                            readOnly: false,
                            highlightActiveLine: true,
                            highlightGutterLine: true
                        })
                        scope.editor.renderer.$cursorLayer.element.style.opacity=100;
                    }
                };

                scope._loadEditor = function (contents, mode, inactive) {

                    inactive = inactive || false;

                    scope.editor = ace.edit('ide');

                    //scope.editor.setTheme("ace/theme/twilight");

                    if(mode){
                        scope.editor.session.setMode("ace/mode/json");
                    }else{
                        scope.editor.session.setMode("ace/mode/javascript");
                    }

                    scope._setEditorInactive(inactive);

                    scope.editor.session.setValue(contents);

                    scope.editor.focus();

                    scope.editor.on('input', function() {
                        scope.$apply(function() {
                            scope.isClean = scope.editor.session.getUndoManager().isClean();
                        });
                    });
                };

                scope._cleanEditor = function () {

                    scope.editor.session.getUndoManager().reset();
                    scope.editor.session.getUndoManager().markClean();
                };


                // WATCHERS AND INIT
                var watchScriptFileName = scope.$watch('fileName', function (newValue, oldValue) {

                    if (newValue === 'samples') return false;

                    if (!newValue) {
                        scope._loadEditor('', false, true);
                        return false;
                    }

                    var requestDataObj = {
                        serviceName: scope.serviceName,
                        fileName: newValue,
                        params: {
                            // is_user_script: scope.isUserCustom,
                            include_script_body: true
                        }
                    };

                    // Fix because GET api is busted
                    if (scope.isUserCustom) {

                        requestDataObj.params['is_user_script'] = true;
                    }


                    scope._getFileFromServer(requestDataObj).then(
                        function(result) {

                            // scope.currentScript = result.data;
                            scope.currentScriptObj = result.data;
                            scope._loadEditor(result.data.script_body, false);
                        },
                        function(reject) {

                            scope._loadEditor('', false);
                        }
                    )
                });

                var watchDirectData = scope.$watch('directData', function (newValue, oldValue) {

                    if (!newValue) {
                        scope._loadEditor('', false, true);
                        return false;
                    }

                    // Format JSON
                    newValue = angular.fromJson(newValue);
                    newValue = angular.toJson(newValue, true);

                    scope._loadEditor(newValue, true, !scope.isEditable);
                    scope.backupDoc = angular.copy(newValue);
                    scope.currentEditor = scope.editor;

                });


                // MESSAGES
                scope.$on('$destroy', function (e) {

                    watchScriptFileName();
                    watchDirectData();
                });

                scope.$on('save:script', function(e, fileName) {

                    var requestDataObj = {
                        serviceName: scope.serviceName,
                        fileName: fileName || scope.fileName,
                        body:  scope.editor.getValue() || " ",
                        params: {
                            is_user_script: scope.isUserCustom
                        }
                    };

                    scope._saveFileOnServer(requestDataObj).then(
                        function(result) {

                            scope._cleanEditor();
                            // Needs to be replaced with angular messaging
                            $(function(){
                                new PNotify({
                                    title: 'Scripts',
                                    type:  'success',
                                    text:  'Script saved successfully.'
                                });
                            });

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
                });

                scope.$on('delete:script', function (e) {

                    var requestDataObj = {
                        serviceName: scope.serviceName,
                        fileName: scope.fileName,
                        scriptId:  scope.currentScriptObj.script_id,
                        params: {
                            is_user_script: scope.isUserCustom
                        }
                    };

                    scope._deleteFileOnServer(requestDataObj).then(
                        function(result) {

                            scope.editor.setValue('', false);
                            scope._cleanEditor();

                            $(function(){
                                new PNotify({
                                    title: 'Scripts',
                                    type:  'success',
                                    text:  'Script deleted successfully.'
                                });
                            });
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
                });

                scope.$on('load:direct', function (e, dataObj) {

                    scope._loadEditor(dataObj, false);
                });

                scope.$on('reload:script', function (e, mode) {

                    scope._loadEditor(scope.backupDoc, mode);

                });

            }
        }
    }])
    .directive('fileModel', [
        '$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.on(
                        'change', function () {
                            scope.$apply(
                                function () {
                                    modelSetter(scope, element[0].files[0]);
                                }
                            );
                        }
                    );
                }
            };
        }
    ])
    .service('dfLoadingScreen', [
        function () {
            var _elem = angular.element('.loading-screen');

            var _startLoadingScreen = function () {
                _elem.addClass('active').fadeIn('fast');
            };

            var _stopLoadingScreen = function () {
                _elem.fadeOut(
                    'fast', function () {
                        _elem.removeClass('active');
                    }
                );
            };

            return {
                start: function () {
                    _startLoadingScreen();
                },

                stop: function () {
                    _stopLoadingScreen();
                }
            }
        }
    ])
    .service('dfObjectService', [
        function () {

            return {

                mergeObjects: function (obj1, obj2) {

                    for (var key in obj1) {
                        obj2[key] = obj1[key]
                    }

                    return obj2;
                },

                deepMergeObjects: function (obj1, obj2) {

                    var self = this;

                    for (var _key in obj1) {
                        if (obj2.hasOwnProperty(_key)) {

                            switch (Object.prototype.toString.call(obj2[_key])) {

                                case '[object Object]':
                                    obj2[_key] = self.deepMergeObjects(obj1[_key], obj2[_key]);
                                    break;

                                case '[object Array]':
                                    obj2[_key] = obj1[_key];
                                    //obj2[_key].concat(obj1[_key]);
                                    break;

                                default:
                                    obj2[_key] = obj1[_key];
                            }

                            /*    if(Object.prototype.toString.call(obj2[_key]) === '[object Object]') {

                             obj2[_key] = self.deepMergeObjects(obj1[_key], obj2[_key]);
                             }else {
                             obj2[_key] = obj1[_key];
                             }*/
                        }
                    }

                    return obj2;
                }
            }

        }
    ])
    .service('dfStringService', [function () {

        return {
            areIdentical: function (stringA, stringB) {

                stringA = stringA || '';
                stringB = stringB || '';

                function _sameLength(stringA, stringB) {
                    return stringA.length == stringB.length;
                }

                function _sameLetters(stringA, stringB) {

                    var l = Math.min(stringA.length, stringB.length);

                    for (var i = 0; i < l; i++) {
                        if (stringA.charAt(i) !== stringB.charAt(i)) {
                            return false;
                        }
                    }
                    return true;
                }

                if (_sameLength(stringA, stringB) && _sameLetters(stringA, stringB)) {
                    return true;
                }

                return false;
            }
        }

    }
    ])
    .service('SystemConfigDataService', ['DSP_URL', function (DSP_URL) {

        var systemConfig = {};

        function _getSystemConfigFromServerSync() {

            var xhr;

            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            } else {// code for IE6, IE5
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.open("GET", DSP_URL + '/rest/system/config', false);
            xhr.setRequestHeader("X-DreamFactory-Application-Name", "admin");
            xhr.setRequestHeader("Content-Type", "application/json");

            //if (xhr.overrideMimeType) xhr.overrideMimeType("application/json");

            xhr.send();

            if (xhr.readyState == 4 && xhr.status == 200) {
                return angular.fromJson(xhr.responseText);
            } else {
                throw {
                    module: 'DreamFactory System Config Module',
                    type: 'error',
                    provider: 'dreamfactory',
                    exception: 'XMLHTTPRequest Failure:  _getSystemConfigFromServer() Failed retrieve config.  Please contact your system administrator.'
                }
            }
        }

        function _getSystemConfig() {

            return systemConfig;
        }

        function _setSystemConfig(userDataObj) {

            systemConfig = userDataObj;
        }

        return {

            getSystemConfigFromServerSync: function () {

                return _getSystemConfigFromServerSync();
            },

            getSystemConfig: function () {

                return _getSystemConfig();
            },

            setSystemConfig: function (systemConfigDataObj) {

                _setSystemConfig(systemConfigDataObj);
            }
        }
    }
    ])
    .filter('orderAndShowSchema', [function () {

        return function (items, fields, reverse) {

            var filtered = [];

            angular.forEach(
                fields, function (field) {

                    angular.forEach(
                        items, function (item) {
                            if (item.name === field.name && field.active == true) {

                                filtered.push(item);
                            }
                        }
                    );
                }
            );

            if (reverse) {
                filtered.reverse();
            }
            return filtered;
        }
    }
    ])
    .filter('orderAndShowValue', [function () {

        return function (items, fields, reverse) {

            // Angular sometimes throws a duplicate key error.
            // I'm not sure why.  We were just pushing values onto
            // an array.  So I use a counter to increment the key
            // of our data object that we assign our filtered values
            // to.  Now they are extracted into the table in the correct
            // order.

            var filtered = [];

            // for each field
            angular.forEach(
                fields, function (field) {

                    // search the items for that field
                    for (var _key in items) {

                        // if we find it
                        if (_key === field.name && field.active == true) {

                            // push on to
                            filtered.push(items[_key]);
                        }
                    }
                }
            );

            if (reverse) {
                filtered.reverse();
            }
            return filtered;
        }
    }
    ])
    .filter('orderObjectBy', [function () {
        return function (items, field, reverse) {

            var filtered = [];

            function cmp(a, b) {
                return a == b ? 0 : a < b ? -1 : 1;
            }

            angular.forEach(
                items, function (item) {
                    filtered.push(item);
                }
            );

            if (filtered.length === 0) {
                return filtered;
            }

            switch (typeof filtered[0][field]) {

                case 'number':
                    filtered.sort(
                        function numberCmp(a, b) {
                            return cmp(Number(a[field]), Number(b[field]));
                        }
                    )
                    break;

                case 'string':

                    filtered.sort(
                        function sortfn(a, b) {
                            var upA = a[field].toUpperCase();
                            var upB = b[field].toUpperCase();
                            return (
                                upA < upB
                                ) ? -1 : (
                                upA > upB
                                ) ? 1 : 0;
                        }
                    );
                    break;

                default:
                    filtered.sort(
                        function sortfn(a, b) {
                            var upA = a[field]
                            var upB = b[field]
                            return (
                                upA < upB
                                ) ? -1 : (
                                upA > upB
                                ) ? 1 : 0;
                        }
                    );
            }

            if (reverse) {
                filtered.reverse();
            }
            return filtered;
        };
    }
    ])
    .filter('dfFilterBy', [function () {
        return function (items, options) {

            if (!options.on) {
                return items;
            }

            var filtered = [];

            // There is nothing to base a filter off of
            if (!options) {
                return items
            }
            ;

            if (!options.field) {
                return items
            }
            ;
            if (!options.value) {
                return items
            }
            ;
            if (!options.regex) {
                options.regex = new RegExp(options.value, "i");
            }

            angular.forEach(
                items, function (item) {
                    if (options.regex.test(item[options.field])) {

                        filtered.push(item)
                    }
                }
            );

            return filtered;
        }
    }
    ])
    .filter('dfOrderExplicit', [function () {

        return function (items, order) {

            var filtered = [], i = 0;

            angular.forEach(
                items, function (value, index) {

                    if (value.name === order[i]) {
                        filtered.push(value)

                    }
                    i++;
                }
            )

            return filtered;

        }
    }
    ]);

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-16
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.timepicker"]);
angular.module("ui.bootstrap.tpls", ["template/datepicker/datepicker.html", "template/datepicker/popup.html", "template/timepicker/timepicker.html"]);
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */.factory(
        '$position', [
            '$document', '$window', function ($document, $window) {

                function getStyle(el, cssprop) {
                    if (el.currentStyle) { //IE
                        return el.currentStyle[cssprop];
                    } else if ($window.getComputedStyle) {
                        return $window.getComputedStyle(el)[cssprop];
                    }
                    // finally try and get inline style
                    return el.style[cssprop];
                }

                /**
                 * Checks if a given element is statically positioned
                 * @param element - raw DOM element
                 */
                function isStaticPositioned(element) {
                    return (
                        getStyle(element, "position") || 'static'
                        ) === 'static';
                }

                /**
                 * returns the closest, non-statically positioned parentOffset of a given element
                 * @param element
                 */
                var parentOffsetEl = function (element) {
                    var docDomEl = $document[0];
                    var offsetParent = element.offsetParent || docDomEl;
                    while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                        offsetParent = offsetParent.offsetParent;
                    }
                    return offsetParent || docDomEl;
                };

                return {
                    /**
                     * Provides read-only equivalent of jQuery's position function:
                     * http://api.jquery.com/position/
                     */
                    position: function (element) {
                        var elBCR = this.offset(element);
                        var offsetParentBCR = {top: 0, left: 0};
                        var offsetParentEl = parentOffsetEl(element[0]);
                        if (offsetParentEl != $document[0]) {
                            offsetParentBCR = this.offset(angular.element(offsetParentEl));
                            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                        }

                        var boundingClientRect = element[0].getBoundingClientRect();
                        return {
                            width: boundingClientRect.width || element.prop('offsetWidth'),
                            height: boundingClientRect.height || element.prop('offsetHeight'),
                            top: elBCR.top - offsetParentBCR.top,
                            left: elBCR.left - offsetParentBCR.left
                        };
                    },

                    /**
                     * Provides read-only equivalent of jQuery's offset function:
                     * http://api.jquery.com/offset/
                     */
                    offset: function (element) {
                        var boundingClientRect = element[0].getBoundingClientRect();
                        return {
                            width: boundingClientRect.width || element.prop('offsetWidth'),
                            height: boundingClientRect.height || element.prop('offsetHeight'),
                            top: boundingClientRect.top +
                                (
                                    $window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop
                                    ),
                            left: boundingClientRect.left +
                                (
                                    $window.pageXOffset || $document[0].body.scrollLeft || $document[0].documentElement.scrollLeft
                                    )
                        };
                    }
                };
            }
        ]
    );

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.position'])

    .constant(
    'datepickerConfig',
    {
        dayFormat: 'dd',
        monthFormat: 'MMMM',
        yearFormat: 'yyyy',
        dayHeaderFormat: 'EEE',
        dayTitleFormat: 'MMMM yyyy',
        monthTitleFormat: 'yyyy',
        showWeeks: true,
        startingDay: 0,
        yearRange: 20,
        minDate: null,
        maxDate: null
    }
)

    .controller(
        'DatepickerController', [
            '$scope', '$attrs', 'dateFilter', 'datepickerConfig', function ($scope, $attrs, dateFilter, dtConfig) {
                var format = {
                    day: getValue($attrs.dayFormat, dtConfig.dayFormat),
                    month: getValue($attrs.monthFormat, dtConfig.monthFormat),
                    year: getValue($attrs.yearFormat, dtConfig.yearFormat),
                    dayHeader: getValue($attrs.dayHeaderFormat, dtConfig.dayHeaderFormat),
                    dayTitle: getValue($attrs.dayTitleFormat, dtConfig.dayTitleFormat),
                    monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
                }, startingDay = getValue($attrs.startingDay, dtConfig.startingDay), yearRange = getValue($attrs.yearRange, dtConfig.yearRange);

                this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
                this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;

                function getValue(value, defaultValue) {
                    return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
                }

                function getDaysInMonth(year, month) {
                    return new Date(year, month, 0).getDate();
                }

                function getDates(startDate, n) {
                    var dates = new Array(n);
                    var current = startDate, i = 0;
                    while (i < n) {
                        dates[i++] = new Date(current);
                        current.setDate(current.getDate() + 1);
                    }
                    return dates;
                }

                function makeDate(date, format, isSelected, isSecondary) {
                    return {date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary};
                }

                this.modes = [
                    {
                        name: 'day', getVisibleDates: function (date, selected) {
                        var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
                        var difference = startingDay - firstDayOfMonth.getDay(), numDisplayedFromPreviousMonth = (
                            difference > 0
                            )
                            ? 7 -
                            difference
                            : -difference, firstDate = new Date(firstDayOfMonth), numDates = 0;

                        if (numDisplayedFromPreviousMonth > 0) {
                            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
                            numDates += numDisplayedFromPreviousMonth; // Previous
                        }
                        numDates += getDaysInMonth(year, month + 1); // Current
                        numDates +=
                            (
                                7 - numDates % 7
                                ) % 7; // Next

                        var days = getDates(firstDate, numDates), labels = new Array(7);
                        for (var i = 0; i < numDates; i++) {
                            var dt = new Date(days[i]);
                            days[i] = makeDate(
                                dt,
                                format.day,
                                (
                                    selected &&
                                        selected.getDate() ===
                                            dt.getDate() &&
                                        selected.getMonth() ===
                                            dt.getMonth() &&
                                        selected.getFullYear() ===
                                            dt.getFullYear()
                                    ),
                                dt.getMonth() !==
                                    month
                            );
                        }
                        for (var j = 0; j < 7; j++) {
                            labels[j] = dateFilter(days[j].date, format.dayHeader);
                        }
                        return {objects: days, title: dateFilter(date, format.dayTitle), labels: labels};
                    }, compare: function (date1, date2) {
                        return (
                            new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
                            );
                    }, split: 7, step: {months: 1}
                    },
                    {
                        name: 'month', getVisibleDates: function (date, selected) {
                        var months = new Array(12), year = date.getFullYear();
                        for (var i = 0; i < 12; i++) {
                            var dt = new Date(year, i, 1);
                            months[i] =
                                makeDate(
                                    dt,
                                    format.month,
                                    (
                                        selected && selected.getMonth() === i && selected.getFullYear() === year
                                        )
                                );
                        }
                        return {objects: months, title: dateFilter(date, format.monthTitle)};
                    }, compare: function (date1, date2) {
                        return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
                    }, split: 3, step: {years: 1}
                    },
                    {
                        name: 'year', getVisibleDates: function (date, selected) {
                        var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt(
                            (
                                year - 1
                                ) / yearRange, 10
                        ) * yearRange + 1;
                        for (var i = 0; i < yearRange; i++) {
                            var dt = new Date(startYear + i, 0, 1);
                            years[i] =
                                makeDate(
                                    dt,
                                    format.year,
                                    (
                                        selected && selected.getFullYear() === dt.getFullYear()
                                        )
                                );
                        }
                        return {objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ')};
                    }, compare: function (date1, date2) {
                        return date1.getFullYear() - date2.getFullYear();
                    }, split: 5, step: {years: yearRange}
                    }
                ];

                this.isDisabled = function (date, mode) {
                    var currentMode = this.modes[mode || 0];
                    return (
                        (
                            this.minDate && currentMode.compare(date, this.minDate) < 0
                            ) ||
                            (
                                this.maxDate && currentMode.compare(date, this.maxDate) > 0
                                ) ||
                            (
                                $scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})
                                )
                        );
                };
            }
        ]
    )

    .directive(
        'datepicker', [
            'dateFilter', '$parse', 'datepickerConfig', '$log', function (dateFilter, $parse, datepickerConfig, $log) {
                return {
                    restrict: 'EA', replace: true, templateUrl: 'template/datepicker/datepicker.html', scope: {
                        dateDisabled: '&'
                    }, require: ['datepicker', '?^ngModel'], controller: 'DatepickerController', link: function (scope, element, attrs, ctrls) {
                        var datepickerCtrl = ctrls[0], ngModel = ctrls[1];

                        if (!ngModel) {
                            return; // do nothing if no ng-model
                        }

                        // Configuration parameters
                        var mode = 0, selected = new Date(), showWeeks = datepickerConfig.showWeeks;

                        if (attrs.showWeeks) {
                            scope.$parent.$watch(
                                $parse(attrs.showWeeks), function (value) {
                                    showWeeks = !!value;
                                    updateShowWeekNumbers();
                                }
                            );
                        } else {
                            updateShowWeekNumbers();
                        }

                        if (attrs.min) {
                            scope.$parent.$watch(
                                $parse(attrs.min), function (value) {
                                    datepickerCtrl.minDate = value ? new Date(value) : null;
                                    refill();
                                }
                            );
                        }
                        if (attrs.max) {
                            scope.$parent.$watch(
                                $parse(attrs.max), function (value) {
                                    datepickerCtrl.maxDate = value ? new Date(value) : null;
                                    refill();
                                }
                            );
                        }

                        function updateShowWeekNumbers() {
                            scope.showWeekNumbers = mode === 0 && showWeeks;
                        }

                        // Split array into smaller arrays
                        function split(arr, size) {
                            var arrays = [];
                            while (arr.length > 0) {
                                arrays.push(arr.splice(0, size));
                            }
                            return arrays;
                        }

                        function refill(updateSelected) {
                            var date = null, valid = true;

                            if (ngModel.$modelValue) {
                                date = new Date(ngModel.$modelValue);

                                if (isNaN(date)) {
                                    valid = false;
                                    $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                                } else if (updateSelected) {
                                    selected = date;
                                }
                            }
                            ngModel.$setValidity('date', valid);

                            var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
                            angular.forEach(
                                data.objects, function (obj) {
                                    obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
                                }
                            );

                            ngModel.$setValidity(
                                'date-disabled',
                                (
                                    !date || !datepickerCtrl.isDisabled(date)
                                    )
                            );

                            scope.rows = split(data.objects, currentMode.split);
                            scope.labels = data.labels || [];
                            scope.title = data.title;
                        }

                        function setMode(value) {
                            mode = value;
                            updateShowWeekNumbers();
                            refill();
                        }

                        ngModel.$render = function () {
                            refill(true);
                        };

                        scope.select = function (date) {
                            if (mode === 0) {
                                var dt = ngModel.$modelValue ? new Date(ngModel.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
                                dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                ngModel.$setViewValue(dt);
                                refill(true);
                            } else {
                                selected = date;
                                setMode(mode - 1);
                            }
                        };
                        scope.move = function (direction) {
                            var step = datepickerCtrl.modes[mode].step;
                            selected.setMonth(
                                selected.getMonth() +
                                    direction *
                                        (
                                            step.months || 0
                                            )
                            );
                            selected.setFullYear(
                                selected.getFullYear() +
                                    direction *
                                        (
                                            step.years || 0
                                            )
                            );
                            refill();
                        };
                        scope.toggleMode = function () {
                            setMode(
                                (
                                    mode + 1
                                    ) % datepickerCtrl.modes.length
                            );
                        };
                        scope.getWeekNumber = function (row) {
                            return (
                                mode === 0 && scope.showWeekNumbers && row.length === 7
                                ) ? getISO8601WeekNumber(row[0].date) : null;
                        };

                        function getISO8601WeekNumber(date) {
                            var checkDate = new Date(date);
                            checkDate.setDate(
                                checkDate.getDate() +
                                    4 -
                                    (
                                        checkDate.getDay() || 7
                                        )
                            ); // Thursday
                            var time = checkDate.getTime();
                            checkDate.setMonth(0); // Compare with Jan 1
                            checkDate.setDate(1);
                            return Math.floor(
                                Math.round(
                                    (
                                        time - checkDate
                                        ) / 86400000
                                ) / 7
                            ) + 1;
                        }
                    }
                };
            }
        ]
    )

    .constant(
    'datepickerPopupConfig',
    {
        dateFormat: 'yyyy-MM-dd',
        currentText: 'Today',
        toggleWeeksText: 'Weeks',
        clearText: 'Clear',
        closeText: 'Done',
        closeOnDateSelection: true,
        appendToBody: false,
        showButtonBar: true
    }
)

    .directive(
        'datepickerPopup',
        [
            '$compile',
            '$parse',
            '$document',
            '$position',
            'dateFilter',
            'datepickerPopupConfig',
            'datepickerConfig',
            function ($compile, $parse, $document, $position, dateFilter, datepickerPopupConfig, datepickerConfig) {
                return {
                    restrict: 'EA', require: 'ngModel', link: function (originalScope, element, attrs, ngModel) {
                        var scope = originalScope.$new(), // create a child scope so we are not polluting original one
                            dateFormat, closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection)
                                ? originalScope.$eval(attrs.closeOnDateSelection)
                                : datepickerPopupConfig.closeOnDateSelection, appendToBody = angular.isDefined(attrs.datepickerAppendToBody)
                                ? originalScope.$eval(attrs.datepickerAppendToBody)
                                : datepickerPopupConfig.appendToBody;

                        attrs.$observe(
                            'datepickerPopup', function (value) {
                                dateFormat = value || datepickerPopupConfig.dateFormat;
                                ngModel.$render();
                            }
                        );

                        scope.showButtonBar =
                            angular.isDefined(attrs.showButtonBar) ? originalScope.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

                        originalScope.$on(
                            '$destroy', function () {
                                $popup.remove();
                                scope.$destroy();
                            }
                        );

                        attrs.$observe(
                            'currentText', function (text) {
                                scope.currentText = angular.isDefined(text) ? text : datepickerPopupConfig.currentText;
                            }
                        );
                        attrs.$observe(
                            'toggleWeeksText', function (text) {
                                scope.toggleWeeksText = angular.isDefined(text) ? text : datepickerPopupConfig.toggleWeeksText;
                            }
                        );
                        attrs.$observe(
                            'clearText', function (text) {
                                scope.clearText = angular.isDefined(text) ? text : datepickerPopupConfig.clearText;
                            }
                        );
                        attrs.$observe(
                            'closeText', function (text) {
                                scope.closeText = angular.isDefined(text) ? text : datepickerPopupConfig.closeText;
                            }
                        );

                        var getIsOpen, setIsOpen;
                        if (attrs.isOpen) {
                            getIsOpen = $parse(attrs.isOpen);
                            setIsOpen = getIsOpen.assign;

                            originalScope.$watch(
                                getIsOpen, function updateOpen(value) {
                                    scope.isOpen = !!value;
                                }
                            );
                        }
                        scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

                        function setOpen(value) {
                            if (setIsOpen) {
                                setIsOpen(originalScope, !!value);
                            } else {
                                scope.isOpen = !!value;
                            }
                        }

                        var documentClickBind = function (event) {
                            if (scope.isOpen && event.target !== element[0]) {
                                scope.$apply(
                                    function () {
                                        setOpen(false);
                                    }
                                );
                            }
                        };

                        var elementFocusBind = function () {
                            scope.$apply(
                                function () {
                                    setOpen(true);
                                }
                            );
                        };

                        // popup element used to display calendar
                        var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
                        popupEl.attr(
                            {
                                'ng-model': 'date', 'ng-change': 'dateSelection()'
                            }
                        );
                        var datepickerEl = angular.element(popupEl.children()[0]), datepickerOptions = {};
                        if (attrs.datepickerOptions) {
                            datepickerOptions = originalScope.$eval(attrs.datepickerOptions);
                            datepickerEl.attr(angular.extend({}, datepickerOptions));
                        }

                        // TODO: reverse from dateFilter string to Date object
                        function parseDate(viewValue) {
                            if (!viewValue) {
                                ngModel.$setValidity('date', true);
                                return null;
                            } else if (angular.isDate(viewValue)) {
                                ngModel.$setValidity('date', true);
                                return viewValue;
                            } else if (angular.isString(viewValue)) {
                                var date = new Date(viewValue);
                                if (isNaN(date)) {
                                    ngModel.$setValidity('date', false);
                                    return undefined;
                                } else {
                                    ngModel.$setValidity('date', true);
                                    return date;
                                }
                            } else {
                                ngModel.$setValidity('date', false);
                                return undefined;
                            }
                        }

                        ngModel.$parsers.unshift(parseDate);

                        // Inner change
                        scope.dateSelection = function (dt) {
                            if (angular.isDefined(dt)) {
                                scope.date = dt;
                            }
                            ngModel.$setViewValue(scope.date);
                            ngModel.$render();

                            if (closeOnDateSelection) {
                                setOpen(false);
                            }
                        };

                        element.bind(
                            'input change keyup', function () {
                                scope.$apply(
                                    function () {
                                        scope.date = ngModel.$modelValue;
                                    }
                                );
                            }
                        );

                        // Outter change
                        ngModel.$render = function () {
                            var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
                            element.val(date);
                            scope.date = ngModel.$modelValue;
                        };

                        function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
                            if (attribute) {
                                originalScope.$watch(
                                    $parse(attribute), function (value) {
                                        scope[scopeProperty] = value;
                                    }
                                );
                                datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
                            }
                        }

                        addWatchableAttribute(attrs.min, 'min');
                        addWatchableAttribute(attrs.max, 'max');
                        if (attrs.showWeeks) {
                            addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
                        } else {
                            scope.showWeeks = 'show-weeks' in datepickerOptions ? datepickerOptions['show-weeks'] : datepickerConfig.showWeeks;
                            datepickerEl.attr('show-weeks', 'showWeeks');
                        }
                        if (attrs.dateDisabled) {
                            datepickerEl.attr('date-disabled', attrs.dateDisabled);
                        }

                        function updatePosition() {
                            scope.position = appendToBody ? $position.offset(element) : $position.position(element);
                            scope.position.top = scope.position.top + element.prop('offsetHeight');
                        }

                        var documentBindingInitialized = false, elementFocusInitialized = false;
                        scope.$watch(
                            'isOpen', function (value) {
                                if (value) {
                                    updatePosition();
                                    $document.bind('click', documentClickBind);
                                    if (elementFocusInitialized) {
                                        element.unbind('focus', elementFocusBind);
                                    }
                                    element[0].focus();
                                    documentBindingInitialized = true;
                                } else {
                                    if (documentBindingInitialized) {
                                        $document.unbind('click', documentClickBind);
                                    }
                                    element.bind('focus', elementFocusBind);
                                    elementFocusInitialized = true;
                                }

                                if (setIsOpen) {
                                    setIsOpen(originalScope, value);
                                }
                            }
                        );

                        scope.today = function () {
                            scope.dateSelection(new Date());
                        };
                        scope.clear = function () {
                            scope.dateSelection(null);
                        };

                        var $popup = $compile(popupEl)(scope);
                        if (appendToBody) {
                            $document.find('body').append($popup);
                        } else {
                            element.after($popup);
                        }
                    }
                };
            }
        ]
    )

    .directive(
    'datepickerPopupWrap', function () {
        return {
            restrict: 'EA', replace: true, transclude: true, templateUrl: 'template/datepicker/popup.html', link: function (scope, element, attrs) {
                element.bind(
                    'click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                );
            }
        };
    }
);

angular.module('ui.bootstrap.timepicker', [])

    .constant(
    'timepickerConfig', {
        hourStep: 1, minuteStep: 1, showMeridian: true, meridians: null, readonlyInput: false, mousewheel: true
    }
)

    .directive(
        'timepicker', [
            '$parse', '$log', 'timepickerConfig', '$locale', function ($parse, $log, timepickerConfig, $locale) {
                return {
                    restrict: 'EA',
                    require: '?^ngModel',
                    replace: true,
                    scope: {},
                    templateUrl: 'template/timepicker/timepicker.html',
                    link: function (scope, element, attrs, ngModel) {
                        if (!ngModel) {
                            return; // do nothing if no ng-model
                        }

                        var selected = new Date(), meridians = angular.isDefined(attrs.meridians)
                            ? scope.$parent.$eval(attrs.meridians)
                            : timepickerConfig.meridians ||
                            $locale.DATETIME_FORMATS.AMPMS;

                        var hourStep = timepickerConfig.hourStep;
                        if (attrs.hourStep) {
                            scope.$parent.$watch(
                                $parse(attrs.hourStep), function (value) {
                                    hourStep = parseInt(value, 10);
                                }
                            );
                        }

                        var minuteStep = timepickerConfig.minuteStep;
                        if (attrs.minuteStep) {
                            scope.$parent.$watch(
                                $parse(attrs.minuteStep), function (value) {
                                    minuteStep = parseInt(value, 10);
                                }
                            );
                        }

                        // 12H / 24H mode
                        scope.showMeridian = timepickerConfig.showMeridian;
                        if (attrs.showMeridian) {
                            scope.$parent.$watch(
                                $parse(attrs.showMeridian), function (value) {
                                    scope.showMeridian = !!value;

                                    if (ngModel.$error.time) {
                                        // Evaluate from template
                                        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
                                        if (angular.isDefined(hours) && angular.isDefined(minutes)) {
                                            selected.setHours(hours);
                                            refresh();
                                        }
                                    } else {
                                        updateTemplate();
                                    }
                                }
                            );
                        }

                        // Get scope.hours in 24H mode if valid
                        function getHoursFromTemplate() {
                            var hours = parseInt(scope.hours, 10);
                            var valid = (
                                scope.showMeridian
                                ) ? (
                                hours > 0 && hours < 13
                                ) : (
                                hours >= 0 && hours < 24
                                );
                            if (!valid) {
                                return undefined;
                            }

                            if (scope.showMeridian) {
                                if (hours === 12) {
                                    hours = 0;
                                }
                                if (scope.meridian === meridians[1]) {
                                    hours = hours + 12;
                                }
                            }
                            return hours;
                        }

                        function getMinutesFromTemplate() {
                            var minutes = parseInt(scope.minutes, 10);
                            return (
                                minutes >= 0 && minutes < 60
                                ) ? minutes : undefined;
                        }

                        function pad(value) {
                            return (
                                angular.isDefined(value) && value.toString().length < 2
                                ) ? '0' + value : value;
                        }

                        // Input elements
                        var inputs = element.find('input'), hoursInputEl = inputs.eq(0), minutesInputEl = inputs.eq(1);

                        // Respond on mousewheel spin
                        var mousewheel = (
                            angular.isDefined(attrs.mousewheel)
                            ) ? scope.$eval(attrs.mousewheel) : timepickerConfig.mousewheel;
                        if (mousewheel) {

                            var isScrollingUp = function (e) {
                                if (e.originalEvent) {
                                    e = e.originalEvent;
                                }
                                //pick correct delta variable depending on event
                                var delta = (
                                    e.wheelDelta
                                    ) ? e.wheelDelta : -e.deltaY;
                                return (
                                    e.detail || delta > 0
                                    );
                            };

                            hoursInputEl.bind(
                                'mousewheel wheel', function (e) {
                                    scope.$apply(
                                        (
                                            isScrollingUp(e)
                                            ) ? scope.incrementHours() : scope.decrementHours()
                                    );
                                    e.preventDefault();
                                }
                            );

                            minutesInputEl.bind(
                                'mousewheel wheel', function (e) {
                                    scope.$apply(
                                        (
                                            isScrollingUp(e)
                                            ) ? scope.incrementMinutes() : scope.decrementMinutes()
                                    );
                                    e.preventDefault();
                                }
                            );
                        }

                        scope.readonlyInput =
                            (
                                angular.isDefined(attrs.readonlyInput)
                                ) ? scope.$eval(attrs.readonlyInput) : timepickerConfig.readonlyInput;
                        if (!scope.readonlyInput) {

                            var invalidate = function (invalidHours, invalidMinutes) {
                                ngModel.$setViewValue(null);
                                ngModel.$setValidity('time', false);
                                if (angular.isDefined(invalidHours)) {
                                    scope.invalidHours = invalidHours;
                                }
                                if (angular.isDefined(invalidMinutes)) {
                                    scope.invalidMinutes = invalidMinutes;
                                }
                            };

                            scope.updateHours = function () {
                                var hours = getHoursFromTemplate();

                                if (angular.isDefined(hours)) {
                                    selected.setHours(hours);
                                    refresh('h');
                                } else {
                                    invalidate(true);
                                }
                            };

                            hoursInputEl.bind(
                                'blur', function (e) {
                                    if (!scope.validHours && scope.hours < 10) {
                                        scope.$apply(
                                            function () {
                                                scope.hours = pad(scope.hours);
                                            }
                                        );
                                    }
                                }
                            );

                            scope.updateMinutes = function () {
                                var minutes = getMinutesFromTemplate();

                                if (angular.isDefined(minutes)) {
                                    selected.setMinutes(minutes);
                                    refresh('m');
                                } else {
                                    invalidate(undefined, true);
                                }
                            };

                            minutesInputEl.bind(
                                'blur', function (e) {
                                    if (!scope.invalidMinutes && scope.minutes < 10) {
                                        scope.$apply(
                                            function () {
                                                scope.minutes = pad(scope.minutes);
                                            }
                                        );
                                    }
                                }
                            );
                        } else {
                            scope.updateHours = angular.noop;
                            scope.updateMinutes = angular.noop;
                        }

                        ngModel.$render = function () {
                            var date = ngModel.$modelValue ? new Date(ngModel.$modelValue) : null;

                            if (isNaN(date)) {
                                ngModel.$setValidity('time', false);
                                $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                            } else {
                                if (date) {
                                    selected = date;
                                }
                                makeValid();
                                updateTemplate();
                            }
                        };

                        // Call internally when we know that model is valid.
                        function refresh(keyboardChange) {
                            makeValid();
                            ngModel.$setViewValue(new Date(selected));
                            updateTemplate(keyboardChange);
                        }

                        function makeValid() {
                            ngModel.$setValidity('time', true);
                            scope.invalidHours = false;
                            scope.invalidMinutes = false;
                        }

                        function updateTemplate(keyboardChange) {
                            var hours = selected.getHours(), minutes = selected.getMinutes();

                            if (scope.showMeridian) {
                                hours =
                                    (
                                        hours === 0 || hours === 12
                                        ) ? 12 : hours % 12; // Convert 24 to 12 hour system
                            }
                            scope.hours = keyboardChange === 'h' ? hours : pad(hours);
                            scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
                            scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
                        }

                        function addMinutes(minutes) {
                            var dt = new Date(selected.getTime() + minutes * 60000);
                            selected.setHours(dt.getHours(), dt.getMinutes());
                            refresh();
                        }

                        scope.incrementHours = function () {
                            addMinutes(hourStep * 60);
                        };
                        scope.decrementHours = function () {
                            addMinutes(-hourStep * 60);
                        };
                        scope.incrementMinutes = function () {
                            addMinutes(minuteStep);
                        };
                        scope.decrementMinutes = function () {
                            addMinutes(-minuteStep);
                        };
                        scope.toggleMeridian = function () {
                            addMinutes(
                                12 *
                                    60 *
                                    (
                                        (
                                            selected.getHours() < 12
                                            ) ? 1 : -1
                                        )
                            );
                        };
                    }
                };
            }
        ]
    );

angular.module("template/datepicker/datepicker.html", []).run(
    [
        "$templateCache", function ($templateCache) {
        $templateCache.put(
            "template/datepicker/datepicker.html",
            "<table>\n" +
                "  <thead>\n" +
                "    <tr>\n" +
                "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" data-ng-click=\"move(-1)\"><i class=\"fa fa-chevron-left\"></i></button></th>\n" +
                "      <th colspan=\"{{rows[0].length - 2 + showWeekNumbers}}\"><button type=\"button\" class=\"btn btn-default btn-sm btn-block\" data-ng-click=\"toggleMode()\"><strong>{{title}}</strong></button></th>\n" +
                "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" data-ng-click=\"move(1)\"><i class=\"fa fa-chevron-right\"></i></button></th>\n" +
                "    </tr>\n" +
                "    <tr data-ng-show=\"labels.length > 0\" class=\"h6\">\n" +
                "      <th data-ng-show=\"showWeekNumbers\" class=\"text-center\">#</th>\n" +
                "      <th data-ng-repeat=\"label in labels\" class=\"text-center\">{{label}}</th>\n" +
                "    </tr>\n" +
                "  </thead>\n" +
                "  <tbody>\n" +
                "    <tr data-ng-repeat=\"row in rows\">\n" +
                "      <td data-ng-show=\"showWeekNumbers\" class=\"text-center\"><em>{{ getWeekNumber(row) }}</em></td>\n" +
                "      <td data-ng-repeat=\"dt in row\" class=\"text-center\">\n" +
                "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" data-ng-class=\"{'btn-info': dt.selected}\" data-ng-click=\"select(dt.date)\" data-ng-disabled=\"dt.disabled\"><span data-ng-class=\"{'text-muted': dt.secondary}\">{{dt.label}}</span></button>\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                ""
        );
    }
    ]
);

angular.module("template/datepicker/popup.html", []).run(
    [
        "$templateCache", function ($templateCache) {
        $templateCache.put(
            "template/datepicker/popup.html",
            "<ul class=\"dropdown-menu\" data-ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
                "	<li data-ng-transclude></li>\n" +
                "	<li data-ng-show=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
                "		<span class=\"btn-group\">\n" +
                "			<button type=\"button\" class=\"btn btn-sm btn-info\" data-ng-click=\"today()\">{{currentText}}</button>\n" +
                "			<button type=\"button\" class=\"btn btn-sm btn-default\" data-ng-click=\"showWeeks = ! showWeeks\" data-ng-class=\"{active: showWeeks}\">{{toggleWeeksText}}</button>\n" +
                "			<button type=\"button\" class=\"btn btn-sm btn-danger\" data-ng-click=\"clear()\">{{clearText}}</button>\n" +
                "		</span>\n" +
                "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" data-ng-click=\"isOpen = false\">{{closeText}}</button>\n" +
                "	</li>\n" +
                "</ul>\n" +
                ""
        );
    }
    ]
);

angular.module("template/timepicker/timepicker.html", []).run(
    [
        "$templateCache", function ($templateCache) {
        $templateCache.put(
            "template/timepicker/timepicker.html",
            "<table>\n" +
                "	<tbody>\n" +
                "		<tr data-ng-if=\"showSelector\" class=\"text-center\">\n" +
                "			<td><a data-ng-click=\"incrementHours()\" class=\"btn btn-link\"><span class=\"fa fa-chevron-up\"></span></a></td>\n" +
                "			<td>&nbsp;</td>\n" +
                "			<td><a data-ng-click=\"incrementMinutes()\" class=\"btn btn-link\"><span class=\"fa fa-chevron-up\"></span></a></td>\n" +
                "			<td data-ng-show=\"showMeridian\"></td>\n" +
                "		</tr>\n" +
                "		<tr>\n" +
                "			<td style=\"width:50px;\" class=\"form-group\" data-ng-class=\"{'has-error': invalidHours}\">\n" +
                "				<input type=\"text\" data-ng-disabled=\"!editable\" data-ng-model=\"hours\" data-ng-change=\"updateHours()\" class=\"form-control text-center\" data-ng-mousewheel=\"incrementHours()\" data-ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
                "			</td>\n" +
                "			<td>:</td>\n" +
                "			<td style=\"width:50px;\" class=\"form-group\" data-ng-class=\"{'has-error': invalidMinutes}\">\n" +
                "				<input type=\"text\" data-ng-disabled=\"!editable\" data-ng-model=\"minutes\" data-ng-change=\"updateMinutes()\" class=\"form-control text-center\" data-ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
                "			</td>\n" +
                "			<td data-ng-show=\"showMeridian\"><button type=\"button\" class=\"btn btn-default text-center\" data-ng-click=\"toggleMeridian()\">{{meridian}}</button></td>\n" +
                "		</tr>\n" +
                "		<tr data-ng-if=\"showSelector\"class=\"text-center\">\n" +
                "			<td ><a data-ng-click=\"decrementHours()\" class=\"btn btn-link\"><span class=\"fa fa-chevron-down\"></span></a></td>\n" +
                "			<td>&nbsp;</td>\n" +
                "			<td><a data-ng-click=\"decrementMinutes()\" class=\"btn btn-link\"><span class=\"fa fa-chevron-down\"></span></a></td>\n" +
                "			<td data-ng-show=\"showMeridian\"></td>\n" +
                "		</tr>\n" +
                "	</tbody>\n" +
                "</table>\n" +
                ""
        );
    }
    ]
);

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-16
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.timepicker"]);
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */.factory(
        '$position', [
            '$document', '$window', function ($document, $window) {

                function getStyle(el, cssprop) {
                    if (el.currentStyle) { //IE
                        return el.currentStyle[cssprop];
                    } else if ($window.getComputedStyle) {
                        return $window.getComputedStyle(el)[cssprop];
                    }
                    // finally try and get inline style
                    return el.style[cssprop];
                }

                /**
                 * Checks if a given element is statically positioned
                 * @param element - raw DOM element
                 */
                function isStaticPositioned(element) {
                    return (
                        getStyle(element, "position") || 'static'
                        ) === 'static';
                }

                /**
                 * returns the closest, non-statically positioned parentOffset of a given element
                 * @param element
                 */
                var parentOffsetEl = function (element) {
                    var docDomEl = $document[0];
                    var offsetParent = element.offsetParent || docDomEl;
                    while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                        offsetParent = offsetParent.offsetParent;
                    }
                    return offsetParent || docDomEl;
                };

                return {
                    /**
                     * Provides read-only equivalent of jQuery's position function:
                     * http://api.jquery.com/position/
                     */
                    position: function (element) {
                        var elBCR = this.offset(element);
                        var offsetParentBCR = {top: 0, left: 0};
                        var offsetParentEl = parentOffsetEl(element[0]);
                        if (offsetParentEl != $document[0]) {
                            offsetParentBCR = this.offset(angular.element(offsetParentEl));
                            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                        }

                        var boundingClientRect = element[0].getBoundingClientRect();
                        return {
                            width: boundingClientRect.width || element.prop('offsetWidth'),
                            height: boundingClientRect.height || element.prop('offsetHeight'),
                            top: elBCR.top - offsetParentBCR.top,
                            left: elBCR.left - offsetParentBCR.left
                        };
                    },

                    /**
                     * Provides read-only equivalent of jQuery's offset function:
                     * http://api.jquery.com/offset/
                     */
                    offset: function (element) {
                        var boundingClientRect = element[0].getBoundingClientRect();
                        return {
                            width: boundingClientRect.width || element.prop('offsetWidth'),
                            height: boundingClientRect.height || element.prop('offsetHeight'),
                            top: boundingClientRect.top +
                                (
                                    $window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop
                                    ),
                            left: boundingClientRect.left +
                                (
                                    $window.pageXOffset || $document[0].body.scrollLeft || $document[0].documentElement.scrollLeft
                                    )
                        };
                    }
                };
            }
        ]
    );

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.position'])

    .constant(
    'datepickerConfig',
    {
        dayFormat: 'dd',
        monthFormat: 'MMMM',
        yearFormat: 'yyyy',
        dayHeaderFormat: 'EEE',
        dayTitleFormat: 'MMMM yyyy',
        monthTitleFormat: 'yyyy',
        showWeeks: true,
        startingDay: 0,
        yearRange: 20,
        minDate: null,
        maxDate: null
    }
)

    .controller(
        'DatepickerController', [
            '$scope', '$attrs', 'dateFilter', 'datepickerConfig', function ($scope, $attrs, dateFilter, dtConfig) {
                var format = {
                    day: getValue($attrs.dayFormat, dtConfig.dayFormat),
                    month: getValue($attrs.monthFormat, dtConfig.monthFormat),
                    year: getValue($attrs.yearFormat, dtConfig.yearFormat),
                    dayHeader: getValue($attrs.dayHeaderFormat, dtConfig.dayHeaderFormat),
                    dayTitle: getValue($attrs.dayTitleFormat, dtConfig.dayTitleFormat),
                    monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
                }, startingDay = getValue($attrs.startingDay, dtConfig.startingDay), yearRange = getValue($attrs.yearRange, dtConfig.yearRange);

                this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
                this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;

                function getValue(value, defaultValue) {
                    return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
                }

                function getDaysInMonth(year, month) {
                    return new Date(year, month, 0).getDate();
                }

                function getDates(startDate, n) {
                    var dates = new Array(n);
                    var current = startDate, i = 0;
                    while (i < n) {
                        dates[i++] = new Date(current);
                        current.setDate(current.getDate() + 1);
                    }
                    return dates;
                }

                function makeDate(date, format, isSelected, isSecondary) {
                    return {date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary};
                }

                this.modes = [
                    {
                        name: 'day', getVisibleDates: function (date, selected) {
                        var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
                        var difference = startingDay - firstDayOfMonth.getDay(), numDisplayedFromPreviousMonth = (
                            difference > 0
                            )
                            ? 7 -
                            difference
                            : -difference, firstDate = new Date(firstDayOfMonth), numDates = 0;

                        if (numDisplayedFromPreviousMonth > 0) {
                            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
                            numDates += numDisplayedFromPreviousMonth; // Previous
                        }
                        numDates += getDaysInMonth(year, month + 1); // Current
                        numDates +=
                            (
                                7 - numDates % 7
                                ) % 7; // Next

                        var days = getDates(firstDate, numDates), labels = new Array(7);
                        for (var i = 0; i < numDates; i++) {
                            var dt = new Date(days[i]);
                            days[i] = makeDate(
                                dt,
                                format.day,
                                (
                                    selected &&
                                        selected.getDate() ===
                                            dt.getDate() &&
                                        selected.getMonth() ===
                                            dt.getMonth() &&
                                        selected.getFullYear() ===
                                            dt.getFullYear()
                                    ),
                                dt.getMonth() !==
                                    month
                            );
                        }
                        for (var j = 0; j < 7; j++) {
                            labels[j] = dateFilter(days[j].date, format.dayHeader);
                        }
                        return {objects: days, title: dateFilter(date, format.dayTitle), labels: labels};
                    }, compare: function (date1, date2) {
                        return (
                            new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
                            );
                    }, split: 7, step: {months: 1}
                    },
                    {
                        name: 'month', getVisibleDates: function (date, selected) {
                        var months = new Array(12), year = date.getFullYear();
                        for (var i = 0; i < 12; i++) {
                            var dt = new Date(year, i, 1);
                            months[i] =
                                makeDate(
                                    dt,
                                    format.month,
                                    (
                                        selected && selected.getMonth() === i && selected.getFullYear() === year
                                        )
                                );
                        }
                        return {objects: months, title: dateFilter(date, format.monthTitle)};
                    }, compare: function (date1, date2) {
                        return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
                    }, split: 3, step: {years: 1}
                    },
                    {
                        name: 'year', getVisibleDates: function (date, selected) {
                        var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt(
                            (
                                year - 1
                                ) / yearRange, 10
                        ) * yearRange + 1;
                        for (var i = 0; i < yearRange; i++) {
                            var dt = new Date(startYear + i, 0, 1);
                            years[i] =
                                makeDate(
                                    dt,
                                    format.year,
                                    (
                                        selected && selected.getFullYear() === dt.getFullYear()
                                        )
                                );
                        }
                        return {objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ')};
                    }, compare: function (date1, date2) {
                        return date1.getFullYear() - date2.getFullYear();
                    }, split: 5, step: {years: yearRange}
                    }
                ];

                this.isDisabled = function (date, mode) {
                    var currentMode = this.modes[mode || 0];
                    return (
                        (
                            this.minDate && currentMode.compare(date, this.minDate) < 0
                            ) ||
                            (
                                this.maxDate && currentMode.compare(date, this.maxDate) > 0
                                ) ||
                            (
                                $scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})
                                )
                        );
                };
            }
        ]
    )

    .directive(
        'datepicker', [
            'dateFilter', '$parse', 'datepickerConfig', '$log', function (dateFilter, $parse, datepickerConfig, $log) {
                return {
                    restrict: 'EA', replace: true, templateUrl: 'template/datepicker/datepicker.html', scope: {
                        dateDisabled: '&'
                    }, require: ['datepicker', '?^ngModel'], controller: 'DatepickerController', link: function (scope, element, attrs, ctrls) {
                        var datepickerCtrl = ctrls[0], ngModel = ctrls[1];

                        if (!ngModel) {
                            return; // do nothing if no ng-model
                        }

                        // Configuration parameters
                        var mode = 0, selected = new Date(), showWeeks = datepickerConfig.showWeeks;

                        if (attrs.showWeeks) {
                            scope.$parent.$watch(
                                $parse(attrs.showWeeks), function (value) {
                                    showWeeks = !!value;
                                    updateShowWeekNumbers();
                                }
                            );
                        } else {
                            updateShowWeekNumbers();
                        }

                        if (attrs.min) {
                            scope.$parent.$watch(
                                $parse(attrs.min), function (value) {
                                    datepickerCtrl.minDate = value ? new Date(value) : null;
                                    refill();
                                }
                            );
                        }
                        if (attrs.max) {
                            scope.$parent.$watch(
                                $parse(attrs.max), function (value) {
                                    datepickerCtrl.maxDate = value ? new Date(value) : null;
                                    refill();
                                }
                            );
                        }

                        function updateShowWeekNumbers() {
                            scope.showWeekNumbers = mode === 0 && showWeeks;
                        }

                        // Split array into smaller arrays
                        function split(arr, size) {
                            var arrays = [];
                            while (arr.length > 0) {
                                arrays.push(arr.splice(0, size));
                            }
                            return arrays;
                        }

                        function refill(updateSelected) {
                            var date = null, valid = true;

                            if (ngModel.$modelValue) {
                                date = new Date(ngModel.$modelValue);

                                if (isNaN(date)) {
                                    valid = false;
                                    $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                                } else if (updateSelected) {
                                    selected = date;
                                }
                            }
                            ngModel.$setValidity('date', valid);

                            var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
                            angular.forEach(
                                data.objects, function (obj) {
                                    obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
                                }
                            );

                            ngModel.$setValidity(
                                'date-disabled',
                                (
                                    !date || !datepickerCtrl.isDisabled(date)
                                    )
                            );

                            scope.rows = split(data.objects, currentMode.split);
                            scope.labels = data.labels || [];
                            scope.title = data.title;
                        }

                        function setMode(value) {
                            mode = value;
                            updateShowWeekNumbers();
                            refill();
                        }

                        ngModel.$render = function () {
                            refill(true);
                        };

                        scope.select = function (date) {
                            if (mode === 0) {
                                var dt = ngModel.$modelValue ? new Date(ngModel.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
                                dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                ngModel.$setViewValue(dt);
                                refill(true);
                            } else {
                                selected = date;
                                setMode(mode - 1);
                            }
                        };
                        scope.move = function (direction) {
                            var step = datepickerCtrl.modes[mode].step;
                            selected.setMonth(
                                selected.getMonth() +
                                    direction *
                                        (
                                            step.months || 0
                                            )
                            );
                            selected.setFullYear(
                                selected.getFullYear() +
                                    direction *
                                        (
                                            step.years || 0
                                            )
                            );
                            refill();
                        };
                        scope.toggleMode = function () {
                            setMode(
                                (
                                    mode + 1
                                    ) % datepickerCtrl.modes.length
                            );
                        };
                        scope.getWeekNumber = function (row) {
                            return (
                                mode === 0 && scope.showWeekNumbers && row.length === 7
                                ) ? getISO8601WeekNumber(row[0].date) : null;
                        };

                        function getISO8601WeekNumber(date) {
                            var checkDate = new Date(date);
                            checkDate.setDate(
                                checkDate.getDate() +
                                    4 -
                                    (
                                        checkDate.getDay() || 7
                                        )
                            ); // Thursday
                            var time = checkDate.getTime();
                            checkDate.setMonth(0); // Compare with Jan 1
                            checkDate.setDate(1);
                            return Math.floor(
                                Math.round(
                                    (
                                        time - checkDate
                                        ) / 86400000
                                ) / 7
                            ) + 1;
                        }
                    }
                };
            }
        ]
    )

    .constant(
    'datepickerPopupConfig',
    {
        dateFormat: 'yyyy-MM-dd',
        currentText: 'Today',
        toggleWeeksText: 'Weeks',
        clearText: 'Clear',
        closeText: 'Done',
        closeOnDateSelection: true,
        appendToBody: false,
        showButtonBar: true
    }
)

    .directive(
        'datepickerPopup',
        [
            '$compile',
            '$parse',
            '$document',
            '$position',
            'dateFilter',
            'datepickerPopupConfig',
            'datepickerConfig',
            function ($compile, $parse, $document, $position, dateFilter, datepickerPopupConfig, datepickerConfig) {
                return {
                    restrict: 'EA', require: 'ngModel', link: function (originalScope, element, attrs, ngModel) {
                        var scope = originalScope.$new(), // create a child scope so we are not polluting original one
                            dateFormat, closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection)
                                ? originalScope.$eval(attrs.closeOnDateSelection)
                                : datepickerPopupConfig.closeOnDateSelection, appendToBody = angular.isDefined(attrs.datepickerAppendToBody)
                                ? originalScope.$eval(attrs.datepickerAppendToBody)
                                : datepickerPopupConfig.appendToBody;

                        attrs.$observe(
                            'datepickerPopup', function (value) {
                                dateFormat = value || datepickerPopupConfig.dateFormat;
                                ngModel.$render();
                            }
                        );

                        scope.showButtonBar =
                            angular.isDefined(attrs.showButtonBar) ? originalScope.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

                        originalScope.$on(
                            '$destroy', function () {
                                $popup.remove();
                                scope.$destroy();
                            }
                        );

                        attrs.$observe(
                            'currentText', function (text) {
                                scope.currentText = angular.isDefined(text) ? text : datepickerPopupConfig.currentText;
                            }
                        );
                        attrs.$observe(
                            'toggleWeeksText', function (text) {
                                scope.toggleWeeksText = angular.isDefined(text) ? text : datepickerPopupConfig.toggleWeeksText;
                            }
                        );
                        attrs.$observe(
                            'clearText', function (text) {
                                scope.clearText = angular.isDefined(text) ? text : datepickerPopupConfig.clearText;
                            }
                        );
                        attrs.$observe(
                            'closeText', function (text) {
                                scope.closeText = angular.isDefined(text) ? text : datepickerPopupConfig.closeText;
                            }
                        );

                        var getIsOpen, setIsOpen;
                        if (attrs.isOpen) {
                            getIsOpen = $parse(attrs.isOpen);
                            setIsOpen = getIsOpen.assign;

                            originalScope.$watch(
                                getIsOpen, function updateOpen(value) {
                                    scope.isOpen = !!value;
                                }
                            );
                        }
                        scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

                        function setOpen(value) {
                            if (setIsOpen) {
                                setIsOpen(originalScope, !!value);
                            } else {
                                scope.isOpen = !!value;
                            }
                        }

                        var documentClickBind = function (event) {
                            if (scope.isOpen && event.target !== element[0]) {
                                scope.$apply(
                                    function () {
                                        setOpen(false);
                                    }
                                );
                            }
                        };

                        var elementFocusBind = function () {
                            scope.$apply(
                                function () {
                                    setOpen(true);
                                }
                            );
                        };

                        // popup element used to display calendar
                        var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
                        popupEl.attr(
                            {
                                'ng-model': 'date', 'ng-change': 'dateSelection()'
                            }
                        );
                        var datepickerEl = angular.element(popupEl.children()[0]), datepickerOptions = {};
                        if (attrs.datepickerOptions) {
                            datepickerOptions = originalScope.$eval(attrs.datepickerOptions);
                            datepickerEl.attr(angular.extend({}, datepickerOptions));
                        }

                        // TODO: reverse from dateFilter string to Date object
                        function parseDate(viewValue) {
                            if (!viewValue) {
                                ngModel.$setValidity('date', true);
                                return null;
                            } else if (angular.isDate(viewValue)) {
                                ngModel.$setValidity('date', true);
                                return viewValue;
                            } else if (angular.isString(viewValue)) {
                                var date = new Date(viewValue);
                                if (isNaN(date)) {
                                    ngModel.$setValidity('date', false);
                                    return undefined;
                                } else {
                                    ngModel.$setValidity('date', true);
                                    return date;
                                }
                            } else {
                                ngModel.$setValidity('date', false);
                                return undefined;
                            }
                        }

                        ngModel.$parsers.unshift(parseDate);

                        // Inner change
                        scope.dateSelection = function (dt) {
                            if (angular.isDefined(dt)) {
                                scope.date = dt;
                            }
                            ngModel.$setViewValue(scope.date);
                            ngModel.$render();

                            if (closeOnDateSelection) {
                                setOpen(false);
                            }
                        };

                        element.bind(
                            'input change keyup', function () {
                                scope.$apply(
                                    function () {
                                        scope.date = ngModel.$modelValue;
                                    }
                                );
                            }
                        );

                        // Outter change
                        ngModel.$render = function () {
                            var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
                            element.val(date);
                            scope.date = ngModel.$modelValue;
                        };

                        function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
                            if (attribute) {
                                originalScope.$watch(
                                    $parse(attribute), function (value) {
                                        scope[scopeProperty] = value;
                                    }
                                );
                                datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
                            }
                        }

                        addWatchableAttribute(attrs.min, 'min');
                        addWatchableAttribute(attrs.max, 'max');
                        if (attrs.showWeeks) {
                            addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
                        } else {
                            scope.showWeeks = 'show-weeks' in datepickerOptions ? datepickerOptions['show-weeks'] : datepickerConfig.showWeeks;
                            datepickerEl.attr('show-weeks', 'showWeeks');
                        }
                        if (attrs.dateDisabled) {
                            datepickerEl.attr('date-disabled', attrs.dateDisabled);
                        }

                        function updatePosition() {
                            scope.position = appendToBody ? $position.offset(element) : $position.position(element);
                            scope.position.top = scope.position.top + element.prop('offsetHeight');
                        }

                        var documentBindingInitialized = false, elementFocusInitialized = false;
                        scope.$watch(
                            'isOpen', function (value) {
                                if (value) {
                                    updatePosition();
                                    $document.bind('click', documentClickBind);
                                    if (elementFocusInitialized) {
                                        element.unbind('focus', elementFocusBind);
                                    }
                                    element[0].focus();
                                    documentBindingInitialized = true;
                                } else {
                                    if (documentBindingInitialized) {
                                        $document.unbind('click', documentClickBind);
                                    }
                                    element.bind('focus', elementFocusBind);
                                    elementFocusInitialized = true;
                                }

                                if (setIsOpen) {
                                    setIsOpen(originalScope, value);
                                }
                            }
                        );

                        scope.today = function () {
                            scope.dateSelection(new Date());
                        };
                        scope.clear = function () {
                            scope.dateSelection(null);
                        };

                        var $popup = $compile(popupEl)(scope);
                        if (appendToBody) {
                            $document.find('body').append($popup);
                        } else {
                            element.after($popup);
                        }
                    }
                };
            }
        ]
    )

    .directive(
    'datepickerPopupWrap', function () {
        return {
            restrict: 'EA', replace: true, transclude: true, templateUrl: 'template/datepicker/popup.html', link: function (scope, element, attrs) {
                element.bind(
                    'click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                );
            }
        };
    }
);

angular.module('ui.bootstrap.timepicker', [])

    .constant(
    'timepickerConfig', {
        hourStep: 1, minuteStep: 1, showMeridian: true, meridians: null, readonlyInput: false, mousewheel: true
    }
)

    .directive(
        'timepicker', [
            '$parse', '$log', 'timepickerConfig', '$locale', function ($parse, $log, timepickerConfig, $locale) {
                return {
                    restrict: 'EA',
                    require: '?^ngModel',
                    replace: true,
                    scope: {},
                    templateUrl: 'template/timepicker/timepicker.html',
                    link: function (scope, element, attrs, ngModel) {
                        if (!ngModel) {
                            return; // do nothing if no ng-model
                        }

                        var selected = new Date(), meridians = angular.isDefined(attrs.meridians)
                            ? scope.$parent.$eval(attrs.meridians)
                            : timepickerConfig.meridians ||
                            $locale.DATETIME_FORMATS.AMPMS;

                        var hourStep = timepickerConfig.hourStep;
                        if (attrs.hourStep) {
                            scope.$parent.$watch(
                                $parse(attrs.hourStep), function (value) {
                                    hourStep = parseInt(value, 10);
                                }
                            );
                        }

                        var minuteStep = timepickerConfig.minuteStep;
                        if (attrs.minuteStep) {
                            scope.$parent.$watch(
                                $parse(attrs.minuteStep), function (value) {
                                    minuteStep = parseInt(value, 10);
                                }
                            );
                        }

                        // 12H / 24H mode
                        scope.showMeridian = timepickerConfig.showMeridian;
                        if (attrs.showMeridian) {
                            scope.$parent.$watch(
                                $parse(attrs.showMeridian), function (value) {
                                    scope.showMeridian = !!value;

                                    if (ngModel.$error.time) {
                                        // Evaluate from template
                                        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
                                        if (angular.isDefined(hours) && angular.isDefined(minutes)) {
                                            selected.setHours(hours);
                                            refresh();
                                        }
                                    } else {
                                        updateTemplate();
                                    }
                                }
                            );
                        }

                        // Get scope.hours in 24H mode if valid
                        function getHoursFromTemplate() {
                            var hours = parseInt(scope.hours, 10);
                            var valid = (
                                scope.showMeridian
                                ) ? (
                                hours > 0 && hours < 13
                                ) : (
                                hours >= 0 && hours < 24
                                );
                            if (!valid) {
                                return undefined;
                            }

                            if (scope.showMeridian) {
                                if (hours === 12) {
                                    hours = 0;
                                }
                                if (scope.meridian === meridians[1]) {
                                    hours = hours + 12;
                                }
                            }
                            return hours;
                        }

                        function getMinutesFromTemplate() {
                            var minutes = parseInt(scope.minutes, 10);
                            return (
                                minutes >= 0 && minutes < 60
                                ) ? minutes : undefined;
                        }

                        function pad(value) {
                            return (
                                angular.isDefined(value) && value.toString().length < 2
                                ) ? '0' + value : value;
                        }

                        // Input elements
                        var inputs = element.find('input'), hoursInputEl = inputs.eq(0), minutesInputEl = inputs.eq(1);

                        // Respond on mousewheel spin
                        var mousewheel = (
                            angular.isDefined(attrs.mousewheel)
                            ) ? scope.$eval(attrs.mousewheel) : timepickerConfig.mousewheel;
                        if (mousewheel) {

                            var isScrollingUp = function (e) {
                                if (e.originalEvent) {
                                    e = e.originalEvent;
                                }
                                //pick correct delta variable depending on event
                                var delta = (
                                    e.wheelDelta
                                    ) ? e.wheelDelta : -e.deltaY;
                                return (
                                    e.detail || delta > 0
                                    );
                            };

                            hoursInputEl.bind(
                                'mousewheel wheel', function (e) {
                                    scope.$apply(
                                        (
                                            isScrollingUp(e)
                                            ) ? scope.incrementHours() : scope.decrementHours()
                                    );
                                    e.preventDefault();
                                }
                            );

                            minutesInputEl.bind(
                                'mousewheel wheel', function (e) {
                                    scope.$apply(
                                        (
                                            isScrollingUp(e)
                                            ) ? scope.incrementMinutes() : scope.decrementMinutes()
                                    );
                                    e.preventDefault();
                                }
                            );
                        }

                        scope.readonlyInput =
                            (
                                angular.isDefined(attrs.readonlyInput)
                                ) ? scope.$eval(attrs.readonlyInput) : timepickerConfig.readonlyInput;
                        if (!scope.readonlyInput) {

                            var invalidate = function (invalidHours, invalidMinutes) {
                                ngModel.$setViewValue(null);
                                ngModel.$setValidity('time', false);
                                if (angular.isDefined(invalidHours)) {
                                    scope.invalidHours = invalidHours;
                                }
                                if (angular.isDefined(invalidMinutes)) {
                                    scope.invalidMinutes = invalidMinutes;
                                }
                            };

                            scope.updateHours = function () {
                                var hours = getHoursFromTemplate();

                                if (angular.isDefined(hours)) {
                                    selected.setHours(hours);
                                    refresh('h');
                                } else {
                                    invalidate(true);
                                }
                            };

                            hoursInputEl.bind(
                                'blur', function (e) {
                                    if (!scope.validHours && scope.hours < 10) {
                                        scope.$apply(
                                            function () {
                                                scope.hours = pad(scope.hours);
                                            }
                                        );
                                    }
                                }
                            );

                            scope.updateMinutes = function () {
                                var minutes = getMinutesFromTemplate();

                                if (angular.isDefined(minutes)) {
                                    selected.setMinutes(minutes);
                                    refresh('m');
                                } else {
                                    invalidate(undefined, true);
                                }
                            };

                            minutesInputEl.bind(
                                'blur', function (e) {
                                    if (!scope.invalidMinutes && scope.minutes < 10) {
                                        scope.$apply(
                                            function () {
                                                scope.minutes = pad(scope.minutes);
                                            }
                                        );
                                    }
                                }
                            );
                        } else {
                            scope.updateHours = angular.noop;
                            scope.updateMinutes = angular.noop;
                        }

                        ngModel.$render = function () {
                            var date = ngModel.$modelValue ? new Date(ngModel.$modelValue) : null;

                            if (isNaN(date)) {
                                ngModel.$setValidity('time', false);
                                $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                            } else {
                                if (date) {
                                    selected = date;
                                }
                                makeValid();
                                updateTemplate();
                            }
                        };

                        // Call internally when we know that model is valid.
                        function refresh(keyboardChange) {
                            makeValid();
                            ngModel.$setViewValue(new Date(selected));
                            updateTemplate(keyboardChange);
                        }

                        function makeValid() {
                            ngModel.$setValidity('time', true);
                            scope.invalidHours = false;
                            scope.invalidMinutes = false;
                        }

                        function updateTemplate(keyboardChange) {
                            var hours = selected.getHours(), minutes = selected.getMinutes();

                            if (scope.showMeridian) {
                                hours =
                                    (
                                        hours === 0 || hours === 12
                                        ) ? 12 : hours % 12; // Convert 24 to 12 hour system
                            }
                            scope.hours = keyboardChange === 'h' ? hours : pad(hours);
                            scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
                            scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
                        }

                        function addMinutes(minutes) {
                            var dt = new Date(selected.getTime() + minutes * 60000);
                            selected.setHours(dt.getHours(), dt.getMinutes());
                            refresh();
                        }

                        scope.incrementHours = function () {
                            addMinutes(hourStep * 60);
                        };
                        scope.decrementHours = function () {
                            addMinutes(-hourStep * 60);
                        };
                        scope.incrementMinutes = function () {
                            addMinutes(minuteStep);
                        };
                        scope.decrementMinutes = function () {
                            addMinutes(-minuteStep);
                        };
                        scope.toggleMeridian = function () {
                            addMinutes(
                                12 *
                                    60 *
                                    (
                                        (
                                            selected.getHours() < 12
                                            ) ? 1 : -1
                                        )
                            );
                        };
                    }
                };
            }
        ]
    );

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-15
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.transition", "ui.bootstrap.collapse", "ui.bootstrap.accordion"]);
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */.factory(
        '$transition', [
            '$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

                var $transition = function (element, trigger, options) {
                    options = options || {};
                    var deferred = $q.defer();
                    var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];

                    var transitionEndHandler = function (event) {
                        $rootScope.$apply(
                            function () {
                                element.unbind(endEventName, transitionEndHandler);
                                deferred.resolve(element);
                            }
                        );
                    };

                    if (endEventName) {
                        element.bind(endEventName, transitionEndHandler);
                    }

                    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
                    $timeout(
                        function () {
                            if (angular.isString(trigger)) {
                                element.addClass(trigger);
                            } else if (angular.isFunction(trigger)) {
                                trigger(element);
                            } else if (angular.isObject(trigger)) {
                                element.css(trigger);
                            }
                            //If browser does not support transitions, instantly resolve
                            if (!endEventName) {
                                deferred.resolve(element);
                            }
                        }
                    );

                    // Add our custom cancel function to the promise that is returned
                    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
                    // i.e. it will therefore never raise a transitionEnd event for that transition
                    deferred.promise.cancel = function () {
                        if (endEventName) {
                            element.unbind(endEventName, transitionEndHandler);
                        }
                        deferred.reject('Transition cancelled');
                    };

                    return deferred.promise;
                };

                // Work out the name of the transitionEnd event
                var transElement = document.createElement('trans');
                var transitionEndEventNames = {
                    'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'transition': 'transitionend'
                };
                var animationEndEventNames = {
                    'WebkitTransition': 'webkitAnimationEnd', 'MozTransition': 'animationend', 'OTransition': 'oAnimationEnd', 'transition': 'animationend'
                };

                function findEndEventName(endEventNames) {
                    for (var name in endEventNames) {
                        if (transElement.style[name] !== undefined) {
                            return endEventNames[name];
                        }
                    }
                }

                $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
                $transition.animationEndEventName = findEndEventName(animationEndEventNames);
                return $transition;
            }
        ]
    );

angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

    .directive(
        'collapse', [
            '$transition', function ($transition, $timeout) {

                return {
                    link: function (scope, element, attrs) {

                        var initialAnimSkip = true;
                        var currentTransition;

                        function doTransition(change) {
                            var newTransition = $transition(element, change);
                            if (currentTransition) {
                                currentTransition.cancel();
                            }
                            currentTransition = newTransition;
                            newTransition.then(newTransitionDone, newTransitionDone);
                            return newTransition;

                            function newTransitionDone() {
                                // Make sure it's this transition, otherwise, leave it alone.
                                if (currentTransition === newTransition) {
                                    currentTransition = undefined;
                                }
                            }
                        }

                        function expand() {
                            if (initialAnimSkip) {
                                initialAnimSkip = false;
                                expandDone();
                            } else {
                                element.removeClass('collapse').addClass('collapsing');
                                doTransition({height: element[0].scrollHeight + 'px'}).then(expandDone);
                            }
                        }

                        function expandDone() {
                            element.removeClass('collapsing');
                            element.addClass('collapse in');
                            element.css({height: 'auto'});
                        }

                        function collapse() {
                            if (initialAnimSkip) {
                                initialAnimSkip = false;
                                collapseDone();
                                element.css({height: 0});
                            } else {
                                // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
                                element.css({height: element[0].scrollHeight + 'px'});
                                //trigger reflow so a browser realizes that height was updated from auto to a specific value
                                var x = element[0].offsetWidth;

                                element.removeClass('collapse in').addClass('collapsing');

                                doTransition({height: 0}).then(collapseDone);
                            }
                        }

                        function collapseDone() {
                            element.removeClass('collapsing');
                            element.addClass('collapse');
                        }

                        scope.$watch(
                            attrs.collapse, function (shouldCollapse) {
                                if (shouldCollapse) {
                                    collapse();
                                } else {
                                    expand();
                                }
                            }
                        );
                    }
                };
            }
        ]
    );

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

    .constant(
    'accordionConfig', {
        closeOthers: true
    }
)

    .controller(
        'AccordionController', [
            '$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

                // This array keeps track of the accordion groups
                this.groups = [];

                // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
                this.closeOthers = function (openGroup) {
                    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
                    if (closeOthers) {
                        angular.forEach(
                            this.groups, function (group) {
                                if (group !== openGroup) {
                                    group.isOpen = false;
                                }
                            }
                        );
                    }
                };

                // This is called from the accordion-group directive to add itself to the accordion
                this.addGroup = function (groupScope) {
                    var that = this;
                    this.groups.push(groupScope);

                    groupScope.$on(
                        '$destroy', function (event) {
                            that.removeGroup(groupScope);
                        }
                    );
                };

                // This is called from the accordion-group directive when to remove itself
                this.removeGroup = function (group) {
                    var index = this.groups.indexOf(group);
                    if (index !== -1) {
                        this.groups.splice(this.groups.indexOf(group), 1);
                    }
                };

            }
        ]
    )

    // The accordion directive simply sets up the directive controller
    // and adds an accordion CSS class to itself element.
    .directive(
    'accordion', function () {
        return {
            restrict: 'EA', controller: 'AccordionController', transclude: true, replace: false, templateUrl: 'template/accordion/accordion.html'
        };
    }
)

    // The accordion-group directive indicates a block of html that will expand and collapse in an accordion
    .directive(
        'accordionGroup', [
            '$parse', function ($parse) {
                return {
                    require: '^accordion',         // We need this directive to be inside an accordion
                    restrict: 'EA', transclude: true,              // It transcludes the contents of the directive into the template
                    replace: true,                // The element containing the directive will be replaced with the template
                    templateUrl: 'template/accordion/accordion-group.html', scope: {heading: '@'},        // Create an isolated scope and interpolate the heading attribute onto this scope
                    controller: function () {
                        this.setHeading = function (element) {
                            this.heading = element;
                        };
                    }, link: function (scope, element, attrs, accordionCtrl) {
                        var getIsOpen, setIsOpen;

                        accordionCtrl.addGroup(scope);

                        scope.isOpen = false;

                        if (attrs.isOpen) {
                            getIsOpen = $parse(attrs.isOpen);
                            setIsOpen = getIsOpen.assign;

                            scope.$parent.$watch(
                                getIsOpen, function (value) {
                                    scope.isOpen = !!value;
                                }
                            );
                        }

                        scope.$watch(
                            'isOpen', function (value) {
                                if (value) {
                                    accordionCtrl.closeOthers(scope);
                                }
                                if (setIsOpen) {
                                    setIsOpen(scope.$parent, value);
                                }
                            }
                        );
                    }
                };
            }
        ]
    )

    // Use accordion-heading below an accordion-group to provide a heading containing HTML
    // <accordion-group>
    //   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
    // </accordion-group>
    .directive(
    'accordionHeading', function () {
        return {
            restrict: 'EA', transclude: true,   // Grab the contents to be used as the heading
            template: '',       // In effect remove this element!
            replace: true, require: '^accordionGroup', compile: function (element, attr, transclude) {
                return function link(scope, element, attr, accordionGroupCtrl) {
                    // Pass the heading to the accordion-group controller
                    // so that it can be transcluded into the right place in the template
                    // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
                    accordionGroupCtrl.setHeading(
                        transclude(
                            scope, function () {
                            }
                        )
                    );
                };
            }
        };
    }
)

    // Use in the accordion-group template to indicate where you want the heading to be transcluded
    // You must provide the property on the accordion-group controller that will hold the transcluded element
    // <div class="accordion-group">
    //   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
    //   ...
    // </div>
    .directive(
    'accordionTransclude', function () {
        return {
            require: '^accordionGroup', link: function (scope, element, attr, controller) {
                scope.$watch(
                    function () {
                        return controller[attr.accordionTransclude];
                    }, function (heading) {
                        if (heading) {
                            element.html('');
                            element.append(heading);
                        }
                    }
                );
            }
        };
    }
);
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-15
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition", "ui.bootstrap.collapse", "ui.bootstrap.accordion"]);
angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html", "template/accordion/accordion.html"]);
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */.factory(
        '$transition', [
            '$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

                var $transition = function (element, trigger, options) {
                    options = options || {};
                    var deferred = $q.defer();
                    var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];

                    var transitionEndHandler = function (event) {
                        $rootScope.$apply(
                            function () {
                                element.unbind(endEventName, transitionEndHandler);
                                deferred.resolve(element);
                            }
                        );
                    };

                    if (endEventName) {
                        element.bind(endEventName, transitionEndHandler);
                    }

                    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
                    $timeout(
                        function () {
                            if (angular.isString(trigger)) {
                                element.addClass(trigger);
                            } else if (angular.isFunction(trigger)) {
                                trigger(element);
                            } else if (angular.isObject(trigger)) {
                                element.css(trigger);
                            }
                            //If browser does not support transitions, instantly resolve
                            if (!endEventName) {
                                deferred.resolve(element);
                            }
                        }
                    );

                    // Add our custom cancel function to the promise that is returned
                    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
                    // i.e. it will therefore never raise a transitionEnd event for that transition
                    deferred.promise.cancel = function () {
                        if (endEventName) {
                            element.unbind(endEventName, transitionEndHandler);
                        }
                        deferred.reject('Transition cancelled');
                    };

                    return deferred.promise;
                };

                // Work out the name of the transitionEnd event
                var transElement = document.createElement('trans');
                var transitionEndEventNames = {
                    'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'transition': 'transitionend'
                };
                var animationEndEventNames = {
                    'WebkitTransition': 'webkitAnimationEnd', 'MozTransition': 'animationend', 'OTransition': 'oAnimationEnd', 'transition': 'animationend'
                };

                function findEndEventName(endEventNames) {
                    for (var name in endEventNames) {
                        if (transElement.style[name] !== undefined) {
                            return endEventNames[name];
                        }
                    }
                }

                $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
                $transition.animationEndEventName = findEndEventName(animationEndEventNames);
                return $transition;
            }
        ]
    );

angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

    .directive(
        'collapse', [
            '$transition', function ($transition, $timeout) {

                return {
                    link: function (scope, element, attrs) {

                        var initialAnimSkip = true;
                        var currentTransition;

                        function doTransition(change) {
                            var newTransition = $transition(element, change);
                            if (currentTransition) {
                                currentTransition.cancel();
                            }
                            currentTransition = newTransition;
                            newTransition.then(newTransitionDone, newTransitionDone);
                            return newTransition;

                            function newTransitionDone() {
                                // Make sure it's this transition, otherwise, leave it alone.
                                if (currentTransition === newTransition) {
                                    currentTransition = undefined;
                                }
                            }
                        }

                        function expand() {
                            if (initialAnimSkip) {
                                initialAnimSkip = false;
                                expandDone();
                            } else {
                                element.removeClass('collapse').addClass('collapsing');
                                doTransition({height: element[0].scrollHeight + 'px'}).then(expandDone);
                            }
                        }

                        function expandDone() {
                            element.removeClass('collapsing');
                            element.addClass('collapse in');
                            element.css({height: 'auto'});
                        }

                        function collapse() {
                            if (initialAnimSkip) {
                                initialAnimSkip = false;
                                collapseDone();
                                element.css({height: 0});
                            } else {
                                // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
                                element.css({height: element[0].scrollHeight + 'px'});
                                //trigger reflow so a browser realizes that height was updated from auto to a specific value
                                var x = element[0].offsetWidth;

                                element.removeClass('collapse in').addClass('collapsing');

                                doTransition({height: 0}).then(collapseDone);
                            }
                        }

                        function collapseDone() {
                            element.removeClass('collapsing');
                            element.addClass('collapse');
                        }

                        scope.$watch(
                            attrs.collapse, function (shouldCollapse) {
                                if (shouldCollapse) {
                                    collapse();
                                } else {
                                    expand();
                                }
                            }
                        );
                    }
                };
            }
        ]
    );

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

    .constant(
    'accordionConfig', {
        closeOthers: true
    }
)

    .controller(
        'AccordionController', [
            '$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

                // This array keeps track of the accordion groups
                this.groups = [];

                // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
                this.closeOthers = function (openGroup) {
                    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
                    if (closeOthers) {
                        angular.forEach(
                            this.groups, function (group) {
                                if (group !== openGroup) {
                                    group.isOpen = false;
                                }
                            }
                        );
                    }
                };

                // This is called from the accordion-group directive to add itself to the accordion
                this.addGroup = function (groupScope) {
                    var that = this;
                    this.groups.push(groupScope);

                    groupScope.$on(
                        '$destroy', function (event) {
                            that.removeGroup(groupScope);
                        }
                    );
                };

                // This is called from the accordion-group directive when to remove itself
                this.removeGroup = function (group) {
                    var index = this.groups.indexOf(group);
                    if (index !== -1) {
                        this.groups.splice(this.groups.indexOf(group), 1);
                    }
                };

            }
        ]
    )

    // The accordion directive simply sets up the directive controller
    // and adds an accordion CSS class to itself element.
    .directive(
    'accordion', function () {
        return {
            restrict: 'EA', controller: 'AccordionController', transclude: true, replace: false, templateUrl: 'template/accordion/accordion.html'
        };
    }
)

    // The accordion-group directive indicates a block of html that will expand and collapse in an accordion
    .directive(
        'accordionGroup', [
            '$parse', function ($parse) {
                return {
                    require: '^accordion',         // We need this directive to be inside an accordion
                    restrict: 'EA', transclude: true,              // It transcludes the contents of the directive into the template
                    replace: true,                // The element containing the directive will be replaced with the template
                    templateUrl: 'template/accordion/accordion-group.html', scope: {heading: '@'},        // Create an isolated scope and interpolate the heading attribute onto this scope
                    controller: function () {
                        this.setHeading = function (element) {
                            this.heading = element;
                        };
                    }, link: function (scope, element, attrs, accordionCtrl) {
                        var getIsOpen, setIsOpen;

                        accordionCtrl.addGroup(scope);

                        scope.isOpen = false;

                        if (attrs.isOpen) {
                            getIsOpen = $parse(attrs.isOpen);
                            setIsOpen = getIsOpen.assign;

                            scope.$parent.$watch(
                                getIsOpen, function (value) {
                                    scope.isOpen = !!value;
                                }
                            );
                        }

                        scope.$watch(
                            'isOpen', function (value) {
                                if (value) {
                                    accordionCtrl.closeOthers(scope);
                                }
                                if (setIsOpen) {
                                    setIsOpen(scope.$parent, value);
                                }
                            }
                        );
                    }
                };
            }
        ]
    )

    // Use accordion-heading below an accordion-group to provide a heading containing HTML
    // <accordion-group>
    //   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
    // </accordion-group>
    .directive(
    'accordionHeading', function () {
        return {
            restrict: 'EA', transclude: true,   // Grab the contents to be used as the heading
            template: '',       // In effect remove this element!
            replace: true, require: '^accordionGroup', compile: function (element, attr, transclude) {
                return function link(scope, element, attr, accordionGroupCtrl) {
                    // Pass the heading to the accordion-group controller
                    // so that it can be transcluded into the right place in the template
                    // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
                    accordionGroupCtrl.setHeading(
                        transclude(
                            scope, function () {
                            }
                        )
                    );
                };
            }
        };
    }
)

    // Use in the accordion-group template to indicate where you want the heading to be transcluded
    // You must provide the property on the accordion-group controller that will hold the transcluded element
    // <div class="accordion-group">
    //   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
    //   ...
    // </div>
    .directive(
    'accordionTransclude', function () {
        return {
            require: '^accordionGroup', link: function (scope, element, attr, controller) {
                scope.$watch(
                    function () {
                        return controller[attr.accordionTransclude];
                    }, function (heading) {
                        if (heading) {
                            element.html('');
                            element.append(heading);
                        }
                    }
                );
            }
        };
    }
);

angular.module("template/accordion/accordion-group.html", []).run(
    [
        "$templateCache", function ($templateCache) {
        $templateCache.put(
            "template/accordion/accordion-group.html",
            "<div class=\"panel panel-default\">\n" +
                "  <div class=\"panel-heading\" data-ng-click=\"isOpen = !isOpen\" style=\"cursor:pointer;\">\n" +
                "    <h4 class=\"panel-title\">\n" +
                "      <a class=\"accordion-toggle\"  accordion-transclude=\"heading\">{{heading}}</a>\n" +
                "    </h4>\n" +
                "  </div>\n" +
                "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
                "	  <div class=\"panel-body\" data-ng-transclude></div>\n" +
                "  </div>\n" +
                "</div>"
        );
    }
    ]
);

angular.module("template/accordion/accordion.html", []).run(
    [
        "$templateCache", function ($templateCache) {
        $templateCache.put(
            "template/accordion/accordion.html", "<div class=\"panel-group\" data-ng-transclude></div>"
        );
    }
    ]
);
