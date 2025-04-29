sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/m/PDFViewer",
	"sap/m/MessageBox",
	'sap/ui/core/BusyIndicator'
], function (Controller, History, UIComponent, PDFViewer, MessageBox, BusyIndicator) {
	"use strict";
	var oModel;
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.PrintForm", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.PrintForm
		 */
		onInit: function () {
			var serviceURl = "/sap/opu/odata/sap/ZGW_GATEPASS_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(serviceURl, { json: true });
			this.getView().setModel(oModel);

			this._pdfViewer = new PDFViewer();
			this.getView().addDependent(this._pdfViewer);

		},
		onNavBack: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Dashboard");
			this.getView().byId("gp_num").setValue("");
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
		validateGPNum: function (oEvent) {
			let oCombobox = oEvent.getSource();
			let sSelectedKey = oCombobox.getSelectedKey();
			let sValue = oCombobox.getValue();

			// if (!sSelectedKey && sValue) {
			// 	oCombobox.setValueState("Error");
			// 	oCombobox.setValueStateText("Please enter a valid Gate Pass number.");
			// 	oCombobox.setSelectedKey("");
			// 	oCombobox.setValue("");
			// } else {
			// 	oCombobox.setValueState("None");
			// }
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

		fnPrintGatePass: async function (oEvent) {
			//check GP from
			let sGPNumFrom = this.getView().byId("gp_num");
			let sGPNumTo = this.getView().byId("gp_num_to");
			let sGPFromValueState = sGPNumFrom.getValueState();
			let sGPFromValue = sGPNumFrom.getValue();
			let sGPToValue = sGPNumTo.getValue();
			let aGPNumber = [];
			let FormName = "GATEPASS";

			var that = this;

			if ((sGPFromValueState !== "None" || !sGPFromValue)) {
				MessageBox.error("'Gate Pass From' is Mandatory, Enter correct Gate Pass number.");
				return;
			}

			// generate GP number sequance if GP number To entered.

			if (sGPFromValue && sGPToValue) {
				let iGPFromValue = parseInt(sGPFromValue);
				let iGPToValue = parseInt(sGPToValue);
				let aPrintPromises = [];
				aGPNumber = this._generateSequence(iGPFromValue, iGPToValue);
				BusyIndicator.show();

				for (let j = 0; j < aGPNumber.length; j++) {
					aPrintPromises.push(
						that._printGpPromise(aGPNumber[j], FormName)
					)
				}
				await Promise.all(aPrintPromises).then((printGP) => {
					console.log(printGP);
					BusyIndicator.hide();
				})

			} else if (sGPFromValue) {
				let aPrintPromises = [];
				aGPNumber = [sGPFromValue];
				BusyIndicator.show();

				for (let j = 0; j < aGPNumber.length; j++) {
					aPrintPromises.push(
						that._printGpPromise(aGPNumber[j], FormName)
					)
				}
				await Promise.all(aPrintPromises).then((printGP) => {
					console.log(printGP);
					BusyIndicator.hide();
				})
			}

		},
		_printGpPromise: function (Gp_num, Fmname) {
			var that = this;
			return new Promise(async function (resolve, reject) {
				oModel.read("/SmartformSet(Gpassno='" + Gp_num + "',Formname='" + Fmname + "')/$value", {
					method: "GET",
					success: function (data, response) {

						var img = response.requestUri;
						window.open(img);
						// that._pdfViewer.setSource(img);
						// that._pdfViewer.setTitle("Gate Pass Form " + Gp_num);
						// that._pdfViewer.downloadPDF();
						resolve(true);

					},
					error: function (cc, vv) {
						sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");
						resolve(false);
					}

				});
			})

		},

		_printVoucherPromise: function (Gp_num, Fmname) {
			var that = this;
			return new Promise(async function (resolve, reject) {
				oModel.read("/SmartformSet(Gpassno='" + Gp_num + "',Formname='" + Fmname + "')/$value", {
					method: "GET",
					success: function (data, response) {

						var img = response.requestUri;
						window.open(img);
						// that._pdfViewer.setSource(img);
						// that._pdfViewer.setTitle("Payment Requisition Slip " + Gp_num);
						// that._pdfViewer.open();
						resolve(false);

					},
					error: function (cc, vv) {
						// sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");
						resolve(cc);
					}

				});
			})

		},

		fnPrintVoucher: async function () {
			//check GP from
			let sGPNumFrom = this.getView().byId("gp_num");
			let sGPNumTo = this.getView().byId("gp_num_to");
			let sGPFromValueState = sGPNumFrom.getValueState();
			let sGPFromValue = sGPNumFrom.getValue();
			let sGPToValue = sGPNumTo.getValue();
			let aGPNumber = [];
			let FormName = "PAYMENT";

			var that = this;

			if ((sGPFromValueState !== "None" || !sGPFromValue)) {
				MessageBox.error("'Gate Pass From' is Mandatory, Enter correct Gate Pass number.");
				return;
			}

			// generate GP number sequance if GP number To entered.

			if (sGPFromValue && sGPToValue) {
				let iGPFromValue = parseInt(sGPFromValue);
				let iGPToValue = parseInt(sGPToValue);
				let aPrintPromises = [];
				aGPNumber = this._generateSequence(iGPFromValue, iGPToValue);

				for (let j = 0; j < aGPNumber.length; j++) {
					aPrintPromises.push(
						that._printVoucherPromise(aGPNumber[j], FormName)
					)
				}
				var msg = "<p><strong>Failed to print vouchers for:</strong></p>" +
					"<ul>";
				await Promise.all(aPrintPromises).then((printVoucher) => {
					console.log(printVoucher);
					if (printVoucher.length) {
						for (const resp of printVoucher) {
							if (resp) {
								let error = JSON.parse(resp?.response?.body);
								let errorMsg = error.error.message.value;
								msg = msg + `<li>${errorMsg}</li>`
							}
						}
						let bDisplayError = printVoucher.some(item => item);

						if (bDisplayError) {
							MessageBox.error("Unable to load data.", {
								title: "Error",
								id: "messageBoxId2",
								details: msg + "</ul>",
								contentWidth: "100px",
								styleClass: sResponsivePaddingClasses,
								dependentOn: this.getView()
							});
						}
					}
					BusyIndicator.hide();
				})

			} else if (sGPFromValue) {
				let aPrintPromises = [];
				aGPNumber = [sGPFromValue];
				BusyIndicator.show();

				for (let j = 0; j < aGPNumber.length; j++) {
					aPrintPromises.push(
						that._printVoucherPromise(aGPNumber[j], FormName)
					)
				}
				var msg = "<p><strong>Failed to print vouchers for:</strong></p>" +
					"<ul>";
				await Promise.all(aPrintPromises).then((printVoucher) => {
					console.log(printVoucher);
					if (printVoucher.length) {
						for (const resp of printVoucher) {
							if (resp) {
								let error = JSON.parse(resp?.response?.body);
								let errorMsg = error.error.message.value;
								msg = msg + `<li>${errorMsg}</li>`
							}
						}
						let bDisplayError = printVoucher.some(item => item);
						if (bDisplayError) {
							MessageBox.error("Unable to load data.", {
								title: "Error",
								id: "messageBoxId2",
								details: msg + "</ul>",
								contentWidth: "100px",
								styleClass: sResponsivePaddingClasses,
								dependentOn: this.getView()
							});
						}
					}
					BusyIndicator.hide();
				})
			}
		},

		_generateSequence: function (start, end) {
			let sequence = [];
			for (let i = start; i <= end; i++) {
				sequence.push(i.toString());
			}
			return sequence;
		},

		printGP: function () {
			/*	var html = new sap.ui.core.HTML();
				var oPanel = new sap.m.Panel();*/
			var that = this;
			var Gp_num = this.byId("gp_num").getValue();
			var Fmname = "GATEPASS";

			var Regex = '^[0-9]{10}$';

			if (!Gp_num.match(Regex)) {
				this.getView().byId("gp_num").setValueState("Error");
				sap.m.MessageToast.show("Gate Pass No. must be 10 digit without any Characters");
			} else {
				this.getView().byId("gp_num").setValueState("None");

				if (Gp_num == "") {
					sap.m.MessageToast.show("Gate Passs Number is Mandatory");
				} else {
					oModel.read("/SmartformSet(Gpassno='" + Gp_num + "',Formname='" + Fmname + "')/$value", {
						method: "GET",
						success: function (data, response) {

							var img = response.requestUri;
							// var ds = data.Url;

							/*	html.setContent("<iframe src=" + ds + " width='700' height='700'></iframe>");

								oPanel.addContent(html);
								oPanel.placeAt("content1");*/

							//	var oHtml = that.getView().byId("printform").setSource(img);
							// oHtml.setContent("<iframe src='" + ds + "' height='700' width='1300'></iframe>");

							that._pdfViewer.setSource(img);
							that._pdfViewer.setTitle("Gate Pass Form");
							that._pdfViewer.open();

						},
						error: function (cc, vv) {
							sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");

						}

					});

				}
			}
		},
		printVoucher: function () {
			// var html = new sap.ui.core.HTML();
			// var oPanel = new sap.m.Panel();
			var that = this;
			var Gp_num = this.byId("gp_num").getValue();
			var Fmname = "PAYMENT";

			var Regex = '^[0-9]{10}$';

			if (!Gp_num.match(Regex)) {
				this.getView().byId("gp_num").setValueState("Error");
				sap.m.MessageToast.show("Gate Pass No. must be 10 digit without any Characters");
			} else {
				this.getView().byId("gp_num").setValueState("None");
				if (Gp_num == "") {
					sap.m.MessageToast.show("Gate Passs Number is Mandatory");
				} else {
					oModel.read("/SmartformSet(Gpassno='" + Gp_num + "',Formname='" + Fmname + "')", {
						method: "GET",
						success: function (data, response) {
							var img = response.requestUri;
							var msg = data.Message;

							if (msg == "") {

								oModel.read("/SmartformSet(Gpassno='" + Gp_num + "',Formname='" + Fmname + "')/$value", {
									method: "GET",
									success: function (data1, response1) {
										var img1 = response1.requestUri;
										that._pdfViewer.setSource(img1);
										that._pdfViewer.setTitle("Payment Requisition Slip");
										that._pdfViewer.open();

									},
									error: function (cc, vv) {
										sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");

									}

								});

							} else {
								sap.m.MessageToast.show(msg);
							}
							// var ds = data.Url;
							// 	oModel.read("/SmartformSet(Gpassno='" + Gp_num + "',Formname='" + Fmname + "')/$value", {

							/*	html.setContent("<iframe src=" + ds + " width='700' height='700'></iframe>");

								oPanel.addContent(html);
								oPanel.placeAt("content1");*/

							//	var oHtml = that.getView().byId("printform").setSource(img);
							// oHtml.setContent("<iframe src='" + ds + "' height='700' width='1300'></iframe>");

						},
						error: function (cc, vv) {
							sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");

						}

					});

				}
			}
		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.PrintForm
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.PrintForm
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.PrintForm
		 */
		//	onExit: function() {
		//
		//	}

	});

});