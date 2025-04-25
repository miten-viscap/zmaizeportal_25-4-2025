sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
	"use strict";
	var oModel;
	var serviceURl = "/sap/opu/odata/sap/ZGW_GATEPASS_SRV/";
	oModel = new sap.ui.model.odata.ODataModel(serviceURl);
	sap.ui.getCore().setModel(oModel);
	oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
	return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.Cancel_Migo", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_Migo
		 */
		onInit: function () {

		},
		onNavBack: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Cancellation");
			this.byId("gp_num").setValue("");
			this.byId("Mat_doc").setValue("");
			this.byId("Doc_yr").setValue("");
			this.byId("gp_num").setValueState("None");
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
		NumbValid: function () {
			var Regex = '^[0-9]{10}$';
			var Gp_num = this.byId("gp_num").getValue();
			if (!Gp_num.match(Regex)) {
				this.getView().byId("gp_num").setValueState("Error");
				// sap.m.MessageToast.show("Gate Pass No. must be 10 digit without any Characters");
			} else {
				this.getView().byId("gp_num").setValueState("None");
			}
		},
		fetchdetails: function () {

			var Gp_Num = this.byId("gp_num").getValue();
			var Regex = '^[0-9]{10}$';

			if (!Gp_Num.match(Regex)) {
				this.getView().byId("gp_num").setValueState("Error");
				sap.m.MessageToast.show("Gate Pass No. must be 10 digit without any Characters");
			} else {
				this.getView().byId("gp_num").setValueState("None");

				var oThis = this;
				oModel.refresh(true);
				oModel.read("/CancelfillSet('" + Gp_Num + "')", {
					// method: "PUT",
					success: function (data, response) {
						// var Msg = data.Message;

						oModel.refresh(true);
						// sap.m.MessageToast.show("Cancellation of an Gate Pass is Successfully done");
						var Matdoc = data.MatDoc;
						var Docyr = data.DocYear;
						var msg = data.Message;

						if (Matdoc == "" && Docyr == "0000") {
							sap.m.MessageToast.show(msg);
						} else {
							oThis.byId("Mat_doc").setValue(Matdoc);
							oThis.byId("Doc_yr").setValue(Docyr);
						}

					},
					error: function (cc, vv) {

					}
				});
			}
		},
		Cancel_migo: function () {
			var Gp_Num = this.byId("gp_num").getValue();
			var Mat_doc = this.byId("Mat_doc").getValue();
			var Doc_Year = this.byId("Doc_yr").getValue();
			if (Gp_Num == "") {
				sap.m.MessageToast.show("Gate Pass Nmber is Mandatory");
			} else if (Mat_doc == "") {
				sap.m.MessageToast.show("Fields are Mandatory");
			} else if (Doc_Year == "") {
				sap.m.MessageToast.show("Fields are Mandatory");
			} else {
				var oEntry = {
					"MatDoc": Mat_doc,
					"DocYear": Doc_Year
				};

				// oModel.update("/GatepassdtlSet", oEntry, {
				// 	Method: "PUT",
				var oThis = this;
				oModel.refresh(true);
				oModel.update("/MigoSet('" + Mat_doc + "')",
					oEntry, {
						// method: "PUT",
						success: function (data, response) {
								// var Msg = data.Message;
								var Msg = response.headers["sap-message"];
								var parser = new DOMParser();
								var xmlDoc = parser.parseFromString(Msg, "text/xml");
								var msg = xmlDoc.getElementsByTagName("message")[0].innerHTML;
								sap.m.MessageToast.show(msg);
								oModel.refresh(true);
								// sap.m.MessageToast.show("Cancellation of an Gate Pass is Successfully done");
								oThis.byId("gp_num").setValue("");
								oThis.byId("Mat_doc").setValue("");
								oThis.byId("Doc_yr").setValue("");

							}
							// error: function (cc, vv) {
							// 	sap.m.MessageToast.show("Cancellation MIGO successfully Done");
							// }
					});
			}

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_Migo
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_Migo
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_Migo
		 */
		//	onExit: function() {
		//
		//	}

	});

});