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
var FileCtrl = function( $scope, $location, $timeout ) {
	Scope = $scope;

//    $("#root-file-manager").css('height', $(window).height()).css('width', '100%').show();
//    $("#root-file-manager iframe").css('height', $(window).height()).css('width', '100%').attr("src", CurrentServer + '/filemanager/?path=/&allowroot=true').show();
//    $(window).resize(function () {
//        $('#root-file-manager').css('height', $(window).height()).css('width', '100%').css('width', '100%');
//        $("#root-file-manager iframe").css('height', $(window).height()).css('width', '100%');
//    });

	$( "#root-file-manager iframe" ).attr( "src", CurrentServer + '/filemanager/?path=/&allowroot=true' ).show();
};
