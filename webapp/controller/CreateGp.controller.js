sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (Controller, Filter, FilterOperator, History, UIComponent) {
	"use strict";
	var oModel;

	return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.CreateGp", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.CreateGp
		 */
		onInit: function () {
			var serviceURl = "/sap/opu/odata/sap/ZGW_GATEPASS_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(serviceURl);
			this.getView().setModel(oModel);
			oModel.setSizeLimit(5000);
			this.AutoFillDetails();
		},
		AutoFillDetails: async function () {
			let getUserInfo = await this.getOwnerComponent().getUserInfoService();
			var UserId = getUserInfo.getId();
			var oThis = this;
			oModel.read("/UserSet(Userid='" + UserId + "')", {
				method: "GET",
				success: function (data, response) {
					// sap.m.MessageToast.show("Data Fill");
					var Plant = data.Werks;
					var Material = data.Matnr;
					var Vendor = data.Lifnr;

					oThis.byId("plantnum").setValue(Plant);
					oThis.byId("MatCode").setValue(Material);
					oThis.byId("VendorNum").setValue(Vendor);
					oThis.LiveMatChange();

				},
				error: function (cc, vv) {
					sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");

				}

			});

		},
		onFromdate: function () {
			var FromdateVal = this.byId("FromPOdate").getDateValue();
			this.byId("ToPOdate").setMinDate(FromdateVal);
			/*	var PoToDate = this.byId("ToPOdate").getDateValue();
				if (PoToDate == "") {
					PoToDate.setDateValue(FromdateVal);
				}*/

		},
		CreateGP: function () {

			var PlantNum = this.byId("plantnum");
			var PlantNumVal = PlantNum.getValue();
			var VendorNum = this.byId("VendorNum").getValue();
			var PoFromDate = this.byId("FromPOdate").getValue();
			var PoToDate = this.byId("ToPOdate").getValue();
			var MatCode = this.byId("MatCode");
			var MatCodeVal = MatCode.getValue();
			var PONumVal = this.byId("POid").getValue();

			// if (PONumVal == "") {
			// 	var PONumValempty = this.byId("POid").getValue();

			// } else {

			var Zeroval = "000000000000";
			var concate_val = Zeroval + "" + MatCodeVal;

			if (PlantNumVal == "" || MatCodeVal == "") {
				sap.m.MessageToast.show("Please Fill all the Mandatory fields");
				PlantNum.setValueState("Error");
				MatCode.setValueState("Error");
			} else {
				PlantNum.setValueState("None");
				MatCode.setValueState("None");

				var sDate = "1111-11-11T00:00:00";
				/*var day = new Date(data.startDate).getDate();*/
				var dateFormat = sap.ui.core.format.DateFormat.getInstance({
					pattern: "yyyy-MM-ddThh:mm:ss"
				});
				var dateFormatted = dateFormat.format(new Date(sDate));

				if (VendorNum == "") {
					var VendorNum = 99999999;
					// this.byId("VendorNum").setValue(VendNum);
				}
				if (PoFromDate == "") {
					var PoFromDate = dateFormatted;
					//	this.byId("FromPOdate").setValue(dateFormatted);
				}
				if (PoToDate == "") {
					var PoToDate = dateFormatted;
					//	this.byId("ToPOdate").setValue(dateFormatted);
				}
				if (PONumVal == "") {
					var PONumVal = 99999999;
					// this.byId("POid").setSelectedKey(PONum);
				}
				if (VendorNum == 99999999 || PoFromDate == dateFormatted || PoToDate == dateFormatted || PONumVal == 99999999) {

					/*	var a = oModel.read("/polistSet?$filter=Werks eq '" + PlantNumVal + "'and Lifnr eq '" + VendorNum + "'and (Bedat ge datetime'" +
							PoFromDate + "'and Bedat le datetime'" + PoToDate + "')and Matnr eq '" + MatCodeVal + "'and Ebeln eq '" + PONum + "'");*/

					/*	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo("GPList", {});*/
					// var PONumVal1 = this.byId("POid").getSelectedKey();
					// var VendorNum1 = this.byId("VendorNum").getValue();

					var data = PlantNumVal;
					var data1 = VendorNum;
					var data2 = PoFromDate;
					var data3 = PoToDate;
					var data5 = concate_val;
					var data6 = PONumVal;
					var data7 = MatCodeVal;

					//	var oEntry = [];
					/*	invoicePath: data,
						invoicePath1: data1,
						invoicePath2: data2,
						invoicePath3: data3,
						invoicePath5: data5,
						invoicePath6: data6*/
					/*	if(data != "")
						{
					oEntry.push(data, data1, data2, data3, data5, data6);
						}*/

					// var PO_combo = this.byId("POid");
					//	oModel.refresh(true);
					// this.byId("POid").getModel().refresh(true);
					// oThis.byId("Gp_num").getBinding("items").refresh(true);

					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("GPList", {
						/*invoicePath: oEntry*/
						invoicePath: data,
						invoicePath1: data1,
						invoicePath2: data2,
						invoicePath3: data3,
						invoicePath5: data5,
						invoicePath6: data6,
						invoicePath7: data7

					});
				}

				// this.byId("plantnum").setValue("");
				// this.byId("VendorNum").setValue("");
				this.byId("FromPOdate").setValue("");
				this.byId("ToPOdate").setValue("");
				// this.byId("MatCode").setValue("");
				this.byId("POid").setValue("");
				this.byId("POid").setSelectedKey("");
			}

			// }

		},
		LiveMatChange: function () {
			// sap.m.MessageToast.show("abx");
			var Plant_num = this.byId("plantnum").getValue();
			var Vend_num = this.byId("VendorNum").getValue();
			var PoFromDate = this.byId("FromPOdate").getValue();
			var PoToDate = this.byId("ToPOdate").getValue();
			var Mat_code = this.byId("MatCode").getValue();

			var sDate = "1111-11-11T00:00:00";
			/*var day = new Date(data.startDate).getDate();*/
			var dateFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-ddThh:mm:ss"
			});
			var dateFormatted = dateFormat.format(new Date(sDate));

			if (Vend_num == "") {
				var Vend_num = 99999999;
				//	this.byId("VendorNum").setValue(VendNum);
			}
			if (PoFromDate == "") {
				var PoFromDate = dateFormatted;
				//	this.byId("FromPOdate").setValue(dateFormatted);
			}
			if (PoToDate == "") {
				var PoToDate = dateFormatted;
				//	this.byId("ToPOdate").setValue(dateFormatted);
			}
			if (PoToDate == dateFormatted || PoFromDate == dateFormatted || Vend_num == 99999999) {
				/*	oModel.read("/PonumberSet(Werks='" + Plant_num + "')", {});*/
				/*	var a = oModel.read("/PonumberSet?$filter=Werks eq '" + Plant_num + "'and Lifnr eq '" + Vend_num + "'and (Bedat ge datetime'" +
						PoFromDate + "'and Bedat le datetime'" + PoToDate + "')and Matnr eq '" + Mat_code + "'");*/

				var Zeroval = "000000000000";
				var concate_val = Zeroval + Mat_code;
				var aFilters = [];
				if (Plant_num && Plant_num.length > 0) {
					if (PoFromDate == dateFormatted && PoToDate == dateFormatted) {
						PoFromDate = "";
						PoToDate = "";
						var filter = new sap.ui.model.Filter("Werks", FilterOperator.EQ, Plant_num);
						var filter1 = new sap.ui.model.Filter("Lifnr", FilterOperator.EQ, Vend_num);
						//var filter2 = new sap.ui.model.Filter("Bedat", FilterOperator.BT, PoFromDate, PoToDate);
						//	var filter3 = new sap.ui.model.Filter("Bedat", FilterOperator.EQ, PoToDate);
						var filter4 = new sap.ui.model.Filter("Matnr", FilterOperator.EQ, concate_val);
						aFilters.push(filter, filter1, filter4);

					} else if (PoToDate == dateFormatted) {
						PoToDate = "";
						var filter = new sap.ui.model.Filter("Werks", FilterOperator.EQ, Plant_num);
						var filter1 = new sap.ui.model.Filter("Lifnr", FilterOperator.EQ, Vend_num);
						//var filter2 = new sap.ui.model.Filter("Bedat", FilterOperator.BT, PoFromDate, PoToDate);
						var filter3 = new sap.ui.model.Filter("Bedat", FilterOperator.EQ, PoFromDate);
						var filter4 = new sap.ui.model.Filter("Matnr", FilterOperator.EQ, concate_val);
						aFilters.push(filter, filter1, filter3, filter4);
					}
					/*else if (Vend_num == "") {

					} */
					else {
						var filter = new sap.ui.model.Filter("Werks", FilterOperator.EQ, Plant_num);
						var filter1 = new sap.ui.model.Filter("Lifnr", FilterOperator.EQ, Vend_num);
						var filter2 = new sap.ui.model.Filter("Bedat", FilterOperator.BT, PoFromDate, PoToDate);
						//	var filter3 = new sap.ui.model.Filter("Bedat", FilterOperator.EQ, PoFromDate);
						var filter4 = new sap.ui.model.Filter("Matnr", FilterOperator.EQ, concate_val);
						aFilters.push(filter, filter1, filter2, filter4);

					}

				}

				var PO_combo = this.byId("POid");
				var binding = PO_combo.getBinding("items");
				binding.filter(aFilters, "Application");

				/*		this.byId("plantnum").setValue("");
						this.byId("VendorNum").setValue("");
						this.byId("FromPOdate").setValue("");
						this.byId("ToPOdate").setValue("");*/
			}

		},
		onNavBack: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Gate_Pass");
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
		CallFunc: function () {

			sap.m.MessageToast.show("dsffhjsfg");
		},
		onValueHelpVendorNum: function () {

			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.view.ValueHelpVendor", this);
				this.getView().addDependent(this._oDialog);
				//	this._oDialog.setModel(this.getView().getModel());
			}
			this._oDialog.open();
		},
		cancelvend: function () {
			this._oDialog.close();
		},
		ValueHelpVendor: function (oEvent) {

			this._item = oEvent.getSource().getBindingContext().getObject();
			// Get the selected Item 
			var oOrgUnit = this._item;
			// Get the OrgUnit ID 
			var VendNum = oOrgUnit.Lifnr;
			this.byId("VendorNum").setValue(VendNum);
			this._oDialog.close();
		},
		onValueHelpMatNum: function () {
			if (!this._oDialog1) {
				this._oDialog1 = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.view.ValueHelpMatCode", this);
				this.getView().addDependent(this._oDialog1);
				//	this._oDialog1.setModel(this.getView().getModel());
			}
			this._oDialog1.open();
		},
		cancel: function () {
			this._oDialog1.close();
		},
		ValueHelpMatCode: function (oEvent) {

			this._item = oEvent.getSource().getBindingContext().getObject();
			// Get the selected Item 
			var oOrgUnit = this._item;
			// Get the OrgUnit ID 
			var MatCode = oOrgUnit.Matnr;
			this.byId("MatCode").setValue(MatCode);
			this._oDialog1.close();
			this.LiveMatChange();
			/*	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("createSet", {
					VendNum: VendNum
				});*/

			/*	var Username = window.localStorage.getItem("key");

				oModel.read("/TaskSet(Executor = '" + Username + "')", {
				});*/

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.CreateGp
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.CreateGp
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.CreateGp
		 */
		//	onExit: function() {
		//
		//	}

	});

});