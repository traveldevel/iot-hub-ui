sap.ui.define([
	"iot/hub/ui/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.UserList", {

		onInit : function () {
			this.setModel(this.getGlobalModel("metadata"), "metadata");
		},

		handleUserPress: function(oEvent){

			var oContext = oEvent.getSource().getBindingContext("metadata");
			var oMetadataModel = oContext.getModel();
			var user = oContext.getObject();
			console.log(user);
			
			this.getRouter().navTo("userEdit", { id : user["_id"]});
		}
		
	});
});