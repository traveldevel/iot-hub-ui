sap.ui.define([
	"iot/hub/ui/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterType",
	"sap/ui/model/FilterOperator"
], function(BaseController, MessageBox, Filter, FilterType, FilterOperator) {
	"use strict";

	return BaseController.extend("iot.hub.ui.controller.RawDataList", {

		hostname : '',
		token : '',
		apikey : '',

		onInit : function () {
			jQuery.sap.require("sap.ui.core.format.DateFormat");

			var oMainPage = sap.ui.getCore().byId("__xmlview0");
			this.hostname = oMainPage.getController().hostname;
			this.token = oMainPage.getController().token;
			this.apikey = oMainPage.getController().apikey;	
			
			var oJsonModel = new sap.ui.model.json.JSONModel();
			var sRawUrl = this.hostname.replace("MICROSERVICE", "rawdata") + "/raw_data?api_key=" + this.apikey;
			oJsonModel.loadData(sRawUrl);
			this.setModel(oJsonModel, "rawdatajson");
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
			const sUrl = this.hostname.replace("MICROSERVICE", "rawdata") + sPath + "?api_key=" + this.apikey + "&$top=1000";

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
		},
		
		onSearch: function(oEvent){

			var oView = this.getView();
			var sSearch = oView.byId("rawdataSearchField").getValue();

			if(sSearch.length === 0){
				this.clearAllFilters();
			}
		},

		onSuggest: function(oEvent){

			var oView = this.getView();
			var sSearch = oView.byId("rawdataSearchField").getValue();

			if(sSearch.length === 0){
				this.clearAllFilters();
			}
		},		

		applyAllFilters: function(){
			console.log("applyAllFilters");

			var oView = this.getView();

			var sSearch = oView.byId("rawdataSearchField").getValue();
			console.log("sSearch=", sSearch);

			var oDateRange = oView.byId("rawdataDateRange");
			var date1 = oDateRange.getDateValue();
			var date2 = oDateRange.getSecondDateValue();
			console.log("period=", date1, date2);

			var dFilter = '';

			if(date1 !== null && date2 !== null){
				dFilter = "(created_at gt datetime'"+ date1.toISOString().slice(0, -1) + "' and created_at lt datetime'"+ date2.toISOString().slice(0, -1) + "')";
			}
			else
			{
				dFilter = "(created_at gt datetime'2000-01-01T00:00:00' and created_at lt datetime'2100-01-01T00:00:00')";
			}

			var query = "&$filter=((device_id eq '" + sSearch + "' or group_id eq '" + sSearch + "' or project_id eq '" + sSearch + "')";
			query += " and " + dFilter + ")";
			console.log(query);	

			var oJsonModel = new sap.ui.model.json.JSONModel();
			var sRawUrl = this.hostname.replace("MICROSERVICE", "rawdata") + "/raw_data?api_key=" + this.apikey + query + "&$top=1000";
			oJsonModel.loadData(sRawUrl);
			this.setModel(oJsonModel, "rawdatajson");
		},

		clearAllFilters: function(){
			console.log("clearAllFilters");

			var oJsonModel = new sap.ui.model.json.JSONModel();
			var sRawUrl = this.hostname.replace("MICROSERVICE", "rawdata") + "/raw_data?api_key=" + this.apikey + "&$top=1000";
			oJsonModel.loadData(sRawUrl);
			this.setModel(oJsonModel, "rawdatajson");			
		}
		
	});
});