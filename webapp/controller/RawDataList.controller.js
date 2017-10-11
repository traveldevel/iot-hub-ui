sap.ui.define([
	"iot/hub/ui/controller/BaseController",
	"sap/m/MessageBox",
], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.RawDataList", {

		hostname : '',
		token : '',
		apikey : '',

		onInit : function () {
			jQuery.sap.require("sap.ui.core.format.DateFormat");

			this.setModel(this.getGlobalModel("rawdata"), "rawdata");

			var oMainPage = sap.ui.getCore().byId("__xmlview0");
			this.hostname = oMainPage.getController().hostname;
			this.token = oMainPage.getController().token;
			this.apikey = oMainPage.getController().apikey;				
		},

        formatDate: function(str){
			
			var date = new Date(Date.parse(str));
			var dateStr = date.toISOString();      
	
            return dateStr.slice(0, dateStr.length - 5).replace("T", " ");
		},
		
        onValuesPress: function(oEvent){
			console.log(oEvent.getSource().data("RawDataId"));

			var rawId = oEvent.getSource().data("RawDataId");

			var sPath = "/raw_data('" + rawId + "')";
			const sUrl = this.hostname.replace("MICROSERVICE", "rawdata") + sPath + "?api_key=" + this.apikey;

			var rawValuesModel = new sap.ui.model.json.JSONModel();

			rawValuesModel.attachRequestCompleted(function(oEvent){
				
				var data = rawValuesModel.getData().value[0];

				MessageBox.information(
					JSON.stringify(data), {
						title: "JSON Message",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) { }
					}
				);
			});

			rawValuesModel.loadData(sUrl, {}, true);
        }	
		
	});
});