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

	return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.Cancel_GP", {

		onInit: function () {

		},
		onNavBack: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Cancellation");
			this.byId("Gp_num").setValue("");
			this.byId("Gp_num").setValueState("None");
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
			var Gp_num = this.byId("Gp_num").getValue();
			if (!Gp_num.match(Regex)) {
				this.getView().byId("Gp_num").setValueState("Error");
				// sap.m.MessageToast.show("Gate Pass No. must be 10 digit without any Characters");
			} else {
				this.getView().byId("Gp_num").setValueState("None");
			}
		},
		Cancel_gp: function () {
			/*	oModel.refresh(true);*/
			var DelFlag = "X";
			var GP_Num = this.byId("Gp_num").getValue();

			var Regex = '^[0-9]{10}$';

			if (!GP_Num.match(Regex)) {
				this.getView().byId("Gp_num").setValueState("Error");
				sap.m.MessageToast.show("Gate Pass No. must be 10 digit without any Characters");
			} else {
				this.getView().byId("Gp_num").setValueState("None");

				if (GP_Num == "") {
					sap.m.MessageToast.show("Gate Pass Number is Mandatory");
				} else {
					var oEntry = {
						"Gpassno": GP_Num,
						"DelInd": DelFlag
					};

					// oModel.update("/GatepassdtlSet", oEntry, {
					// 	Method: "PUT",
					var oThis = this;
					oModel.update("/GatepassdtlSet('" + GP_Num + "')",
						oEntry, {
							method: "PUT",
							success: function (data, response) {
									// sap.m.MessageToast.show("Cancellation of an Gate Pass is Successfully done");

									var parser = new DOMParser();
									var res = response.headers["sap-message"];
									var xmlDoc = parser.parseFromString(res, "text/xml");
									var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
									sap.m.MessageToast.show(Number);
									oThis.byId("Gp_num").setValue("");
									// sap.m.MessageBox.error(Number);
									//	oModel.refresh(true);
									//oThis.byId("Gp_num").getModel().refresh(true);
									// oThis.byId("Gp_num").getBinding("items").refresh(true);

									// oThis.byId("Gp_num").setSelectedKey("");
								}
								//issues while ccancelling any part it talkes more than execution time check after deploying app to the launchpad.
								// },
								// error: function (cc, vv) {
								// 	sap.m.MessageToast.show("Gate Pass cancelled successfully");
								// 	oThis.byId("Gp_num").setValue("");
								// }
						});
				}

			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_GP
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_GP
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_GP
		 */
		//	onExit: function() {
		//
		//	}

	});

});