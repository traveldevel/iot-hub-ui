sap.ui.define([
	"iot/hub/ui/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.App", {

		oLoginDialog : null,
		oLoggedInUser : null,
		
		hostname : '',
		token : '',
		apikey : '',

		onInit : function () {
			
		},

		onAfterRendering: function(){

			var oView = this.getView();
			
			if (!this.oLoginDialog) {
				this.oLoginDialog = new sap.ui.xmlfragment(oView.getId(), "iot.hub.ui.fragment.Login", this);
				oView.addDependent(this.oLoginDialog);
			}

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
			var sRawUrl = this.hostname.replace("MICROSERVICE", "rawdata") + "?api_key=" + this.apikey;
			var oRawModel = new sap.ui.model.odata.ODataModel(sRawUrl, {
				loadMetadataAsync: true,
				json: true,
				headers:{
					"Authorization" : "Basic " + this.token
				}
			});

			this.setModel(oRawModel, "rawdata");

			// create event model
			var sEventUrl = this.hostname.replace("MICROSERVICE", "event") + "?api_key=" + this.apikey;
			var oEventModel = new sap.ui.model.odata.ODataModel(sEventUrl, {
				loadMetadataAsync: true,
				json: true,
				headers:{
					"Authorization" : "Basic " + this.token
				}
			});

			this.setModel(oEventModel, "event");			

			// create location model
			var sLocUrl = this.hostname.replace("MICROSERVICE", "location") + "?api_key=" + this.apikey;
			var oLocationModel = new sap.ui.model.odata.ODataModel(sLocUrl, {
				loadMetadataAsync: true,
				json: true,
				headers:{
					"Authorization" : "Basic " + this.token
				}
			});

			this.setModel(oLocationModel, "event");			
		},

		onLoginPress: function(oEvent){

			this.oLoginDialog.setBusy(true);

			var oView = this.getView();

			// get form values
			this.hostname = oView.byId("hostnameSelect").getSelectedItem().getText();
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
			var sMetadataUrl = this.hostname.replace("MICROSERVICE", "metadata") + "?api_key=" + this.apikey;
			var oMetadataModel = new sap.ui.model.odata.ODataModel(sMetadataUrl, {
				loadMetadataAsync: true,
				json: true,
				headers:{
					"Authorization" : "Basic " + this.token
				}
			});

			this.setModel(oMetadataModel, "metadata");

			// get user
			var aFilters  = new Array();

			aFilters.push(new sap.ui.model.Filter({
					path: "name",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "'" + userName + "'"
			}));

			aFilters.push(new sap.ui.model.Filter({
				path: "password",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "'" + password + "'"
			}));			

			var that = this;

			oMetadataModel.read("/user", {
				async: true, 
				filters : aFilters,
				error: function(err){
					console.log(err);
				},
				success: function(oData, oResp){
					
					if(!oData){
						oData = JSON.parse(oResp.body);
					}

					if(oData.value.length > 0 && oData.value[0]._id.length > 0){
						
						that.oLoginDialog.setBusy(false);
						that.oLoginDialog.close();
						
						that.oLoggedInUser = oData.value[0];
						console.log(that.oLoggedInUser);

						MessageToast.show("Login Ok");

						that.createAllODataModels();
					}
				}
			});
		}
	});
});