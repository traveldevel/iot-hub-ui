/*global history */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("iot.hub.ui.controller.BaseController", {

        // router
        getRouter : function () {
            return this.getOwnerComponent().getRouter();
        },

        getModel : function (sName) {
            return this.getView().getModel(sName);
        },

        setModel : function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getGlobalModel : function (sName) {
            return sap.ui.getCore().getModel(sName);
        },

        setGlobalModel : function (oModel, sName) {
            return sap.ui.getCore().setModel(oModel, sName);
        },        

        getResourceBundle : function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        // nav back
        onNavBack : function() {
            var sPreviousHash = History.getInstance().getPreviousHash();

                if (sPreviousHash !== undefined) {
                history.go(-1);
            } else {
                this.getRouter().navTo("master", {}, true);
            }
        },

        // dialogs 
		onLoginDialogOpen:  function(oEvent){
			
			var oView = this.getView();
			
			if (!this.oLoginDialog) {
				this.oLoginDialog = new sap.ui.xmlfragment(oView.getId(), "iot.hub.ui.fragment.Login", this);
				oView.addDependent(this.oLoginDialog);
			}
						
			this.oLoginDialog.open();
		},

		onAboutDialogOpen:  function(oEvent){

			var oView = this.getView();
			
			if (!this.oAboutDialog) {
				this.oAboutDialog = new sap.ui.xmlfragment(oView.getId(), "iot.hub.ui.fragment.About", this);
				oView.addDependent(this.oAboutDialog);
			}
						
			this.oAboutDialog.open();
		},

		onAboutDialogClose: function(oEvent){
			this.oAboutDialog.close();
        },
        
        // menu actions
        onUserListPress: function(oEvent){
            console.log("user list");
            
            var oRouter = this.getRouter();
            oRouter.navTo("userList");
        },     

        onUserAddPress: function(oEvent){
            console.log("user add");

            var oRouter = this.getRouter();
            oRouter.navTo("userAdd");            
        },

        onProjectListPress: function(oEvent){
            console.log("project list");
        },

        onProjectAddPress: function(oEvent){
            console.log("project add");
        },      
        
        onGroupListPress: function(oEvent){
            console.log("group list");
        },

        onGroupAddPress: function(oEvent){
            console.log("group add");
        },    
        
        onDeviceListPress: function(oEvent){
            console.log("device list");
        },

        onDeviceAddPress: function(oEvent){
            console.log("device add");
        },           

        onEventListPress: function(oEvent){
            console.log("event list");
        },

        onLocationListPress: function(oEvent){
            console.log("location list");
        },
        
        onRawdataListPress: function(oEvent){
            console.log("rawdata list");
        }
    });
});