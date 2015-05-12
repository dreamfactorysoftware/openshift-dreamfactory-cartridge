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
var ServiceCtrl = function(dfLoadingScreen, $scope, Service, SystemConfigDataService ) {

    // Used to let us know when the Services are loaded
    $scope.servicesLoaded = false;

    // Added controls for responsive
    $scope.xsWidth = $(window).width() <= 992;
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

    // End Controls for responsive



    // Remote Web Services Definition Editor

    $scope.isEditorClean = true;
    $scope.isEditable = false;
    $scope.currentEditor = null;
    $scope.backupServiceDef = null;

    $scope.confirmServiceDefOverwrite = function () {
        return confirm("Overwrite current service definition?  This operation cannot be undone.");
    };

    $scope.confirmServiceDefReset = function () {

        return confirm("Reset service definition?  This operation cannot be undone.");
    };

    $scope.createNewServiceDef = function (currentService) {

        // Create a service def obj
        function createServiceDefObj() {
            return {
                content: angular.toJson(swaggerTemplate(), true)
            }
        }

        // Do we have a docs property
        if (!currentService.hasOwnProperty('docs')) {

            // No.  Create it and add a service def obj
            currentService['docs'] = [];
            currentService.docs.push(createServiceDefObj());
        }
        // We do have docs property.  Is it empty or null
        else if (currentService.docs.length > 0 && (currentService.docs[0].content != '' || currentService.docs[0].content != null)) {

            // No.  We need confirmation.
            // Add new service def obj to currentService obj
            if ($scope.confirmServiceDefOverwrite()) {

                currentService.docs[0] = createServiceDefObj();
            }
        }
        // We have an empty docs object
        else {

            // Just add the service def obj
            currentService.docs[0] = createServiceDefObj();
        }
    };

    $scope.updateServiceDefObj = function (currentService) {

        if ($scope.isEditorClean) {
         return false;
         }

        currentService.docs[0].content = $scope.currentEditor.session.getValue();
    };

    $scope.resetServiceDef = function (currentService) {

        if ($scope.confirmServiceDefReset()) {

            currentService.docs = angular.copy($scope.backupServiceDef)
            $scope.$broadcast('reload:script', true);

        }
    };

    $scope.$watch('service', function (newValue, oldValue) {

        if (!newValue) return false;

        if (newValue.type === 'Remote Web Service') {

            $scope.isEditable = true;
            $scope.backupServiceDef = angular.copy(newValue.docs);
        }else {
            $scope.isEditable = false;
        }
    });

    // End Remote Web Services Definition Editor




	$scope.$on(
		'$routeChangeSuccess', function() {
			$( window ).resize();
		}
	);
	Scope = $scope;
    Scope.sql_placeholder="mysql:host=my_server;dbname=my_database";
    var systemConfig = SystemConfigDataService.getSystemConfig();
    if(systemConfig.server_os.indexOf("win") !== -1 && systemConfig.server_os.indexOf("darwin") === -1){
        Scope.sql_placeholder="mysql:Server=my_server;Database=my_database";
        Scope.microsoft_sql_server_prefix = "sqlsrv:"
    }else{
        Scope.microsoft_sql_server_prefix = "dblib:"
    }
    $scope.sqlVendors = [
        {
            name:"MySQL",
            prefix:"mysql:"
        },
        {
            name:"Microsoft SQL Server",
            prefix:Scope.microsoft_sql_server_prefix
        } ,
        {
            name:"PostgreSQL",
            prefix:"pgsql:"
        },
        {
            name:"Oracle",
            prefix:"oci:"
		},
		{
			name:"IBM DB2",
			prefix:"ibm:"
        }

    ];
    Scope.promptForNew = function() {

        // Added for small devices
        $scope.open();

        Scope.currentServiceId = '';
		Scope.action = "Create";
		$( '#step1' ).show();
		Scope.service = {headers: [], parameters: [], credentials: {private_paths: []}};

        $scope.$watch(
            "sqlServerPrefix",
            function( newValue, oldValue ) {

                if ( newValue === oldValue ) {

                    return;

                }
                if(newValue === "sqlsrv:"){
                    Scope.sql_server_host_identifier = "Server";
                    Scope.sql_server_db_identifier = "Database";
                }else if(newValue === "oci:"){
                    Scope.sql_server_host_identifier = "host";
                    Scope.sql_server_db_identifier = "sid";
				}else if(newValue === "ibm:"){
					Scope.sql_server_host_identifier = "HOSTNAME";
					Scope.sql_server_db_identifier = "DATABASE";
                }else{
                    Scope.sql_server_host_identifier = "host";
                    Scope.sql_server_db_identifier = "dbname";
                }

                $scope.service.dsn = newValue;
                if($scope.sqlServerHost){
                    $scope.service.dsn = $scope.service.dsn + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost;
                }
                if($scope.sqlServerDb){
                    $scope.service.dsn = $scope.service.dsn + ";" + $scope.sql_server_db_identifier + "=" + $scope.sqlServerDb;
                }
                if($scope.sqlServerDb && $scope.sqlServerPrefix === "oci:"){
                    $scope.service.dsn = $scope.sqlServerPrefix + "dbname=(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(" + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost + ")(PORT = 1521))) (CONNECT_DATA = (" + $scope.sql_server_db_identifier + "=" + newValue;
                    $scope.service.dsn += ")))";
                }
				if($scope.sqlServerDb && $scope.sqlServerPrefix === "ibm:"){
					$scope.service.dsn = $scope.sqlServerPrefix + "DRIVER={IBM DB2 ODBC DRIVER};" + $scope.sql_server_db_identifier + "=" + newValue + ";" + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost;
					$scope.service.dsn += ";PORT=50000;PROTOCOL=TCPIP;";
				}

            });
        $scope.$watch(
            "sqlServerHost",
            function( newValue, oldValue ) {
                if ( newValue === oldValue ) {

                    return;

                }
                $scope.service.dsn = $scope.sqlServerPrefix + $scope.sql_server_host_identifier + "=" + newValue;
                if($scope.sqlServerDb){
                    $scope.service.dsn = $scope.service.dsn + ";" + $scope.sql_server_db_identifier + "=" + $scope.sqlServerDb;
                }
                if($scope.sqlServerDb && $scope.sqlServerPrefix === "oci:"){
                    $scope.service.dsn = $scope.sqlServerPrefix + "dbname=(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(" + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost + ")(PORT = 1521))) (CONNECT_DATA = (" + $scope.sql_server_db_identifier + "=" + newValue;
                    $scope.service.dsn += ")))";
                }
				if($scope.sqlServerDb && $scope.sqlServerPrefix === "ibm:"){
					$scope.service.dsn = $scope.sqlServerPrefix + "DRIVER={IBM DB2 ODBC DRIVER};" + $scope.sql_server_db_identifier + "=" + newValue + ";" + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost;
					$scope.service.dsn += ";PORT=50000;PROTOCOL=TCPIP;";
				}


            });
        $scope.$watch(
            "sqlServerDb",
            function( newValue, oldValue ) {
                if ( newValue === oldValue ) {

                    return;

                }
                $scope.service.dsn = $scope.sqlServerPrefix + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost + ";" + $scope.sql_server_db_identifier + "=" + newValue;
                if($scope.sqlServerPrefix ==="oci:"){
                    $scope.service.dsn = $scope.sqlServerPrefix + "dbname=(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(" + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost + ")(PORT = 1521))) (CONNECT_DATA = (" + $scope.sql_server_db_identifier + "=" + newValue;
                    $scope.service.dsn += ")))";
                }
				if($scope.sqlServerPrefix === "ibm:"){
					$scope.service.dsn = $scope.sqlServerPrefix + "DRIVER={IBM DB2 ODBC DRIVER};" + $scope.sql_server_db_identifier + "=" + newValue + ";" + $scope.sql_server_host_identifier + "=" + $scope.sqlServerHost;
					$scope.service.dsn += ";PORT=50000;PROTOCOL=TCPIP;";
				}

            });
        Scope.tableData = [];
		Scope.headerData = [];
		$( "#swagger, #swagger iframe" ).hide();
		$( '.save_button' ).show();
		$( '.update_button' ).hide();
		$( "tr.info" ).removeClass( 'info' );
		Scope.service.type = "Remote Web Service";

		Scope.showFields();
		$( '#file-manager' ).hide();
		$( "#button_holder" ).show();
		Scope.aws = {};
		Scope.azure = {};
		Scope.rackspace = {};
		Scope.openstack = {};
		Scope.mongodb = {};
		Scope.couch = {};
		Scope.salesforce = {};
		Scope.script = {};
        Scope.service.is_active = true;
        Scope.email_type = "default";
		$( window ).scrollTop( 0 );
	};


	Scope.service = {};
	Scope.Services = Service.get({},function(response) {
        $scope.servicesLoaded = true;
        // Stop loading screen
        dfLoadingScreen.stop();

        });
	Scope.action = "Create";
	Scope.emailOptions = [
		{name: "Server Default", value: "default"},
		{name: "Server Command", value: "command"},
		{name: "SMTP", value:"smtp"}
	];
	Scope.email_type = "default";
	Scope.remoteOptions = [
		{name: "Amazon S3", value: "aws s3"},
		{name: "Windows Azure Storage", value: "azure blob"},
		{name: "RackSpace CloudFiles", value: "rackspace cloudfiles"},
		{name: "OpenStack Object Storage", value: "openstack object storage"}
	];
	Scope.rackspaceRegions = [
		{name: "London", value: "LON"},
		{name: "Chicago", value: "ORD"},
		{name: "Dallas / Fort Worth", value: "DFW"}
	];
	Scope.awsRegions = [
		{name: "US EAST (N Virgina)", value: "us-east-1"},
		{name: "US WEST (N California)", value: "us-west-1"},
		{name: "US WEST (Oregon)", value: "us-west-2"},
		{name: "EU WEST (Ireland)", value: "eu-west-1"},
		{name: "Asia Pacific (Singapore)", value: "ap-southeast-1"},
		{name: "Asia Pacific (Sydney)", value: "ap-southeast-2"},
		{name: "Asia Pacific (Tokyo)", value: "ap-northeast-1"},
		{name: "South America (Sao Paulo)", value: "sa-east-1"}
	];
	Scope.NoSQLOptions = [
		{name: "Amazon DynamoDB", value: "aws dynamodb"},
		{name: "Amazon SimpleDB", value: "aws simpledb"},
		{name: "Windows Azure Tables", value: "azure tables"},
		{name: "CouchDB", value: "couchdb"},
		{name: "MongoDB", value: "mongodb"}
	];
	Scope.service.storage_type = "aws s3";
	Scope.serviceOptions = [
		{name: "Remote Web Service"},
		{name: "Local SQL DB"},
		{name: "Remote SQL DB"},
		{name: "Local SQL DB Schema"},
		{name: "Remote SQL DB Schema"},
		{name: "NoSQL DB"},
		{name: "Salesforce"},
		{name: "Local File Storage"},
		{name: "Remote File Storage"},
		{name: "Email Service"},
		{name: "Push Service"}
	];
	Scope.serviceCreateOptions = [
		{name: "Remote Web Service"},
		{name: "Remote SQL DB"},
		{name: "NoSQL DB"},
		{name: "Salesforce"},
		{name: "Local File Storage"},
		{name: "Remote File Storage"},
		{name: "Email Service"},
		{name: "Push Service"}
	];
	Scope.securityOptions = [
		{name: "SSL", value: "SSL"},
		{name: "TLS", value: "TLS"}
	];
	Scope.pushOptions = [
		{name: "Amazon SNS", value: "aws sns"}
	];
	$( '.update_button' ).hide();

	Scope.save = function() {
        if ( Scope.service.type == "Remote SQL DB" || Scope.service.type == "Remote SQL DB Schema" ) {
			Scope.service.credentials = {dsn: Scope.service.dsn, user: Scope.service.user, pwd: Scope.service.pwd};
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		if ( Scope.service.type == "Email Service" ) {
			if ( Scope.email_type == "smtp" ) {
				Scope.service.credentials =
				{transport_type : "smtp" ,host: Scope.service.host, port: Scope.service.port, security: Scope.service.security, user: Scope.service.user, pwd: Scope.service.pwd};
			} else if ( Scope.email_type == "command" ) {
                Scope.service.credentials =
                {transport_type: "command", command : Scope.service.command};
            } else {
                Scope.service.credentials = {transport_type:null};
            }
            Scope.service.credentials = JSON.stringify( Scope.service.credentials );
        }
		if ( Scope.service.type == "Remote File Storage" ) {
			switch ( Scope.service.storage_type ) {
				case "aws s3":
					Scope.service.credentials = {private_paths : Scope.service.credentials.private_paths, access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
				case "azure blob":
					Scope.service.credentials = {private_paths : Scope.service.credentials.private_paths, account_name: Scope.azure.account_name, account_key: Scope.azure.account_key};
					break;
				case "rackspace cloudfiles":
					Scope.service.credentials =
					{private_paths : Scope.service.credentials.private_paths,url: Scope.rackspace.url, api_key: Scope.rackspace.api_key, username: Scope.rackspace.username, tenant_name: Scope.rackspace.tenant_name, region: Scope.rackspace.region};
					break;
				case "openstack object storage":
					Scope.service.credentials =
					{private_paths : Scope.service.credentials.private_paths,url: Scope.openstack.url, api_key: Scope.openstack.api_key, username: Scope.openstack.username, tenant_name: Scope.openstack.tenant_name, region: Scope.openstack.region};
					break;
			}
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		if ( Scope.service.type == "Salesforce" ) {
			Scope.service.credentials =
			{username: Scope.salesforce.username, password: Scope.salesforce.password, security_token: Scope.salesforce.security_token, version: Scope.salesforce.version};
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		if ( Scope.service.type == "NoSQL DB" ) {

			switch ( Scope.service.storage_type ) {
				case "aws dynamodb":
					Scope.service.credentials =
					{access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
				case "aws simpledb":
					Scope.service.credentials =
					{access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
				case "azure tables":
					Scope.service.credentials = {account_name: Scope.azure.account_name, account_key: Scope.azure.account_key, PartitionKey: Scope.azure.PartitionKey};
					break;
				case "couchdb":
					Scope.service.credentials = {dsn: Scope.couchdb.service.dsn, user: Scope.couchdb.service.user, pwd: Scope.couchdb.service.pwd};
					break;
				case "mongodb":
					options = angular.copy(Scope.mongodb.service.options);
					if (!options.ssl) delete options.ssl;
					Scope.service.credentials =
					{dsn: Scope.mongodb.service.dsn, user: Scope.mongodb.service.user, pwd: Scope.mongodb.service.pwd, db: Scope.mongodb.service.db, options: options};
					break;
			}
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		if ( Scope.service.type == "Push Service" ) {
			switch ( Scope.service.storage_type ) {
				case "aws sns":
					Scope.service.credentials = {access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
			}
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		Scope.service.parameters = Scope.tableData;
		Scope.service.headers = Scope.headerData;

        // If we are a Remote Web Service
        if (Scope.service.type === 'Remote Web Service') {

            // Get the updated docs from the the editor
            $scope.updateServiceDefObj(Scope.service);
        }
        else {

            // Don't send the docs property
            delete Scope.service.docs;
        }


        var id = Scope.service.id;
		Service.update(
			{id : id}, Scope.service, function( data ) {
				updateByAttr( Scope.Services.record, 'id', id, data );
				Scope.promptForNew();
				//window.top.Actions.showStatus("Updated Successfully");

                // Added for small devices
                $scope.close();

                $(function(){
                    new PNotify({
                        title: 'Services',
                        type:  'success',
                        text:  'Updated Successfully.'
                    });
                });

			}
		);

	};
	Scope.create = function() {
		if ( Scope.service.type == "Salesforce" ) {
			Scope.service.credentials =
			{username: Scope.salesforce.username, password: Scope.salesforce.password, security_token: Scope.salesforce.security_token, version: Scope.salesforce.version};
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
        if ( Scope.service.type == "Email Service" ) {
            if ( Scope.email_type == "smtp" ) {
                Scope.service.credentials =
                {transport_type : "smtp" ,host: Scope.service.host, port: Scope.service.port, security: Scope.service.security, user: Scope.service.user, pwd: Scope.service.pwd};
            } else if ( Scope.email_type == "command" ) {
                Scope.service.credentials =
                {transport_type: "command", command : Scope.service.command};
            } else {
                Scope.service.credentials = {transport_type:null};
            }
            Scope.service.credentials = JSON.stringify( Scope.service.credentials );
        }
		if ( Scope.service.type == "Remote SQL DB" || Scope.service.type == "Remote SQL DB Schema" ) {
			Scope.service.credentials = {dsn: Scope.service.dsn, user: Scope.service.user, pwd: Scope.service.pwd};
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		if ( Scope.service.type == "Remote File Storage" ) {
			switch ( Scope.service.storage_type ) {
				case "aws s3":
					Scope.service.credentials = {private_paths : Scope.service.credentials.private_paths, access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
				case "azure blob":
					Scope.service.credentials = {private_paths : Scope.service.credentials.private_paths, account_name: Scope.azure.account_name, account_key: Scope.azure.account_key};
					break;
				case "rackspace cloudfiles":
					Scope.service.credentials =
					{private_paths : Scope.service.credentials.private_paths,url: Scope.rackspace.url, api_key: Scope.rackspace.api_key, username: Scope.rackspace.username, tenant_name: Scope.rackspace.tenant_name, region: Scope.rackspace.region};
					break;
				case "openstack object storage":
					Scope.service.credentials =
					{private_paths : Scope.service.credentials.private_paths,url: Scope.openstack.url, api_key: Scope.openstack.api_key, username: Scope.openstack.username, tenant_name: Scope.openstack.tenant_name, region: Scope.openstack.region};
					break;
			}

			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		if ( Scope.service.type == "NoSQL DB" ) {
			switch ( Scope.service.storage_type ) {
				case "aws dynamodb":
					Scope.service.credentials =
					{access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
				case "aws simpledb":
					Scope.service.credentials =
					{access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
				case "azure tables":
					Scope.service.credentials = {account_name: Scope.azure.account_name, account_key: Scope.azure.account_key, PartitionKey: Scope.azure.PartitionKey};
					break;
				case "couchdb":
					Scope.service.credentials = {user: Scope.couchdb.service.username, pwd: Scope.couchdb.service.username, dsn: Scope.couchdb.service.dsn};
					break;
				case "mongodb":
					options = angular.copy(Scope.mongodb.service.options);
					if (!options.ssl) delete options.ssl;
					Scope.service.credentials =
					{dsn: Scope.mongodb.service.dsn, user: Scope.mongodb.service.user, pwd: Scope.mongodb.service.pwd, db: Scope.mongodb.service.db, options: options};
					break;
			}
			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		if ( Scope.service.type == "Push Service" ) {
			switch ( Scope.service.storage_type ) {
				case "aws sns":
					Scope.service.credentials = {access_key: Scope.aws.access_key, secret_key: Scope.aws.secret_key, region: Scope.aws.region};
					break;
			}

			Scope.service.credentials = JSON.stringify( Scope.service.credentials );
		}
		Service.save(
			Scope.service, function( data ) {
				Scope.promptForNew();
				//window.top.Actions.showStatus("Created Successfully");

                // Added for small devices
                $scope.close();

                $(function(){
                    new PNotify({
                        title: 'Services',
                        type:  'success',
                        text:  'Created Successfully.'
                    });
                });
				Scope.Services.record.push( data );
			}
		);
	};
	Scope.showFields = function() {
//		if ( Scope.service.type.indexOf( "Email" ) != -1 ) {
//			if ( !Scope.service.id ) {
//				Scope.tableData = [
//					{"name": "from_name", "value": ""},
//					{"name": "from_email", "value": ""},
//					{"name": "reply_to_name", "value": ""},
//					{"name": "reply_to_email", "value": ""}
//				];
//			}
//			Scope.columnDefs = [
//				{field: 'name', width: '*'},
//				{field: 'value', enableFocusedCellEdit: true, width: '**', enableCellSelection: true, editableCellTemplate: emailInputTemplate }
//			];
//		}
//		else {
//			Scope.columnDefs = [
//				{field: 'name', enableCellEdit: false, width: 100},
//				{field: 'value', enableCellEdit: true, width: 200, enableCellSelection: true, editableCellTemplate: inputTemplate },
//				{field: 'Update', cellTemplate: buttonTemplate, enableCellEdit: false, width: 100}
//			];
//			Scope.tableData = [];
//		}

		switch ( Scope.service.type ) {
			case "Local SQL DB":
			case "Local SQL DB Schema":
				$( ".base_url, .host, .command, .security, .port, .parameters, .headers, .storage_name, .storage_type, .push_type, .credentials, .native_format, .user, .pwd, .dsn, .nosql_type" ).hide();
				break;
			case "Remote SQL DB":
			case "Remote SQL DB Schema":
				$( ".base_url, .host, .command, .security, .port, .parameters, .headers, .storage_name, .storage_type, .push_type, .credentials, .native_format, .nosql_type" ).hide();
				$( ".user, .pwd, .dsn" ).show();
				break;
			case "Script Service":
			case "Remote Web Service":
				$( ".user, .pwd, .host, .command, .security, .port, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format, .nosql_type" ).hide();
				$( ".base_url, .parameters, .headers" ).show();
				break;
			case "Local File Storage":
				$( ".user, .pwd, .host, .command, .security, .port, .base_url, .parameters, .headers, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format, .nosql_type" ).hide();
				$( ".storage_name" ).show();
				break;
			case "Remote File Storage":
				$( ".user, .host, .security, .command, .port, .pwd, .base_url, .parameters, .headers, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format, .nosql_type" ).hide();
				$( ".storage_name, .storage_type" ).show();
				break;
			case "NoSQL DB":
				$( ".base_url, .command, .parameters , .user, .pwd,.host,.port, .security.parameters, .headers,.dsn ,.storage_name, .storage_type, .push_type, .credentials, .native_format" ).hide();
				$( ".nosql_type" ).show();
				break;
			case "Email Service":
				$( ".nosql_type , .base_url, .command, .parameters, .user, .pwd, .host, .port, .security.parameters, .headers, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format" ).hide();
				Scope.showEmailFields();
				break;
			case "Salesforce":
				$( ".nosql_type , .base_url, .command, .parameters, .user, .pwd, .host, .port, .security.parameters, .headers, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format" ).hide();
				break;
			case "Push Service":
				$( ".user, .host, .security,.command,  .port, .pwd,.base_url, .parameters, .headers,.dsn ,.storage_name, .storage_type, .credentials, .native_format,.nosql_type" ).hide();
				$( ".push_type" ).show();
				break;
		}
	};

	Scope.showSwagger = function() {
		window.open(CurrentServer + "/swagger/#!/" + this.service.api_name, "swagger" )
	};

	Scope.showEmailFields = function() {
        Scope.service.credentials = Scope.service.credentials || {transport_type: "smtp"};
		switch ( Scope.email_type ) {

			case "default":
				$( ".user, .pwd, .host, .port, .command, .security, .base_url, .parameters, .command, .headers, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format, .nosql_type" ).hide();
				$( ".parameters" ).show();
				break;
			case "command":
				$( ".user, .pwd, .host, .port, .command, .security, .base_url, .command, .headers, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format, .nosql_type" ).hide();
				$( ".command, .parameters" ).show();
				break;
			case "smtp":
				$( ".user, .pwd, .host, .port, .command, .security, .base_url, .parameters, .command, .headers, .dsn, .storage_name, .storage_type, .push_type, .credentials, .native_format, .nosql_type" ).hide();
				$( ".user, .pwd, .host, .port, .security, .parameters" ).show();
				break;
		}
	};
	//noinspection ReservedWordAsName
	Scope.delete = function() {
		var which = this.service.name;
		if ( !which || which == '' ) {
			which = "the service?";
		}
		else {
			which = "the service '" + which + "'?";
		}
		if ( !confirm( "Are you sure you want to delete " + which ) ) {
			return;
		}
		var id = this.service.id;
		var api_name = this.service.api_name;

		Service.delete(
			{ id: id }, function() {
				Scope.promptForNew();
				//window.top.Actions.showStatus("Deleted Successfully");

                // Added for small devices
                $scope.close();

                $(function(){
                    new PNotify({
                        title: 'Services',
                        type:  'success',
                        text:  'Deleted Successfully.'
                    });
                });

				$( "#row_" + id ).fadeOut();
			}
		);
	};

	Scope.showDetails = function() {

        // Added for small devices
        $scope.open();

		$( '#step1' ).show();
		$( '#file-manager' ).hide();
		$( "#button_holder" ).show();

		Scope.$broadcast( 'swagger:off' );

		//$("#swagger, #swagger iframe, #swagctrl").hide();
		Scope.service = angular.copy( this.service );
        // remote web services created before caching added need outbound = true
        if ( Scope.service.type === "Remote Web Service" ) {
            Scope.service.parameters.forEach(
                function(param) {
                    if ( !param.hasOwnProperty('outbound') ) {
                        param['outbound'] = true;
                    }
                }
            )
        }
        // mongodb services created before SSL added need ssl = false
        if ( Scope.service.type === "NoSQL DB" && Scope.service.storage_type === "mongodb" ) {
            if (!Scope.service.credentials.hasOwnProperty('options')) {
                Scope.service.credentials.options = {};
            }
            if (!Scope.service.credentials.options.hasOwnProperty('ssl')) {
                Scope.service.credentials.options.ssl = false;
            }
        }
        Scope.currentServiceId = Scope.service.id;
        Scope.service.credentials = Scope.service.credentials || {};
        var cString = $scope.service.credentials;
		if ( Scope.service.type.indexOf( "Email Service" ) != -1 ) {
			Scope.service.type = "Email Service";
			if ( Scope.service.credentials.transport_type === "smtp" ) {
                Scope.email_type = "smtp";
                Scope.service.host = cString.host;
				Scope.service.port = cString.port;
				Scope.service.security = cString.security;
				Scope.service.user = cString.user;
				Scope.service.pwd = cString.pwd;
			}
			else if ( Scope.service.credentials.transport_type === "command" ) {
				Scope.email_type = "command";
                Scope.service.command = cString.command;
			}
			else {
				Scope.email_type = "default";
                Scope.service.credentials.transport_type=null;
			}
			Scope.showEmailFields();
        }
		if ( Scope.service.type == "Salesforce" ) {
			var cString = Scope.service.credentials;
			Scope.salesforce.username = cString.username;
			Scope.salesforce.password = cString.password;
			Scope.salesforce.security_token = cString.security_token;
			Scope.salesforce.version = cString.version;
		}
		if ( Scope.service.type == "Remote SQL DB" || Scope.service.type == "Remote SQL DB Schema" ) {
			if ( Scope.service.credentials ) {
				var cString = Scope.service.credentials;
				Scope.service.dsn = cString.dsn;
				Scope.service.user = cString.user;
				Scope.service.pwd = cString.pwd;
				Scope.service.region = cString.region;
			}
		}
		if ( Scope.service.type == "Remote File Storage" ) {
			Scope.aws = {};
			Scope.azure = {};
			if ( Scope.service.credentials ) {
				var fString = Scope.service.credentials;
				switch ( Scope.service.storage_type ) {
					case "aws s3":
						Scope.aws.access_key = fString.access_key;
						Scope.aws.secret_key = fString.secret_key;
						Scope.aws.region = fString.region;
						break;
					case "azure blob":
						Scope.azure.account_name = fString.account_name;
						Scope.azure.account_key = fString.account_key;
						break;
					case "rackspace cloudfiles":
						Scope.rackspace.url = fString.url;
						Scope.rackspace.api_key = fString.api_key;
						Scope.rackspace.username = fString.username;
						Scope.rackspace.tenant_name = fString.tenant_name;
						Scope.rackspace.region = fString.region;

						break;
					case "openstack object storage":
						Scope.openstack.url = fString.url;
						Scope.openstack.api_key = fString.api_key;
						Scope.openstack.username = fString.username;
						Scope.openstack.tenant_name = fString.tenant_name;
						Scope.openstack.region = fString.region;
						break;
				}
			}
		}
		if ( Scope.service.type == "NoSQL DB" ) {
			Scope.aws = {};
			Scope.azure = {};
			Scope.couchdb = {service: {}};
			Scope.mongodb = {service: {}};

			if ( Scope.service.credentials ) {
				var fString = Scope.service.credentials;
				switch ( Scope.service.storage_type ) {
					case "aws dynamodb":
					case "aws simpledb":
						Scope.aws.access_key = fString.access_key;
						Scope.aws.secret_key = fString.secret_key;
						Scope.aws.region = fString.region;
						break;
					case "azure tables":
						Scope.azure.account_name = fString.account_name;
						Scope.azure.account_key = fString.account_key;
                        Scope.azure.PartitionKey = fString.PartitionKey;
						break;
					case "couchdb":
						Scope.couchdb.service.dsn = fString.dsn;
						Scope.couchdb.service.user = fString.user;
						Scope.couchdb.service.pwd = fString.pwd;
						break;
					case "mongodb":
						Scope.mongodb.service.dsn = fString.dsn;
						Scope.mongodb.service.user = fString.user;
						Scope.mongodb.service.pwd = fString.pwd;
						Scope.mongodb.service.db = fString.db;
                        Scope.mongodb.service.options = fString.options;
						break;
				}
			}
		}
		if ( Scope.service.type == "Push Service" ) {
			Scope.aws = {};
			if ( Scope.service.credentials ) {
				var fString = Scope.service.credentials;
				switch ( Scope.service.storage_type ) {
					case "aws sns":
						Scope.aws.access_key = fString.access_key;
						Scope.aws.secret_key = fString.secret_key;
						Scope.aws.region = fString.region;
						break;
				}
			}
		}



		Scope.action = "Update";
		$( '.save_button' ).hide();
		$( '.update_button' ).show();
		Scope.showFields();

		Scope.tableData = Scope.service.parameters;
		Scope.headerData = Scope.service.headers;
		$( "tr.info" ).removeClass( 'info' );
		$( '#row_' + Scope.service.id ).addClass( 'info' );
	};

    $scope.deleteParameter = function(){
        var item = this.$index;
        $scope.service.parameters.splice(item, 1);
    }
    $scope.addParameter = function(){
//        $( "#error-container" ).hide();
//        if ( !Scope.param ) {
//            return false;
//        }
//        if ( !Scope.param.name || !Scope.param.value ) {
//            $( "#error-container" ).html( "Both name and value are required" ).show();
//            return false;
//        }
//        if ( checkForDuplicate( Scope.service.parameters, 'name', Scope.param.name ) ) {
//            $( "#error-container" ).html( "Parameter already exists" ).show();
//            $( '#param-name, #param-value' ).val( '' );
//            return false;
//        }
        $scope.param = {};
        if ( Scope.service.type === "Remote Web Service" ) {
            $scope.param['outbound'] = true;
            $scope.param['cache_key'] = true;
        }
        $scope.service.parameters.unshift($scope.param);
    }
	$scope.deleteClientParameter = function(){
		var item = this.$index;
		$scope.service.credentials.client_exclusions.parameters.splice(item, 1);
	}
	$scope.addClientParameter = function () {
		if (!Scope.service.credentials.client_exclusions) {
			Scope.service.credentials.client_exclusions = {
				parameters: []
			};

		}
		$scope.param = {};
        if ( Scope.service.type === "Remote Web Service" ) {
            $scope.param['outbound'] = true;
            $scope.param['cache_key'] = true;
        }
		$scope.service.credentials.client_exclusions.parameters.unshift($scope.param);
	}
    $scope.deleteHeader = function(){
        var item = this.$index;
        $scope.service.headers.splice(item, 1);
    }
    $scope.addHeader = function(){

        $scope.header = {};
		if ( Scope.service.type === "Remote Web Service" ) {
			$scope.header['pass_from_client'] = false;
		}
        $scope.service.headers.unshift($scope.header);

    }
    $scope.addPath = function(){
        $scope.path = "";
        $scope.service.credentials.private_paths.unshift($scope.path);
    }
    $scope.deletePath = function(){
        var item = this.$index;
        $scope.service.credentials.private_paths.splice(item, 1);
    }

	Scope.changeUrl = function() {
		switch ( this.rackspace.region ) {
			case "LON":
				Scope.rackspace.url = "https://lon.identity.api.rackspacecloud.com/";
				break;
			case "ORD":
				Scope.rackspace.url = "https://identity.api.rackspacecloud.com/";
				break;
			case "DFW":
				Scope.rackspace.url = "https://identity.api.rackspacecloud.com/";
				break;
		}
	};
	Scope.showFileManager = function() {
        window.open(CurrentServer + "/filemanager/?path=/" + this.service.api_name + "/&allowroot=false", "files-root");
	};
	$( "#param-value" ).keyup(
		function( event ) {
			if ( event.keyCode == 13 ) {

				$( "#param-update" ).click();
			}
		}
	);
	$( "#header-value" ).keyup(
		function( event ) {
			if ( event.keyCode == 13 ) {

				$( "#header-update" ).click();
			}
		}
	);
	angular.element( document ).ready(
		function() {
			Scope.promptForNew();
		}
	);
	//$( "#swagger, #swagger iframe" ).hide();
	Scope.promptForNew();



    // Create Swagger Definition Template
    function serviceDefDisclaimer() {

        var text = '/**\n' +
            '* This file is a swagger template for the definition\n' +
            '* of a remote web service.  Errors in this file will\n' +
            '* contribute to undefined behavior, such as Swagger UI\n' +
            '* not loading, in the DSP.  Create/Edit with care and \n' +
            '* delete these comments before saving the service.\n' +
            '* \n' +
            '* FAILURE TO DELETE THESE COMMENTS WILL RESULT IN SWAGGER\'S\n' +
            '* INABILITY TO DISPLAY YOUR SERVICE.\n' +
            '**/\n\n';
        return text;

    }
    function swaggerTemplate() {
        return {
            "resourcePath":   "/{api_name}",
            "produces":       [
                "application/json", "application/xml"
            ],
            "consumes":       [
                "application/json", "application/xml"
            ],
            "apis":           [
                {
                    "path":        "/{api_name}",
                    "operations":  [
                        {
                            "method":   "GET",
                            "summary":  "List resource types available for this service.",
                            "nickname": "getResources",
                            "type":     "Resources",
                            "notes":    "See listed operations for each resource type available."
                        }
                    ],
                    "description": "Operations available for this service."
                },
                {
                    "path":        "/{api_name}/{resource_type}",
                    "operations":  [
                        {
                            "method":           "GET",
                            "summary":          "Retrieve multiple items of a resource type.",
                            "nickname":         "getItems",
                            "type":             "Items",
                            "parameters":       [
                                {
                                    "name":          "resource_type",
                                    "description":   "Type of the resource to retrieve.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                },
                                {
                                    "name":          "ids",
                                    "description":   "Comma-delimited list of the identifiers of the resources to retrieve.",
                                    "allowMultiple": true,
                                    "type":          "string",
                                    "paramType":     "query",
                                    "required":      false
                                },
                                {
                                    "name":          "include_count",
                                    "description":   "Include the total number of items in the returned metadata results.",
                                    "allowMultiple": false,
                                    "type":          "boolean",
                                    "paramType":     "query",
                                    "required":      false
                                }
                            ],
                            "responseMessages": [
                                {
                                    "message": "Bad Request - Request does not have a valid format, all required parameters, etc.",
                                    "code":    400
                                },
                                {
                                    "message": "System Error - Specific reason is included in the error message.",
                                    "code":    500
                                }
                            ],
                            "notes":            "Use the 'ids' parameter to limit items that are returned."
                        },
                        {
                            "method":           "POST",
                            "summary":          "Create one or more items.",
                            "nickname":         "createItems",
                            "type":             "Success",
                            "parameters":       [
                                {
                                    "name":          "resource_type",
                                    "description":   "Type of the resource to retrieve.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                },
                                {
                                    "name":          "items",
                                    "description":   "JSON array of objects containing name-value pairs of items to create.",
                                    "allowMultiple": false,
                                    "type":          "Items",
                                    "paramType":     "body",
                                    "required":      true
                                }
                            ],
                            "responseMessages": [
                                {
                                    "message": "Bad Request - Request does not have a valid format, all required parameters, etc.",
                                    "code":    400
                                },
                                {
                                    "message": "System Error - Specific reason is included in the error message.",
                                    "code":    500
                                }
                            ],
                            "notes":            "Post data should be a single object or an array of objects (shown)."
                        },
                        {
                            "method":           "DELETE",
                            "summary":          "Delete one or more items.",
                            "nickname":         "deleteItems",
                            "type":             "Success",
                            "parameters":       [
                                {
                                    "name":          "resource_type",
                                    "description":   "Type of the resource to retrieve.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                },
                                {
                                    "name":          "ids",
                                    "description":   "Comma-delimited list of the identifiers of the resources to retrieve.",
                                    "allowMultiple": true,
                                    "type":          "string",
                                    "paramType":     "query",
                                    "required":      false
                                }
                            ],
                            "responseMessages": [
                                {
                                    "message": "Bad Request - Request does not have a valid format, all required parameters, etc.",
                                    "code":    400
                                },
                                {
                                    "message": "System Error - Specific reason is included in the error message.",
                                    "code":    500
                                }
                            ],
                            "notes":            "If no ids are given, nothing is deleted."
                        }
                    ],
                    "description": "Operations for resource type administration."
                },
                {
                    "path":        "/{api_name}/{resource_type}/{id}",
                    "operations":  [
                        {
                            "method":           "GET",
                            "summary":          "Retrieve one item by identifier.",
                            "nickname":         "getItem",
                            "type":             "Item",
                            "parameters":       [
                                {
                                    "name":          "resource_type",
                                    "description":   "Type of the resource to retrieve.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                },
                                {
                                    "name":          "id",
                                    "description":   "Identifier of the resource to retrieve.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                }
                            ],
                            "responseMessages": [
                                {
                                    "message": "Bad Request - Request does not have a valid format, all required parameters, etc.",
                                    "code":    400
                                },
                                {
                                    "message": "System Error - Specific reason is included in the error message.",
                                    "code":    500
                                }
                            ],
                            "notes":            "All name-value pairs are returned for that item."
                        },
                        {
                            "method":           "PUT",
                            "summary":          "Update one item by identifier.",
                            "nickname":         "updateItem",
                            "type":             "Success",
                            "parameters":       [
                                {
                                    "name":          "resource_type",
                                    "description":   "Type of the resource to retrieve.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                },
                                {
                                    "name":          "id",
                                    "description":   "Identifier of the resource to retrieve.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                },
                                {
                                    "name":          "item",
                                    "description":   "Data containing name-value pairs to update in the item.",
                                    "allowMultiple": false,
                                    "type":          "Item",
                                    "paramType":     "body",
                                    "required":      true
                                }
                            ],
                            "responseMessages": [
                                {
                                    "message": "Bad Request - Request does not have a valid format, all required parameters, etc.",
                                    "code":    400
                                },
                                {
                                    "message": "System Error - Specific reason is included in the error message.",
                                    "code":    500
                                }
                            ],
                            "notes":            "Post data should be a single object of name-value pairs for a single item."
                        },
                        {
                            "method":           "DELETE",
                            "summary":          "Delete one item by identifier.",
                            "nickname":         "deleteItem",
                            "type":             "Success",
                            "parameters":       [
                                {
                                    "name":          "resource_type",
                                    "description":   "Type of the resource to delete.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                },
                                {
                                    "name":          "id",
                                    "description":   "Identifier of the resource to delete.",
                                    "allowMultiple": false,
                                    "type":          "string",
                                    "paramType":     "path",
                                    "required":      true
                                }
                            ],
                            "responseMessages": [
                                {
                                    "message": "Bad Request - Request does not have a valid format, all required parameters, etc.",
                                    "code":    400
                                },
                                {
                                    "message": "System Error - Specific reason is included in the error message.",
                                    "code":    500
                                }
                            ],
                            "notes":            "Use the 'fields' and/or 'related' parameter to return deleted properties. By default, the id is returned."
                        }
                    ],
                    "description": "Operations for single item administration."
                }
            ],
            "models":         {
                "Resources": {
                    "id":         "Resources",
                    "properties": {
                        "resource": {
                            "type":  "Array",
                            "items": {
                                "$ref": "Resource"
                            }
                        }
                    }
                },
                "Resource":  {
                    "id":         "Resource",
                    "properties": {
                        "name": {
                            "type": "string"
                        }
                    }
                },
                "Items":     {
                    "id":         "Items",
                    "properties": {
                        "item": {
                            "type":        "Array",
                            "description": "Array of items of the given resource.",
                            "items":       {
                                "$ref": "Item"
                            }
                        },
                        "meta": {
                            "type":        "MetaData",
                            "description": "Available meta data for the response."
                        }
                    }
                },
                "Item":      {
                    "id":         "Item",
                    "properties": {
                        "field": {
                            "type":        "Array",
                            "description": "Example name-value pairs.",
                            "items":       {
                                "type": "string"
                            }
                        }
                    }
                },
                "Success":   {
                    "id":         "Success",
                    "properties": {
                        "success": {
                            "type": "boolean"
                        }
                    }
                }
            }
        }
    }
};