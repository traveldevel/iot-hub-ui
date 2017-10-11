sap.ui.define([
	"iot/hub/ui/controller/BaseController",
	"sap/m/MessageBox",
], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.UserEdit", {

		hostname : '',
		token : '',
		apikey : '',

		onInit : function () {
			var oMainPage = sap.ui.getCore().byId("__xmlview0");
			this.hostname = oMainPage.getController().hostname;
			this.token = oMainPage.getController().token;
			this.apikey = oMainPage.getController().apikey;	
		},

		validateChangedUser: function(newUser){
			
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

			var editedUser = {
				name: oView.byId("username").getValue(),
				firstname: oView.byId("firstname").getValue(),
				lastname: oView.byId("lastname").getValue(),
				roles: []
			};

			if(oView.byId("READONLY").getSelected()){
				editedUser.roles.push("READONLY");
			}

			if(oView.byId("ADMIN").getSelected()){
				editedUser.roles.push("ADMIN");
			}

			if(oView.byId("DEVICES").getSelected()){
				editedUser.roles.push("DEVICES");
			}
			
			if(oView.byId("GROUPS").getSelected()){
				editedUser.roles.push("GROUPS");
			}
			
			if(oView.byId("PROJECTS").getSelected()){
				editedUser.roles.push("PROJECTS");
			}
			
			if(oView.byId("EVENTS").getSelected()){
				editedUser.roles.push("EVENTS");
			}	
			
			if(oView.byId("RAWDATA").getSelected()){
				editedUser.roles.push("RAWDATA");
			}
			
			if(oView.byId("LOCATIONS").getSelected()){
				editedUser.roles.push("LOCATIONS");
			}			

			console.log(editedUser);

			if(this.validateChangedUser(editedUser)){
				
				oPage.setBusy(true);

				var sUrl = this.hostname.replace("MICROSERVICE", "metadata") + "/user?api_key=" + this.apikey;
				console.log(sUrl);

				var that = this;

				$.ajax({
					type: "POST",
					url: sUrl,
					data: JSON.stringify(editedUser),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function(data){
						console.log(data);
						oPage.setBusy(false);

						that.getRouter().navTo("userList");
					},
					failure: function(errMsg) {
						alert(errMsg);
					}
				});
			}
		}
		
	});
});