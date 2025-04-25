sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, History, UIComponent, Filter, FilterOperator) {
	"use strict";
	var oModel;
	var Plantnumber;
	var Mat_Code;

	return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.GPList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.GPList
		 */
		onInit: function () {
			var serviceURl = "/sap/opu/odata/sap/ZGW_GATEPASS_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(serviceURl);
			this.getView().setModel(oModel);
			// oModel.setSizeLimit(5000);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("GPList").attachPatternMatched(this._onObjectMatched, this);

			var uname = window.localStorage.setItem("key", oRouter.oHashChanger.hash);

		},
		_onObjectMatched: function (oEvent) {

			var PlantVal = oEvent.getParameter("arguments").invoicePath;
			Plantnumber = PlantVal;
			var VendVal = oEvent.getParameter("arguments").invoicePath1;
			var POFrom = oEvent.getParameter("arguments").invoicePath2;
			var POTo = oEvent.getParameter("arguments").invoicePath3;
			var MatCode = oEvent.getParameter("arguments").invoicePath5;
			var PoNum = oEvent.getParameter("arguments").invoicePath6;
			Mat_Code = oEvent.getParameter("arguments").invoicePath7;

			/*var a = oModel.read("/polistSet?$filter=Werks eq '" + PlantVal + "'and Lifnr eq '" + VendVal + "'and (Bedat ge datetime'" +
				POFrom + "'and Bedat le datetime'" + POTo + "')and Matnr eq '" + MatCode + "'and Ebeln eq '" + PoNum + "'");*/
			var date = "1111-11-11T12:00:00";
			var aFilters = [];
			if (PlantVal && PlantVal.length > 0) {
				if (POTo == date && POFrom == date) {
					POTo = "";
					POFrom = "";
					// var Filter3 = new sap.ui.model.Filter("Bedat", FilterOperator.EQ, POFrom);
					var Filter1 = new sap.ui.model.Filter("Werks", FilterOperator.EQ, PlantVal);
					var Filter2 = new sap.ui.model.Filter("Lifnr", FilterOperator.EQ, VendVal);
					//	var Filter3 = new sap.ui.model.Filter("Bedat", FilterOperator.BT, POFrom, POTo);
					//	var Filter4 = new sap.ui.model.Filter("Bedat", FilterOperator.EQ, POTo);
					var Filter5 = new sap.ui.model.Filter("Matnr", FilterOperator.EQ, MatCode);
					var Filter6 = new sap.ui.model.Filter("Ebeln", FilterOperator.EQ, PoNum);
					aFilters.push(Filter1, Filter2, Filter5, Filter6);
				} else if (POTo == date) {
					POTo = "";
					var Filter11 = new sap.ui.model.Filter("Werks", FilterOperator.EQ, PlantVal);
					var Filter22 = new sap.ui.model.Filter("Lifnr", FilterOperator.EQ, VendVal);
					//var Filter33 = new sap.ui.model.Filter("Bedat", FilterOperator.BT, POFrom, POTo);
					var Filter33 = new sap.ui.model.Filter("Bedat", FilterOperator.EQ, POFrom);
					var Filter55 = new sap.ui.model.Filter("Matnr", FilterOperator.EQ, MatCode);
					var Filter66 = new sap.ui.model.Filter("Ebeln", FilterOperator.EQ, PoNum);
					aFilters.push(Filter11, Filter22, Filter33, Filter55, Filter66);
				} else {
					var Filter11 = new sap.ui.model.Filter("Werks", FilterOperator.EQ, PlantVal);
					var Filter22 = new sap.ui.model.Filter("Lifnr", FilterOperator.EQ, VendVal);
					var Filter33 = new sap.ui.model.Filter("Bedat", FilterOperator.BT, POFrom, POTo);
					//	var Filter4 = new sap.ui.model.Filter("Bedat", FilterOperator.EQ, POTo);
					var Filter55 = new sap.ui.model.Filter("Matnr", FilterOperator.EQ, MatCode);
					var Filter66 = new sap.ui.model.Filter("Ebeln", FilterOperator.EQ, PoNum);
					aFilters.push(Filter11, Filter22, Filter33, Filter55, Filter66);
				}

			}
			var PO_Table = this.byId("POList");
			var binding = PO_Table.getBinding("items");
			binding.filter(aFilters, "Application");

			// var PO_Table = this.byId("POList");
			// var bind = PO_Table.bindItems({
			// 	path: "/polistSet?$filter=Werks eq '" + PlantVal + "'and Lifnr eq '" + VendVal + "'and (Bedat ge datetime'" +
			// 		POFrom + "'and Bedat le datetime'" + POTo + "')and Matnr eq '" + MatCode + "'and Ebeln eq '" + PoNum + "'"
			// });

		},
		onNavBack: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("CreateGp");
			/*	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Create_Compliance_Repository", null, true);*/
			/*	var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = UIComponent.getRouterFor(this);
					oRouter.navTo("TargetView1");
				}*/
		},
		CreatePO: function (oEvent) {

			var oThis = this;
			this._item = oEvent.getSource().getBindingContext().getObject();
			// Get the selected Item 
			var oOrgUnit = this._item;
			// Get the OrgUnit ID 
			var PONum = oOrgUnit.Ebeln;
			var POLine = oOrgUnit.Ebelp;
			var Rate = oOrgUnit.Netpr;
			// var oEntry = {
			// 	"Ebeln": PONum,
			// 	"Werks": Plantnumber

			// };
			/*	var hdrMessage = Response.headers["sap-message"];
				sap.m.MessageToast.show(hdrMessage);*/
			oModel.read("/GpautofillSet(Ebeln='" + PONum + "',Werks='" + Plantnumber + "')", {
				success: function (data, response) {
					// sap.m.MessageToast.show("success");

					var oRouter = sap.ui.core.UIComponent.getRouterFor(oThis);
					oRouter.navTo("IndividualGpScreen", {
						PoNumManifest: PONum,
						PlantNum: Plantnumber,
						MatCode: Mat_Code,
						POLineItem: POLine,
						ManiRate: Rate

					});
				},
				error: function (cc, vv) {
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(cc.response.body, "text/xml");
					var msg = xmlDoc.getElementsByTagName("message")[0].innerHTML;
					sap.m.MessageToast.show(msg);
				}

			});

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.GPList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.GPList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.GPList
		 */
		//	onExit: function() {
		//
		//	}

	});

});