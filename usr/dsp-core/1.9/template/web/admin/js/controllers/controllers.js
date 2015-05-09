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

angular.module( "AdminApp.controllers", [] ).controller(
	'ApiSDKCtrl', ['dfLoadingScreen',
		'$scope', function( dfLoadingScreen, $scope ) {


            // Stop loading screen
            dfLoadingScreen.stop();
		}
	]
);
/*
 var SwaggerCtrl = function ($rootScope, $timeout, $scope) {

 $scope.$on('$routeChangeSuccess', function () {
 $(window).resize();
 });
 $scope.currentTab = 'swagger-pane';
 $scope.showTab = function (tab) {
 $scope.currentTab = tab;
 };

 var swaggerIframe = $("#swaggerFrame");
 var swaggerDiv = $('#swagger');
 var docsIframe = $('#docsFrame');
 var apiContainer = $('#swagctrl');
 var docsDiv = $('#docs');
 var mainDiv = $('.main');

 swaggerIframe.hide();
 swaggerDiv.hide();
 apiContainer.hide();

 $rootScope.loadSwagger = function (hash) {


 swaggerIframe.attr('src', '');

 var appendURL = "";
 if (hash) {
 appendURL = "/#!/" + hash;
 }


 $timeout(function () {
 swaggerIframe.css('height', mainDiv.height() - 230).css('width', '100%').attr("src", CurrentServer + '/swagger/' + appendURL).show();
 swaggerDiv.css({
 'height': $('.main').height() - 220,
 'width': '95%'
 }).show();
 apiContainer.show();
 }, 1000);
 };


 $rootScope.loadSDK = function (hash) {

 docsDiv.css({
 "display": "block"
 });


 docsIframe.attr({
 "src": ""
 });


 $timeout(function () {
 docsIframe.css({
 "height": mainDiv.height() - 200,
 "width": "95%",
 "display": "block"
 }).attr("src", CurrentServer + '/docs/').show();
 apiContainer.show();
 }, 1000);
 };

 if (!$scope.action) {
 $rootScope.loadSwagger();
 $rootScope.loadSDK();
 }

 else {


 $('#swagbar').hide();
 $('#swagtabs').hide();
 apiContainer.removeClass('well');


 }

 $(function () {
 var height = $(window).height();


 mainDiv.css({'height': height - 40, 'margin-bottom': 0, 'padding-bottom': 0});
 var mainheight = mainDiv.height();
 docsDiv.css({
 "height": mainDiv.height() - 220,
 "width": "95%"
 });

 docsIframe.css({
 "height": mainDiv.height() - 220,
 "width": "100%"
 });
 });

 $(window).resize(function () {
 var height = $(window).height();

 mainDiv.css({'height': height - 40, 'margin-bottom': 0, 'padding-bottom': 0});

 docsDiv.css({
 "height": mainDiv.height() - 220,
 "width": "95%"
 });
 swaggerDiv.css({
 "height": mainDiv.height() - 220,
 "width": "95%"
 });

 docsIframe.css({
 "height": mainDiv.height() - 220,
 "width": "100%"
 });
 swaggerIframe.css({
 "height": mainDiv.height() - 220,
 "width": "100%"
 });

 });
 };
 */