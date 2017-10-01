sap.ui.define([
	"iot/hub/ui/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.App", {

		oLoginDialog : null,

		onInit : function () {

		},

		onAfterRendering: function(){
			var oView = this.getView();
			
			if (!this.oLoginDialog) {
				this.oLoginDialog = new sap.ui.xmlfragment(oView.getId(), "iot.hub.ui.fragment.Login", this);
				oView.addDependent(this.oLoginDialog);
			}

			this.oLoginDialog.open();
		},

		onLoginPress: function(oEvent){
			this.oLoginDialog.close();
		}
	});
});