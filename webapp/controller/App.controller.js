sap.ui.define([
	"iot/hub/ui/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.App", {

		oAboutDialog : null,
		oLoginDialog : null,

		oLoggedInUser : null,
		oTenantsModel: null,
		
		hostname : '',
		token : '',
		apikey : '',

		onInit : function () {
			
			this.oTenantsModel = new sap.ui.model.json.JSONModel();
			this.oTenantsModel.loadData("tenants.json");
			this.setModel(this.oTenantsModel, "tenants");

			this.oManifestModel = new sap.ui.model.json.JSONModel();
			this.oManifestModel.loadData("manifest.json", {}, false);

			this.oAppInfoModel = new sap.ui.model.json.JSONModel();
			var info = {
				appVersion: this.oManifestModel.getData()["sap.app"].applicationVersion.version,
				ui5Version: sap.ui.getCore().getConfiguration().getVersion().toString()
			};
			this.oAppInfoModel.setData(info);
			this.setModel(this.oAppInfoModel, "appInfo");
		},

		onAfterRendering: function(){

			this.onLoginDialogOpen();

			var oView = this.getView();

			if (typeof(Storage) !== "undefined") {
				
				var apiKey = localStorage.getItem("apikey");
				var userName = localStorage.getItem("username");
				var passWord = localStorage.getItem("password");
				
				oView.byId("apikeyInput").setValue(apiKey);
				oView.byId("usernameInput").setValue(userName);
				oView.byId("passwordInput").setValue(passWord);
			}

			this.oLoginDialog.open();
		},

		makeAuthToken: function(user, password){
			var tok = user + ':' + password;
			var hash = btoa(tok);
			return hash;
		},

		createAllODataModels: function(){

			// create rawdata model
			var sRawUrl = this.hostname.replace("MICROSERVICE", "rawdata") + "/?api_key=" + this.apikey;
			
			var oRawModel = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: sRawUrl,
				synchronizationMode: "None",
				groupId: "$direct"
			});

			this.setGlobalModel(oRawModel, "rawdata");

			// create event model
			var sEventUrl = this.hostname.replace("MICROSERVICE", "event") + "/?api_key=" + this.apikey;

			var oEventModel = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: sEventUrl,
				synchronizationMode: "None",
				groupId: "$direct"
			});

			this.setGlobalModel(oEventModel, "event");			

			// create location model
			var sLocUrl = this.hostname.replace("MICROSERVICE", "location") + "/?api_key=" + this.apikey;

			var oLocationModel = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: sLocUrl,
				synchronizationMode: "None",
				groupId: "$direct"
			});

			this.setGlobalModel(oLocationModel, "location");			
		},

		onLoginPress: function(oEvent){

			this.oLoginDialog.setBusy(true);

			var oView = this.getView();
			
			this.hostname = "";

			var sKey = oView.byId("hostnameSelect").getSelectedItem().getKey();
			var tenants = this.oTenantsModel.getData();
			for(var idx in tenants){
				if(sKey === tenants[idx].key){
					this.hostname = tenants[idx].uri;
					break;
				}
			}

			this.apikey = oView.byId("apikeyInput").getValue();
			
			var userName = oView.byId("usernameInput").getValue();
			var password = oView.byId("passwordInput").getValue();
			console.log(userName, password);

			this.token = this.makeAuthToken(userName, password);

			// save form to localstorage
			if (typeof(Storage) !== "undefined") {

				localStorage.setItem("apikey", this.apikey);
				localStorage.setItem("username", userName);
				localStorage.setItem("password", password);				
			}

			// create metadata model
			var sMetadataUrl = this.hostname.replace("MICROSERVICE", "metadata") + "/?api_key=" + this.apikey;
			var oMetadataModel = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: sMetadataUrl,
				synchronizationMode: "None",
				groupId: "$direct"
			});

			this.setGlobalModel(oMetadataModel, "metadata");

			// get user		
			var userModel = new sap.ui.model.json.JSONModel();

			const sUrl = this.hostname.replace("MICROSERVICE", "metadata") + "/user?api_key=" + this.apikey + "&$filter=name eq '" + userName + "' and password eq '" + password + "'";

			var that = this;

			userModel.attachRequestCompleted(function(data){
				
				var oData = userModel.getData();
				
				that.oLoginDialog.setBusy(false);
				
				if(oData.value.length > 0){
	
					that.oLoginDialog.close();
					
					that.oLoggedInUser = oData.value[0];
					console.log(that.oLoggedInUser);
	
					MessageToast.show("Login Ok");
	
					that.createAllODataModels();
				}
				else
				{
					MessageToast.show("Login Error !");	
				}		
			});

			userModel.loadData(sUrl, {}, true);	
		}		
	});
});