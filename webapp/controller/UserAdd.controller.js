sap.ui.define([
	"iot/hub/ui/controller/BaseController",
	"sap/m/MessageBox",
], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.UserAdd", {

		hostname : '',
		token : '',
		apikey : '',

		onInit : function () {
			var oMainPage = sap.ui.getCore().byId("__xmlview0");
			this.hostname = oMainPage.getController().hostname;
			this.token = oMainPage.getController().token;
			this.apikey = oMainPage.getController().apikey;	
		},

		validateNewUser: function(newUser){
			
			var messages = [];
			
			var ok = true;

			if(newUser.name.length < 3){
				messages.push("Invalid user name");
				ok = false;
			}

			if(newUser.firstname.length < 3){
				messages.push("Invalid user first name");
				ok = false;
			}		
			
			if(newUser.lastname.length < 3){
				messages.push("Invalid user last name");
				ok = false;
			}		

			if(newUser.roles.length < 1){
				messages.push("Assign at least 1 role for user");
				ok = false;
			}			

			if(messages.length > 0){
				MessageBox.error(
					messages.join("\r\n"), {
						title: "Validation Errors",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) { }
					}
				);
			}

			return ok;
		},

		onSaveUserPress : function(oEvent){
			console.log('save user');

			var oView = this.getView();
			var oPage = oView.byId("createUserPage");

			var newUser = {
				name: oView.byId("username").getValue(),
				firstname: oView.byId("firstname").getValue(),
				lastname: oView.byId("lastname").getValue(),
				roles: []
			};

			if(oView.byId("READONLY").getSelected()){
				newUser.roles.push("READONLY");
			}

			if(oView.byId("ADMIN").getSelected()){
				newUser.roles.push("ADMIN");
			}

			if(oView.byId("DEVICES").getSelected()){
				newUser.roles.push("DEVICES");
			}
			
			if(oView.byId("GROUPS").getSelected()){
				newUser.roles.push("GROUPS");
			}
			
			if(oView.byId("PROJECTS").getSelected()){
				newUser.roles.push("PROJECTS");
			}
			
			if(oView.byId("EVENTS").getSelected()){
				newUser.roles.push("EVENTS");
			}	
			
			if(oView.byId("RAWDATA").getSelected()){
				newUser.roles.push("RAWDATA");
			}
			
			if(oView.byId("LOCATIONS").getSelected()){
				newUser.roles.push("LOCATIONS");
			}			

			console.log(newUser);

			if(this.validateNewUser(newUser)){
				
				oPage.setBusy(true);

				var sUrl = this.hostname.replace("MICROSERVICE", "metadata") + "/user?api_key=" + this.apikey;
				console.log(sUrl);

				$.ajax({
					type: "POST",
					url: sUrl,
					data: JSON.stringify(newUser),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function(data){
						console.log(data);
						oPage.setBusy(false);
					},
					failure: function(errMsg) {
						alert(errMsg);
					}
				});
			}
		}
		
	});
});