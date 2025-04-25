sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
	"use strict";
	var oModel;

	return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.Cancel_QA", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_QA
		 */
		onInit: function () {
			var serviceURl = "/sap/opu/odata/sap/ZGW_GATEPASS_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(serviceURl);
			this.getView().setModel(oModel);

		},
		onNavBack: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Cancellation");
			this.byId("gp_num").setValue("");
			this.byId("Qa_num").setValue("");
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

				if (Gp_Num == "") {
					sap.m.MessageToast.show("Gate Pass number is Mandatory");
				} else {
					var oThis = this;
					oModel.refresh(true);
					oModel.read("/CancelqafillSet('" + Gp_Num + "')", {
						// method: "PUT",
						success: function (data, response) {
							// var Msg = data.Message;

							oModel.refresh(true);
							// sap.m.MessageToast.show("Cancellation of an Gate Pass is Successfully done");
							var InspLot = data.Insplot;
							var msg = data.Message;

							if (InspLot == "000000000000") {
								sap.m.MessageToast.show(msg);
							} else {
								oThis.byId("Qa_num").setValue(InspLot);
							}

						},
						error: function (cc, vv) {

						}
					});
				}
			}
		},
		Cancel_qa: function () {
			// var DelFlag = "X";
			var Gp_Num = this.byId("gp_num").getValue();
			var QA_Num = this.byId("Qa_num").getValue();
			if (Gp_Num == "") {
				sap.m.MessageToast.show("Inspection Lot Number is Mandatory");
			} else if (QA_Num == "") {
				sap.m.MessageToast.show("Inspection Lot Number is Mandatory");
			} else {
				var oEntry = {
					"Insplot": QA_Num
						// "DelInd": DelFlag
				};

				// oModel.update("/GatepassdtlSet", oEntry, {
				// 	Method: "PUT",
				var oThis = this;
				oModel.create("/QAcharSet",
					oEntry, {
						method: "PUT",
						success: function (data, response) {
								var Message = data.Message;
								sap.m.MessageToast.show(Message);
								oThis.byId("gp_num").setValue("")
								oThis.byId("Qa_num").setValue("");

							}
							// error: function (cc, vv) {
							// 	sap.m.MessageToast.show("Cancellation QA Successfully Done");
							// }
					});

			}

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_QA
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_QA
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.Cancel_QA
		 */
		//	onExit: function() {
		//
		//	}

	});

});