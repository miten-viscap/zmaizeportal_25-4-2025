sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/m/PDFViewer"
], function (Controller, History, UIComponent, MessageBox, PDFViewer) {
	"use strict";
	var oModel;
	var FlagVal;
	var FlagVal1;
	var Brok_name;
	var Vend_code;
	var Vend_name;
	var Plant_num;
	var GP_Num;
	var Podate;
	var matcode;
	var BrokerNum;
	var QualityDeduct;
	// var Specs_quality;
	var InspectionLot;
	var Matdoc;
	var GunnyFlagVal;
	var UnloadFlagVal;
	var PayOnWeight;

	return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.ChanDispScreen", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.ChanDispScreen
		 */
		onInit: function () {
			this.byId("Billbags").setValue("0.00");

			var serviceURl = "/sap/opu/odata/sap/ZGW_GATEPASS_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(serviceURl);
			this.getView().setModel(oModel);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ChanDispScreen").attachPatternMatched(this._onObjectMatched, this);

			this._pdfViewer = new PDFViewer();
			this.getView().addDependent(this._pdfViewer);

		},
		onNavBack: function () {
			this.byId("labNoBags").setProperty("required", false);
			this.byId("labMandirec").setProperty("required", false);
			this.byId("lanNoUnloadBags").setProperty("required", false);

			var url = window.localStorage.getItem("key1");
			var data = url.split("/")[1];
			var data1 = url.split("/")[2];
			var data2 = url.split("/")[3];
			var data3 = url.split("/")[4];
			var data4 = url.split("/")[5];
			var data5 = url.split("/")[6];
			var data6 = url.split("/")[7];
			var data7 = url.split("/")[8];
			var data8 = url.split("/")[9];
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("ChaDispGpList", {
					invoicePath: data,
					invoicePath1: data1,
					invoicePath2: data2,
					invoicePath3: data3,
					invoicePath5: data4,
					invoicePath6: data5,
					invoicePath7: data6,
					invoicePath8: data7,
					invoicePath9: data8
				});
			}
			/*

				var oRouter = UIComponent.getRouterFor(this);
				var url = window.localStorage.getItem("key1");
				var data = url.split("/")[1];
				var data1 = url.split("/")[2];
				var data2 = url.split("/")[3];
				var data3 = url.split("/")[4];
				var data4 = url.split("/")[5];
				var data5 = url.split("/")[6];
				var data6 = url.split("/")[7];
				var data7 = url.split("/")[8];

				var sPreviousHash;
				// var sPreviousHash; = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {

					// oRouter.navTo(url);
					oRouter.navTo("ChaDispGpList", {
						// invoicePath: oEntry
						invoicePath: data,
						invoicePath1: data1,
						invoicePath2: data2,
						invoicePath3: data3,
						invoicePath5: data4,
						invoicePath6: data5,
						invoicePath7: data6,
						invoicePath9: data7

					});
				}
		
			*/
		},
		inputlivebags: function () {

			var fValue = this.byId("Billbags").getValue();
			var regex = "^[0-9]*$";
			if (fValue.match(regex)) {
				this.byId("Billbags").setValueState("None");

			} else {
				this.byId("Billbags").setValueState("Error");
			}

		},

		inputlivebags2: function () {

			var fValue = this.byId("RejectedBags").getValue();
			var regex = "^[0-9]*$";
			if (fValue.match(regex)) {
				this.byId("RejectedBags").setValueState("None");

			} else {
				this.byId("RejectedBags").setValueState("Error");
			}

		},
		inputlivebags3: function () {

			var fValue = this.byId("TornedBags").getValue();
			var regex = "^[0-9]*$";
			if (fValue.match(regex)) {
				this.byId("TornedBags").setValueState("None");

			} else {
				this.byId("TornedBags").setValueState("Error");
			}

		},
		_onObjectMatched: function (oEvent) {

			this.SetZeroVal();

			GP_Num = oEvent.getParameter("arguments").GPManifest;
			this.byId("GatePassNo").setValue(GP_Num);

			matcode = oEvent.getParameter("arguments").SelMatCode;

			var Flag_ChaDisp = oEvent.getParameter("arguments").FlagChaDisp;
			if (Flag_ChaDisp == "X") {
				this.AllFieldEditableTrue();
			} else {
				this.AllFieldEditableFalse();
			}

			if (matcode === "110029") {
				this.byId("labNoBags").setProperty("required", true);
				this.byId("labMandirec").setProperty("required", true);
				this.byId("lanNoUnloadBags").setProperty("required", true);
			}

			var oThis = this;
			oModel.read("/GatepassdtlSet(Gpassno='" + GP_Num + "')", {
				method: "GET",
				success: function (data, response) {
					var Po_num = data.Ebeln;
					Plant_num = data.Werks;
					Brok_name = data.Brokername;
					Podate = data.Bedat;
					matcode = data.Matnr;
					BrokerNum = data.Brokerno;
					var LR_grno = data.TranspLrNo;
					var Vehi_num = data.Vehicleno;
					var Trans = data.Transporter;
					var Station = data.Station;
					var StationDesc = data.StName;
					Vend_code = data.Vendorno;
					Vend_name = data.Vendorname;
					var Vend_Concate = Vend_code + " " + Vend_name;
					var Gp_date = data.Gpassdt;

					var Party_bill = data.Bilno;
					var Party_date = data.Bildt;
					var Bill_wt = data.Bilwt;
					var Bill_bag = data.Bilbag;
					var Wt_slipno = data.WtslipNo;
					var Wt_slipdate = data.WtslipDt;

					var Storage_loc = data.StorageLocation;
					var Unload_wt = data.WtslipQty;
					var No_Unload_bags = data.WtslipBag;
					var Rej_wt = data.Rejwt;
					var Rej_bags = data.RejBag;
					var Torn_bag = data.Tornbag;
					var Avg_wt = data.Bagavgwt;
					var Mat_doc = data.MatDoc;

					var Mandi_no = data.MandiNo;
					var Mandi_tax = data.MandiTax;
					var Other_deduct = data.OtherDed;
					var Any_other = data.AnyOther;
					var Rate_diff = data.RateDifference;
					var usg_desc = data.UsageDecision;
					var remarks = data.Message;

					QualityDeduct = data.NoQltyDeduction;
					PayOnWeight = data.PaymentOnPbw;
					GunnyFlagVal = data.NoGunnyDed;
					UnloadFlagVal = data.NoUnldChargeDed;

					// Specs_quality = data.QltyPar;
					var Doc_yr = data.DocYear;
					var Insp_LotNo = data.Insplot;

					oThis.byId("ipPONo").setValue(Po_num);
					var dateFormat = sap.ui.core.format.DateFormat.getInstance({
						pattern: "dd/MM/yyyy"
					});
					var dateFormatted = dateFormat.format(new Date(Podate));
					oThis.byId("Po_date").setValue(dateFormatted);
					oThis.byId("BrokName").setValue(Brok_name);
					oThis.byId("LRGRno").setValue(LR_grno);
					oThis.byId("Truckno").setValue(Vehi_num);
					oThis.byId("TransDetail").setValue(Trans);
					oThis.byId("Station").setValue(Station);
					// oThis.byId("GatepassDate").setValue(Vend_code);
					oThis.byId("VendName").setValue(Vend_Concate);

					oThis.byId("GatepassDate").setValue(Gp_date);
					oThis.byId("PartyBill").setValue(Party_bill);
					oThis.byId("PartyDate").setValue(Party_date);
					oThis.byId("BillWeight").setValue(Bill_wt);
					oThis.byId("Billbags").setValue(Bill_bag);
					oThis.byId("WeightSlipNo").setValue(Wt_slipno);
					oThis.byId("WtSlipDate").setValue(Wt_slipdate);
					oThis.byId("Store_loc").setValue(Storage_loc);

					oThis.byId("UnloadedWeight").setValue(Unload_wt);
					oThis.byId("UnloadBags").setValue(No_Unload_bags);
					oThis.byId("RejectedWeight").setValue(Rej_wt);
					oThis.byId("RejectedBags").setValue(Rej_bags);
					oThis.byId("TornedBags").setValue(Torn_bag);
					oThis.byId("Avg_wt").setValue(Avg_wt);
					oThis.byId("MatDoc").setValue(Mat_doc);

					oThis.byId("ReceiptNum").setValue(Mandi_no);
					oThis.byId("MandiTax").setValue(Mandi_tax);
					oThis.byId("OtherDeduct").setValue(Other_deduct);
					oThis.byId("AnyOtherDeduct").setValue(Any_other);
					oThis.byId("RateDiff").setValue(Rate_diff);
					oThis.byId("remarksany").setValue(remarks);

					if (QualityDeduct == "X") {
						oThis.byId("Quality_deduct").setSelected(true);
					} else {
						oThis.byId("Quality_deduct").setSelected(false);
					}

					if (PayOnWeight == "X") {
						oThis.byId("Pay_Weight").setSelected(true);
					} else {
						oThis.byId("Pay_Weight").setSelected(false);
					}

					if (GunnyFlagVal == "X") {
						oThis.byId("GunnyBag_deduct").setSelected(true);
					} else {
						oThis.byId("GunnyBag_deduct").setSelected(false);
					}

					if (UnloadFlagVal == "X") {
						oThis.byId("UnloadCharge_deduct").setSelected(true);
					} else {
						oThis.byId("UnloadCharge_deduct").setSelected(false);
					}

					if (usg_desc == "A") {
						var AcceptA = "A-Accept";
						oThis.byId("UsageDes").setValue(AcceptA);
					} else {
						oThis.byId("UsageDes").setValue(usg_desc);
					}

					if (Doc_yr == "0000") {
						oThis.byId("DocYr").setValue("");
					} else {
						oThis.byId("DocYr").setValue(Doc_yr);
					}
					if (Insp_LotNo == "000000000000") {
						oThis.byId("InspLot").setValue("");
					} else {
						oThis.byId("InspLot").setValue(Insp_LotNo);
					}
					//Checkbox
					/*	if (QualityDeduct == "X") {
							// Check box apply true
							oThis.byId("Quality_deduct").setSelected(true);
						} else {
							oThis.byId("Quality_deduct").setSelected(false);
						}
						if (Specs_quality == "X") {
							oThis.byId("SpecsQuality").setSelected(true);
						} else {
							// Check box apply false
							oThis.byId("SpecsQuality").setSelected(false);
						}*/
				},
				error: function (cc, vv) {
					sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");
				}
			});

		},

		CheckBox1: function () {
			var QualityDeduct1 = this.byId("Quality_deduct");

			if (QualityDeduct1.getSelected()) {
				FlagVal = "X";
			} else {
				FlagVal = "";
			}
		},
		CheBoxPay: function () {
			var PayWeight = this.byId("Pay_Weight");

			if (PayWeight.getSelected()) {
				PayOnWeight = "X";
			} else {
				PayOnWeight = "";
			}
		},
		CheckBox2: function () {
			var Gunny = this.byId("GunnyBag_deduct");

			if (Gunny.getSelected()) {
				GunnyFlagVal = "X";
			} else {
				GunnyFlagVal = "";
			}
		},
		CheckBox3: function () {
			var Unload = this.byId("UnloadCharge_deduct");

			if (Unload.getSelected()) {
				UnloadFlagVal = "X";
			} else {
				UnloadFlagVal = "";
			}
		},
		// CheckBox2: function () {
		// 	var POSpecific = this.byId("SpecsQuality");
		// 	if (POSpecific.getSelected()) {
		// 		FlagVal1 = "X";
		// 	} else {
		// 		FlagVal1 = "";
		// 	}
		// },

		onInputDecimalChange: function (oEvent) {

			// var textinp1 = this.byId("BillWeight").getValue();
			// var oThis = this;
			/*	var view = this.getView();
				var inputs = [
					view.byId("BillWeight"),
					view.byId("Billbags"),
					view.byId("TornedBags"),
					view.byId("RejectedWeight")
				];
				jQuery.each(inputs, function (i, input) {
					if (input.getValue().match(reg)) {
						input.setValueState("None");
						//sap.m.MessageToast.show("Please Enter the Mandatory Fields!!!");
					} else {
						input.setValueState("Error");
					}
				});*/
			var fValue = this.byId("BillWeight").getValue();
			if (fValue != "") {
				this.byId("BillWeight").setMaxLength(11);
				var num = fValue * 1.00;
				var number = num.toFixed(3);
				this.byId("BillWeight").setValue(number); // Set the formatted value on the text field
				this.byId("BillWeight").setMaxLength(8);

			} else {
				this.byId("Billbags").setValue("0.00");
			}

		},
		onInputDecimalChange1: function (oEvent) {

			var fValue = this.byId("Billbags").getValue();
			if (fValue != "") {
				this.byId("Billbags").setMaxLength(11);
				var num = fValue * 1.00;
				var number = num.toFixed(3);
				this.byId("Billbags").setValue(number); // Set the formatted value on the text field
				this.byId("Billbags").setMaxLength(8);

			} else {
				this.byId("Billbags").setValue("0.00");

			}
			// var reg = /^(\d*\.\d{2})+$/;
			// var ip2 = this.byId("Billbags");
			// if (ip2.getValue().match(reg)) {
			// 	ip2.setValueState("None");
			// 	// this.byId("BillWeight").setValueState("Error");
			// } else {
			// 	ip2.setValueState("Error");
			// }
		},
		onInputDecimalChange2: function (oEvent) {

			var fValue = this.byId("TornedBags").getValue();
			if (fValue != "") {
				this.byId("TornedBags").setMaxLength(11);
				var num = fValue * 1.00;
				var number = num.toFixed(3);
				this.byId("TornedBags").setValue(number); // Set the formatted value on the text field
				this.byId("TornedBags").setMaxLength(8);

			} else {
				this.byId("TornedBags").setValue("0.00");
			}
		},
		onInputDecimalChange3: function (oEvent) {
			var fValue = this.byId("RejectedWeight").getValue();
			if (fValue != "") {
				this.byId("RejectedWeight").setMaxLength(11);
				var num = fValue * 1.00;
				var number = num.toFixed(3);
				this.byId("RejectedWeight").setValue(number); // Set the formatted value on the text field
				this.byId("RejectedWeight").setMaxLength(8);
			} else {
				this.byId("RejectedWeight").setValue("0.00");
			}

		},
		Stor_caps: function () {
			var stora_loc = this.byId("Store_loc").getValue().toUpperCase();
			this.byId("Store_loc").setValue(stora_loc);

		},
		DivAvgWt: function () {
			/*

						var fValue = this.byId("UnloadBags").getValue();
						var regex = "^[0-9]*$";
						if (fValue.match(regex)) {
							this.byId("UnloadBags").setValueState("None");
							var Unload_Val = this.byId("UnloadedWeight").getValue();
							var Unload_BagVal = this.byId("UnloadBags").getValue();

							var AvgWeight = (+Unload_Val / +Unload_BagVal);
							var AvgDecimal = AvgWeight.toFixed(3);
							this.byId("Avg_wt").setValue(AvgDecimal);
						} else {
							this.byId("UnloadBags").setValueState("Error");
						}

					*/
		},
		GpLivedate: function () {

			var gpdate = this.byId("GatepassDate").getValue();
			this.byId("WtSlipDate").setValue(gpdate);
		},
		OnSaveBtn: function () {

			var matdocno = this.byId("MatDoc").getValue();
			if (matdocno == "") {
				if (matcode === "110029") {
					var VBillBags = this.byId("Billbags").getValue();
					var RecNum = this.byId("ReceiptNum").getValue();
					var UnloBags = this.byId("UnloadBags").getValue();
					if (VBillBags === "0.00") {
						this.byId("Billbags").setValueState("Error");
						this.byId("ReceiptNum").setValueState("None");
						this.byId("UnloadBags").setValueState("None");
						this.byId("ReceiptNum").setValue("");
						this.byId("UnloadBags").setValue("");
						return;
					}
					if (RecNum === "") {
						this.byId("ReceiptNum").setValueState("Error");
						this.byId("Billbags").setValueState("None");
						this.byId("UnloadBags").setValueState("None");
						this.byId("Billbags").setValue("0.00");
						this.byId("UnloadBags").setValu("");
						return;
					}
					if (UnloBags === "") {
						this.byId("UnloadBags").setValueState("Error");
						this.byId("Billbags").setValueState("None");
						this.byId("ReceiptNum").setValueState("None");
						this.byId("Billbags").setValue("0.00");
						this.byId("ReceiptNum").setValue("");

						return;
					}

					//

					this.byId("Billbags").setValueState("None");
					this.byId("ReceiptNum").setValueState("None");
					this.byId("UnloadBags").setValueState("None");

					var oThis = this;
					var view = this.getView();
					var inputs = [
						view.byId("GatePassNo"),
						view.byId("ipPONo"),
						view.byId("GatepassDate"),
						view.byId("PartyBill"),
						// view.byId("VendName"),
						view.byId("VendName"),
						view.byId("WeightSlipNo"),
						//	view.byId("WtSlipDate"),
						view.byId("PartyDate"),
						view.byId("BillWeight")
						// view.byId("Billbags"),
						// view.byId("ReceiptNum")
					];
					jQuery.each(inputs, function (i, input) {
						if (!input.getValue()) {
							input.setValueState("Error");
							//sap.m.MessageToast.show("Please Enter the Mandatory Fields!!!");
						} else {
							input.setValueState("None");
						}

					});
					var canContinue = true;
					jQuery.each(inputs, function (i, input) {
						if (input.getValueState() === "Error") {
							canContinue = false;
							return false;
						}
					});
					if (!canContinue) {
						sap.m.MessageToast.show("Please Fill all Mandatory Fields");
					} else {
						// sap.m.MessageToast.show("Now you can perform Goods Movement");
						// this.byId("BtnGoodMov").setVisible(true);
						//	Column 1
						var Gp_num = this.byId("GatePassNo");
						var PO_num = this.byId("ipPONo");
						//	var Brok_name = this.byId("BrokName");
						//	var Vendor_name = this.byId("PartName");
						var Transport_num = this.byId("LRGRno");
						var vehicle_num = this.byId("Truckno");
						var Station_num = this.byId("Station");
						var Trans_Vendor_code = this.byId("TransDetail");
						//	var Trans-Vendor_name = this.byId("VendName");

						// Column 2

						var Gp_date = this.byId("GatepassDate").getValue();
						var PartyBill_num = this.byId("PartyBill");
						var PartyBill_date = this.byId("PartyDate").getValue();
						var Wt_PartyBill = this.byId("BillWeight");
						var No_Bags = this.byId("Billbags");
						var Wt_SlipNO = this.byId("WeightSlipNo");
						var Wt_Slipdate = this.byId("WtSlipDate").getValue();
						var Store_Loc = this.byId("Store_loc");

						// Column 3
						var Unload_Wt = this.byId("UnloadedWeight");
						var Unload_Bags = this.byId("UnloadBags");
						var Rejected_Wt = this.byId("RejectedWeight");
						var Rejected_bags_Num = this.byId("RejectedBags");
						var Torned_Bags_Num = this.byId("TornedBags");
						var Avg_wt_bags = this.byId("Avg_wt");

						// Column 4&nbsp;
						var Mandi_Rec_num = this.byId("ReceiptNum");
						var Mandi_tax_deduct = this.byId("MandiTax");
						var Other_Deduct = this.byId("OtherDeduct");
						var Any_Other_deduct = this.byId("AnyOtherDeduct");
						var Rate_Diff = this.byId("RateDiff");
						var Remarks = this.byId("remarksany");
						// date check

						var sDate = "1111-11-11T00:00:00";
						//var day = new Date(data.startDate).getDate();
						var dateFormat = sap.ui.core.format.DateFormat.getInstance({
							pattern: "yyyy-MM-ddThh:mm:ss"
						});
						var dateFormatted = dateFormat.format(new Date(sDate));

						/*	if (Gp_date == "") {
								Gp_date = dateFormatted;
							}*/
						if (PartyBill_date == "") {
							PartyBill_date = dateFormatted;
						}
						/*	if (Wt_Slipdate == "") {
								Wt_Slipdate = dateFormatted;
							}*/
						if (PartyBill_date !== "") { //Gp_date !== "" || Wt_Slipdate !== "" ||&nbsp;

							var oEntry = {};

							//Column1
							var QualityDeduct1 = this.byId("Quality_deduct").getSelected();
							if (QualityDeduct1 == false) {
								FlagVal = "";
							} else {
								FlagVal = "X";
							}
							var PAyWeight = this.byId("Pay_Weight").getSelected();
							if (PAyWeight == false) {
								PayOnWeight = "";
							} else {
								PayOnWeight = "X";
							}
							var Gunny = this.byId("GunnyBag_deduct").getSelected();
							if (Gunny == false) {
								GunnyFlagVal = "";
							} else {
								GunnyFlagVal = "X";
							}
							var Unload = this.byId("UnloadCharge_deduct").getSelected();
							if (Unload == false) {
								UnloadFlagVal = "";

							} else {
								UnloadFlagVal = "X";
							}
							// NoUnldChargeDed
							// PaymentOnPbw
							// NoGunnyDed
							oEntry.QltyPar = FlagVal1;
							oEntry.NoQltyDeduction = FlagVal;
							oEntry.NoGunnyDed = GunnyFlagVal;
							oEntry.NoUnldChargeDed = UnloadFlagVal;
							oEntry.PaymentOnPbw = PayOnWeight;
							oEntry.Werks = Plant_num;
							oEntry.Bedat = Podate;
							oEntry.Matnr = matcode;
							oEntry.Gpassno = Gp_num.getValue();
							oEntry.Ebeln = PO_num.getValue();
							oEntry.Brokerno = BrokerNum;
							oEntry.Brokername = Brok_name;
							oEntry.Vendorno = Vend_code;
							oEntry.Vendorname = Vend_name;

							oEntry.TranspLrNo = Transport_num.getValue();
							oEntry.Vehicleno = vehicle_num.getValue();
							// oEntry.Station = Station_num.getValue();
							if (Station_num.getValue() === "") {
								sap.m.MessageBox.error("Station code is mandatory. Kindly select station code first.");
								return false;
							}
							oEntry.StName = this.desc;
							oEntry.Station = this.key;
							oEntry.Transporter = Trans_Vendor_code.getValue();

							//Column2
							oEntry.Gpassdt = Gp_date;
							oEntry.Bilno = PartyBill_num.getValue();
							oEntry.Bildt = PartyBill_date;
							oEntry.Bilwt = Wt_PartyBill.getValue();
							oEntry.Bilbag = No_Bags.getValue();
							oEntry.WtslipNo = Wt_SlipNO.getValue();
							oEntry.WtslipDt = Wt_Slipdate;
							oEntry.StorageLocation = Store_Loc.getValue();
							// oEntry.DescOfSloc = Storage_Lgobe;

							//Column3
							oEntry.WtslipQty = Unload_Wt.getValue();
							oEntry.WtslipBag = Unload_Bags.getValue();
							oEntry.Rejwt = Rejected_Wt.getValue();
							oEntry.RejBag = Rejected_bags_Num.getValue();
							oEntry.Tornbag = Torned_Bags_Num.getValue();
							oEntry.Bagavgwt = Avg_wt_bags.getValue();

							//Column4
							oEntry.MandiNo = Mandi_Rec_num.getValue();
							oEntry.MandiTax = Mandi_tax_deduct.getValue();
							oEntry.OtherDed = Other_Deduct.getValue();
							oEntry.AnyOther = Any_Other_deduct.getValue();
							oEntry.RateDifference = Rate_Diff.getValue();
							oEntry.Message = Remarks.getValue();
							// oEntry.CreateDate = "1111-11-11T00:00:00";
							// oEntry.CreateTime = "PT11H00M00S";

							var BillWeightzero = this.byId("BillWeight").getValue();
							var Billbagszero = this.byId("Billbags").getValue();

							//var Zeroregx = ;

							if (BillWeightzero == 0) {
								sap.m.MessageToast.show("Bill Weight can't be kept Zero");
							}
							/*else if (Billbagszero == 0) {
								sap.m.MessageToast.show("Bill Bags can't be kept Zero");
							}*/
							else {
								oModel.update("/GatepassdtlSet('" + GP_Num + "')", oEntry, {
									method: "PUT",
									success: function (oData, oResponse) {

										var parser = new DOMParser();
										var res = oResponse.headers["sap-message"];

										if (res == undefined) {

											sap.m.MessageToast.show("Data Has been Successfully Created");
											oThis.getView().byId("Savebtn").setEnabled(false);
											oThis.getView().byId("Cancelbtn").setEnabled(false);
											oThis.FieldEditFalseSave();

										} else {

											var xmlDoc = parser.parseFromString(res, "text/xml");
											var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
											// sap.m.MessageToast.show(Number);
											MessageBox.error(Number);

										}

										//	oThis.OnCancelBtn();
										// var savebtn = this.getView().byId("GPSave");
										// savebtn.setEnaled(false);

										// var cancelbtn = this.getView().byId("GpCancel");
										// cancelbtn.setEnaled(false);

									},
									error: function (cc, vv) {
										sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");
									}
								});
							}
						}

					}

					/*
						//save all the fields in table and generate gate pass num and then lock all the fields.
						//this function will be disable.
						//	var A1 = this.getView().byId("").getValue();

						var GPNum = this.byId("GatePassNo").getValue();
						var PONum = this.byId("ipPONo").getValue();
						var BrokerName = this.byId("BrokName").getValue();
						var PartyName = this.byId("PartName").getValue();
						var VendorCode = this.byId("VendCode").getValue();
						var VendorName = this.byId("VendName").getValue();
						var WeightSlip = this.byId("WeightSlipNo").getValue();
						var WeightSlipDate = this.byId("WtSlipDate").getValue();
						var UnloadWeight = this.byId("UnloadedWeight").getValue();
						var rateDiff = this.byId("RateDiff").getValue();

						if (GPNum == "" || PONum == "" || BrokerName == "" || PartyName == "" || VendorCode == "" || VendorName == "" || WeightSlip == "" ||
							WeightSlipDate == "" || UnloadWeight == "" || rateDiff == "") {
							sap.m.MessageToast.show("Please Fill all the Mandatory fields");
							
						} else {
							this.byId("BtnGoodMov").setVisible(true);
						}

					*/

					//

				} else {

					this.byId("Billbags").setValueState("None");
					this.byId("ReceiptNum").setValueState("None");
					this.byId("UnloadBags").setValueState("None");

					var oThis = this;
					var view = this.getView();
					var inputs = [
						view.byId("GatePassNo"),
						view.byId("ipPONo"),
						view.byId("GatepassDate"),
						view.byId("PartyBill"),
						// view.byId("VendName"),
						view.byId("VendName"),
						view.byId("WeightSlipNo"),
						//	view.byId("WtSlipDate"),
						view.byId("PartyDate"),
						view.byId("BillWeight"),
						view.byId("Billbags"),
						// view.byId("ReceiptNum")
					];
					jQuery.each(inputs, function (i, input) {
						if (!input.getValue()) {
							input.setValueState("Error");
							//sap.m.MessageToast.show("Please Enter the Mandatory Fields!!!");
						} else {
							input.setValueState("None");
						}

					});
					var canContinue = true;
					jQuery.each(inputs, function (i, input) {
						if (input.getValueState() === "Error") {
							canContinue = false;
							return false;
						}
					});
					if (!canContinue) {
						sap.m.MessageToast.show("Please Fill all Mandatory Fields");
					} else {
						// sap.m.MessageToast.show("Now you can perform Goods Movement");
						// this.byId("BtnGoodMov").setVisible(true);
						//	Column 1
						var Gp_num = this.byId("GatePassNo");
						var PO_num = this.byId("ipPONo");
						//	var Brok_name = this.byId("BrokName");
						//	var Vendor_name = this.byId("PartName");
						var Transport_num = this.byId("LRGRno");
						var vehicle_num = this.byId("Truckno");
						var Station_num = this.byId("Station");
						var Trans_Vendor_code = this.byId("TransDetail");
						//	var Trans-Vendor_name = this.byId("VendName");

						// Column 2

						var Gp_date = this.byId("GatepassDate").getValue();
						var PartyBill_num = this.byId("PartyBill");
						var PartyBill_date = this.byId("PartyDate").getValue();
						var Wt_PartyBill = this.byId("BillWeight");
						var No_Bags = this.byId("Billbags");
						var Wt_SlipNO = this.byId("WeightSlipNo");
						var Wt_Slipdate = this.byId("WtSlipDate").getValue();
						var Store_Loc = this.byId("Store_loc");

						// Column 3
						var Unload_Wt = this.byId("UnloadedWeight");
						var Unload_Bags = this.byId("UnloadBags");
						var Rejected_Wt = this.byId("RejectedWeight");
						var Rejected_bags_Num = this.byId("RejectedBags");
						var Torned_Bags_Num = this.byId("TornedBags");
						var Avg_wt_bags = this.byId("Avg_wt");

						// Column 4&nbsp;
						var Mandi_Rec_num = this.byId("ReceiptNum");
						var Mandi_tax_deduct = this.byId("MandiTax");
						var Other_Deduct = this.byId("OtherDeduct");
						var Any_Other_deduct = this.byId("AnyOtherDeduct");
						var Rate_Diff = this.byId("RateDiff");
						var Remarks = this.byId("remarksany");
						// date check

						var sDate = "1111-11-11T00:00:00";
						//var day = new Date(data.startDate).getDate();
						var dateFormat = sap.ui.core.format.DateFormat.getInstance({
							pattern: "yyyy-MM-ddThh:mm:ss"
						});
						var dateFormatted = dateFormat.format(new Date(sDate));

						/*	if (Gp_date == "") {
								Gp_date = dateFormatted;
							}*/
						if (PartyBill_date == "") {
							PartyBill_date = dateFormatted;
						}
						/*	if (Wt_Slipdate == "") {
								Wt_Slipdate = dateFormatted;
							}*/
						if (PartyBill_date !== "") { //Gp_date !== "" || Wt_Slipdate !== "" ||&nbsp;

							var oEntry = {};

							//Column1
							var QualityDeduct1 = this.byId("Quality_deduct").getSelected();
							if (QualityDeduct1 == false) {
								FlagVal = "";
							} else {
								FlagVal = "X";
							}
							var PAyWeight = this.byId("Pay_Weight").getSelected();
							if (PAyWeight == false) {
								PayOnWeight = "";
							} else {
								PayOnWeight = "X";
							}
							var Gunny = this.byId("GunnyBag_deduct").getSelected();
							if (Gunny == false) {
								GunnyFlagVal = "";
							} else {
								GunnyFlagVal = "X";
							}
							var Unload = this.byId("UnloadCharge_deduct").getSelected();
							if (Unload == false) {
								UnloadFlagVal = "";

							} else {
								UnloadFlagVal = "X";
							}
							// NoUnldChargeDed
							// PaymentOnPbw
							// NoGunnyDed
							oEntry.QltyPar = FlagVal1;
							oEntry.NoQltyDeduction = FlagVal;
							oEntry.NoGunnyDed = GunnyFlagVal;
							oEntry.NoUnldChargeDed = UnloadFlagVal;
							oEntry.PaymentOnPbw = PayOnWeight;
							oEntry.Werks = Plant_num;
							oEntry.Bedat = Podate;
							oEntry.Matnr = matcode;
							oEntry.Gpassno = Gp_num.getValue();
							oEntry.Ebeln = PO_num.getValue();
							oEntry.Brokerno = BrokerNum;
							oEntry.Brokername = Brok_name;
							oEntry.Vendorno = Vend_code;
							oEntry.Vendorname = Vend_name;

							oEntry.TranspLrNo = Transport_num.getValue();
							oEntry.Vehicleno = vehicle_num.getValue();
							// oEntry.Station = Station_num.getValue();
							if (Station_num.getValue() === "") {
								sap.m.MessageBox.error("Station code is mandatory. Kindly select station code first.");
								return false;
							}
							oEntry.StName = this.desc;
							oEntry.Station = this.key;
							oEntry.Transporter = Trans_Vendor_code.getValue();

							//Column2
							oEntry.Gpassdt = Gp_date;
							oEntry.Bilno = PartyBill_num.getValue();
							oEntry.Bildt = PartyBill_date;
							oEntry.Bilwt = Wt_PartyBill.getValue();
							oEntry.Bilbag = No_Bags.getValue();
							oEntry.WtslipNo = Wt_SlipNO.getValue();
							oEntry.WtslipDt = Wt_Slipdate;
							oEntry.StorageLocation = Store_Loc.getValue();
							// oEntry.DescOfSloc = Storage_Lgobe;

							//Column3
							oEntry.WtslipQty = Unload_Wt.getValue();
							oEntry.WtslipBag = Unload_Bags.getValue();
							oEntry.Rejwt = Rejected_Wt.getValue();
							oEntry.RejBag = Rejected_bags_Num.getValue();
							oEntry.Tornbag = Torned_Bags_Num.getValue();
							oEntry.Bagavgwt = Avg_wt_bags.getValue();

							//Column4
							oEntry.MandiNo = Mandi_Rec_num.getValue();
							oEntry.MandiTax = Mandi_tax_deduct.getValue();
							oEntry.OtherDed = Other_Deduct.getValue();
							oEntry.AnyOther = Any_Other_deduct.getValue();
							oEntry.RateDifference = Rate_Diff.getValue();
							oEntry.Message = Remarks.getValue();
							// oEntry.CreateDate = "1111-11-11T00:00:00";
							// oEntry.CreateTime = "PT11H00M00S";

							var BillWeightzero = this.byId("BillWeight").getValue();
							var Billbagszero = this.byId("Billbags").getValue();

							//var Zeroregx = ;

							if (BillWeightzero == 0) {
								sap.m.MessageToast.show("Bill Weight can't be kept Zero");
							}
							/*else if (Billbagszero == 0) {
								sap.m.MessageToast.show("Bill Bags can't be kept Zero");
							}*/
							else {
								oModel.update("/GatepassdtlSet('" + GP_Num + "')", oEntry, {
									method: "PUT",
									success: function (oData, oResponse) {

										var parser = new DOMParser();
										var res = oResponse.headers["sap-message"];

										if (res == undefined) {

											sap.m.MessageToast.show("Data Has been Successfully Created");
											oThis.getView().byId("Savebtn").setEnabled(false);
											oThis.getView().byId("Cancelbtn").setEnabled(false);
											oThis.FieldEditFalseSave();

										} else {

											var xmlDoc = parser.parseFromString(res, "text/xml");
											var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
											// sap.m.MessageToast.show(Number);
											MessageBox.error(Number);

										}

										//	oThis.OnCancelBtn();
										// var savebtn = this.getView().byId("GPSave");
										// savebtn.setEnaled(false);

										// var cancelbtn = this.getView().byId("GpCancel");
										// cancelbtn.setEnaled(false);

									},
									error: function (cc, vv) {
										sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");
									}
								});
							}
						}

					}

					/*
						//save all the fields in table and generate gate pass num and then lock all the fields.
						//this function will be disable.
						//	var A1 = this.getView().byId("").getValue();

						var GPNum = this.byId("GatePassNo").getValue();
						var PONum = this.byId("ipPONo").getValue();
						var BrokerName = this.byId("BrokName").getValue();
						var PartyName = this.byId("PartName").getValue();
						var VendorCode = this.byId("VendCode").getValue();
						var VendorName = this.byId("VendName").getValue();
						var WeightSlip = this.byId("WeightSlipNo").getValue();
						var WeightSlipDate = this.byId("WtSlipDate").getValue();
						var UnloadWeight = this.byId("UnloadedWeight").getValue();
						var rateDiff = this.byId("RateDiff").getValue();

						if (GPNum == "" || PONum == "" || BrokerName == "" || PartyName == "" || VendorCode == "" || VendorName == "" || WeightSlip == "" ||
							WeightSlipDate == "" || UnloadWeight == "" || rateDiff == "") {
							sap.m.MessageToast.show("Please Fill all the Mandatory fields");
							
						} else {
							this.byId("BtnGoodMov").setVisible(true);
						}

					*/
				}

			} else {
				sap.m.MessageToast.show("MIGO has already performed you cannot change Gate Pass");
			}
		},
		OnCancelBtn: function () {
			//Clears all the value and navto main page&nbsp;
			var view = this.getView();
			var inputs = [
				view.byId("GatePassNo"),
				view.byId("ipPONo"),
				view.byId("BrokName"),
				// view.byId("PartName"),
				// view.byId("VendCode"),
				view.byId("VendName"),
				view.byId("WeightSlipNo"),
				//	view.byId("WtSlipDate"),
				view.byId("UnloadedWeight"),
				view.byId("RateDiff")
			];
			jQuery.each(inputs, function (i, input) {
				input.setValueState("None");
			});
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Gate_Pass");

		},
		PerformGoodsMovment: function () {
			var oThis = this;
			this.OnSaveBtn();

			var insp_lot = this.byId("InspLot").getValue();
			var matdocNo = this.byId("MatDoc").getValue();
			if (!insp_lot == "" && !matdocNo == "") {
				sap.m.MessageToast.show("Goods Movement Already Performed");
			} else {
				//after gate pass created this function will  enable,&nbsp;
				//open dialog box with post good movement fragment
				//ok generate good movement num generated then return to individual gate pass screen.
				//cancel return to the individual gate pass screen.
				// Storage_Lgobe
				var Gp_date = this.getView().byId("GatepassDate").getValue();
				var PO_num = this.getView().byId("ipPONo").getValue();
				var Gp_num = this.getView().byId("GatePassNo").getValue();
				var Quantity = this.getView().byId("UnloadedWeight").getValue();
				// var No_Bags = this.getView().byId("UnloadBags").getValue();
				var No_Bags = this.getView().byId("Billbags").getValue();
				var Storage_location = this.getView().byId("Store_loc").getValue();

				var view = this.getView();
				var inputs = [
					// view.byId("GatePassNo"),
					view.byId("Store_loc"),
					view.byId("UnloadedWeight"),
					view.byId("UnloadBags")

				];
				jQuery.each(inputs, function (i, input) {
					if (!input.getValue()) {
						input.setValueState("Error");
						//sap.m.MessageToast.show("Please Enter the Mandatory Fields!!!");
					} else {
						input.setValueState("None");
					}

				});
				var canContinue = true;
				jQuery.each(inputs, function (i, input) {
					if (input.getValueState() === "Error") {
						canContinue = false;
						return false;
					}
				});
				if (!canContinue) {
					sap.m.MessageToast.show("Please Fill all Mandatory Fields");
				} else {
					this.getView().byId("BtnGoodMov").setVisible(true);
					// this.FieldEditFalseMigo();
					// var oDate = new Date();
					// var date = oDate.getDate() + '-' + (oDate.getMonth() + 1)+ '-' +&nbsp;
					// 	oDate.getFullYear();
					var dateFormat = sap.ui.core.format.DateFormat.getInstance({
						pattern: "dd/MM/yyyy"
					});
					var dateFormatted = dateFormat.format(new Date(Gp_date));

					if (!this._oDialog) {
						this._oDialog = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.view.GoodsMovement", this);
						//	this._oDialog.setModel(this.getView().getModel());

					}
					sap.ui.getCore().byId("Goods_Date").setText(dateFormatted);
					sap.ui.getCore().byId("Po_Num").setText(PO_num);
					sap.ui.getCore().byId("Gp_Num").setText(Gp_num);
					sap.ui.getCore().byId("quantity_Num").setText(Quantity);
					sap.ui.getCore().byId("Bags_Num").setText(No_Bags);
					sap.ui.getCore().byId("Store_locDialog").setText(Storage_location);

					this._oDialog.open();

				}
			}
		},
		onSubmitGMDialog: function () {
			this._oDialog.close();
			var oThis = this;

			var Gp_date_Val = this.byId("GatepassDate").getValue();
			var Storage_Loc = this.byId("Store_loc").getValue();
			var Po_Num_Val = sap.ui.getCore().byId("Po_Num").getText();
			var Gp_Num_Val = sap.ui.getCore().byId("Gp_Num").getText();
			var Bags_Num_Val = sap.ui.getCore().byId("Bags_Num").getText();
			var Quantity_Val = sap.ui.getCore().byId("quantity_Num").getText();
			var PartyBill_num = this.byId("PartyBill").getValue();
			var PartyBill_date = this.byId("PartyDate").getValue();
			var Vehicl_num = this.byId("Truckno").getValue();

			var oEntry = {
				"Gpassdt": Gp_date_Val,
				"Bedat": Gp_date_Val,
				"Ebeln": Po_Num_Val,
				"Gpassno": Gp_Num_Val,
				"WtslipQty": Quantity_Val,
				"Bilbag": Bags_Num_Val,
				"Bilno": PartyBill_num,
				"Bildt": PartyBill_date,
				"StorageLocation": Storage_Loc,
				"Vehicleno": Vehicl_num
			};

			oModel.create("/MigoSet", oEntry, {
				Method: "PUT",
				success: function (oData, oResponse) {
					// two condition of error and success messages&nbsp;
					//if error then no further process if success then perform QA and then PAyment
					Matdoc = oData.MatDoc;
					var Docyr = oData.DocYear;
					InspectionLot = oData.Insplot;

					if (Matdoc == "" && Docyr == "0000") {
						var parser = new DOMParser();
						var res = oResponse.headers["sap-message"];
						var xmlDoc = parser.parseFromString(res, "text/xml");
						var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
						// sap.m.MessageToast.show(Number);
						MessageBox.error(Number);
					} else {
						// GRN NUMBER DISPLAYING
						var concatmmg = Matdoc + "," + Docyr;
						sap.m.MessageToast.show(concatmmg);

						oThis.byId("MatDoc").setValue(Matdoc);
						oThis.getView().byId("DocYr").setValue(Docyr);
						oThis.getView().byId("InspLot").setValue(InspectionLot);
						oThis.byId("BtnGenQA").setVisible(true);

						sap.ui.getCore().byId("Goods_Date").setText("");
						sap.ui.getCore().byId("Po_Num").setText("");
						sap.ui.getCore().byId("Gp_Num").setText("");
						sap.ui.getCore().byId("quantity_Num").setText("");
						sap.ui.getCore().byId("Bags_Num").setText("");
						sap.ui.getCore().byId("Store_locDialog").setText("");
						oThis.FieldEditFalseMigo();

					}

				},
				error: function (cc, vv) {

					sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator QA");
				}

			});

		},
		onCancelGmDialog: function () {
			this._oDialog.close();
		},
		PerformQA: function () {
			//after good movements completed  this function should be available when user clicks QA then
			//in dialog box perform QA screen parameters in form user save then save the record&nbsp;
			//cancel clear fields then return to individual GP screen.
			/*var QaDial = this.getView().byId("QADialog");*/
			var oThis = this;
			//QAcharSet  	"Insplot": InspectionLot,
			var insp_lot = this.byId("InspLot").getValue();
			if (insp_lot == "") {
				sap.m.MessageToast.show("Inspection Lot Number not generated yet");
			} else {
				// var a = oModel.read("/QAcharSet?$filter=Insplot eq '" + InspectionLot + "'");
				// console.log(a);
				// var a = oModel.read("/QAcharSet?$filter=Insplot eq '" + InspectionLot + "'");
				oModel.read("/QAcharSet?$filter=(Insplot eq '" + insp_lot + "')", {
					success: function (data, response) {
						var Length = data.results.length;
						if (Length == "0") {
							var parser = new DOMParser();
							var res = response.headers["sap-message"];
							var xmlDoc = parser.parseFromString(res, "text/xml");
							var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
							// sap.m.MessageToast.show(Number);
							MessageBox.error(Number);
						} else {
							if (!oThis._oDialog1) {
								oThis._oDialog1 = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.view.PerformQA", oThis);
								//	this._oDialog.setModel(this.getView().getModel());
							}
							oThis._oDialog1.open();

							var i;
							for (i = 0; i <= data.results.length; i++) {
								var Inspchar = data.results[i].Inspchar;

								if (Inspchar === "0010") {
									var labelQA1 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel1").setVisible(true);
									sap.ui.getCore().byId("QAip1").setVisible(true);
									sap.ui.getCore().byId("QAip1").setRequired(true);
									// sap.ui.getCore().byId("Num_Grain_Text").setVisible(true);
									sap.ui.getCore().byId("QALabel1").setText(labelQA1);
								}

								if (Inspchar === "0020") {
									var labelQA2 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel2").setVisible(true);
									sap.ui.getCore().byId("QAip2").setVisible(true);
									sap.ui.getCore().byId("QAip2").setRequired(true);
									// sap.ui.getCore().byId("Moist_Single_text").setVisible(true);
									sap.ui.getCore().byId("QALabel2").setText(labelQA2);
								}

								if (Inspchar === "0030") {
									var labelQA22 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel3").setVisible(true);
									sap.ui.getCore().byId("QAip3").setVisible(true);
									sap.ui.getCore().byId("QAip3").setRequired(true);
									// sap.ui.getCore().byId("Moist_Double_text").setVisible(true);
									sap.ui.getCore().byId("QALabel3").setText(labelQA22);
								}
								if (Inspchar === "0040") {
									var labelQA3 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel4").setVisible(true);
									sap.ui.getCore().byId("QAip4").setVisible(true);
									sap.ui.getCore().byId("QAip4").setRequired(true);
									// sap.ui.getCore().byId("QALabel4_txt").setVisible(true);
									sap.ui.getCore().byId("QALabel4").setText(labelQA3);
								}
								if (Inspchar === "0050") {
									var labelQA4 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel5").setVisible(true);
									sap.ui.getCore().byId("QAip5").setVisible(true);
									sap.ui.getCore().byId("QAip5").setRequired(true);
									// sap.ui.getCore().byId("QALabel5_txt").setVisible(true);
									sap.ui.getCore().byId("QALabel5").setText(labelQA4);
								}
								if (Inspchar === "0060") {
									var labelQA5 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel6").setVisible(true);
									sap.ui.getCore().byId("QAip6").setVisible(true);
									sap.ui.getCore().byId("QAip6").setRequired(true);
									// sap.ui.getCore().byId("QALabel6_txt").setVisible(true);
									sap.ui.getCore().byId("QALabel6").setText(labelQA5);
								}
								if (Inspchar === "0070") {
									var labelQA6 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel7").setVisible(true);
									sap.ui.getCore().byId("QAip7").setVisible(true);
									sap.ui.getCore().byId("QAip7").setRequired(true);
									// sap.ui.getCore().byId("QALabel7_txt").setVisible(true);
									sap.ui.getCore().byId("QALabel7").setText(labelQA6);
								}
								if (Inspchar === "0080") {
									var labelQA7 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel8").setVisible(true);
									sap.ui.getCore().byId("QAip8").setVisible(true);
									sap.ui.getCore().byId("QAip8").setRequired(true);
									// sap.ui.getCore().byId("QALabel8_txt").setVisible(true);
									sap.ui.getCore().byId("QALabel8").setText(labelQA7);
								}
								if (Inspchar === "0090") {
									var labelQA8 = data.results[i].CharDescr;
									sap.ui.getCore().byId("QALabel9").setVisible(true);
									// sap.ui.getCore().byId("QALabel9_txt").setVisible(true);
									sap.ui.getCore().byId("QAip9").setVisible(true);
									sap.ui.getCore().byId("QAip9").setRequired(true);
									sap.ui.getCore().byId("QALabel9").setText(labelQA8);
								}
								/*if (9 <= Length) {
										var labelQA9 = data.results[9].CharDescr;
										sap.ui.getCore().byId("QALabel10").setVisible(true);
										sap.ui.getCore().byId("unload_charges").setVisible(true);
										sap.ui.getCore().byId("QALabel10_txt").setVisible(true);
										sap.ui.getCore().byId("QALabel10").setText(labelQA9);
									}*/
							}
						}
					},
					error: function (cc, vv) {

						// var parser = new DOMParser();
						// var xmlDoc = parser.parseFromString(cc.response.body, "text/xml");
						// var msg = xmlDoc.getElementsByTagName("message")[0].innerHTML;
						sap.m.MessageToast.show("Please Contact your Administrator.");
					}

				});
				// if (!oThis._oDialog1) {
				// 	oThis._oDialog1 = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.view.PerformQA", oThis);
				// 	//	this._oDialog.setModel(this.getView().getModel());
				// }
				// oThis._oDialog1.open();
			}

		},
		onSubmitQADialog: function () {
			this.refreshInputBinding();
			//QA Dialog Submit PErform here
			var oThis = this;
			var inputs = [
				// view.byId("GatePassNo"),
				sap.ui.getCore().byId("QAip1"),
				sap.ui.getCore().byId("QAip2"),
				sap.ui.getCore().byId("QAip3"),
				sap.ui.getCore().byId("QAip4"),
				sap.ui.getCore().byId("QAip5"),
				sap.ui.getCore().byId("QAip6"),
				sap.ui.getCore().byId("QAip7"),
				sap.ui.getCore().byId("QAip8"),
				sap.ui.getCore().byId("QAip9")

			];
			//	$("input").attr("required", "true");

			// var PositiveRegx = /^[0-9]+[0-9]*$/;
			var PositiveRegx = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
			jQuery.each(inputs, function (i, input) {
				if (input.getRequired() == true) {
					// var all&nbsp;
					if (input.getValue() == "") {
						input.setValueState("Error");
						//sap.m.MessageToast.show("Please Enter the Mandatory Fields!!!");
					} else {
						if (input.getValue().match(PositiveRegx)) {
							input.setValueState("None");
						} else {
							sap.m.MessageToast.show("Please Enter the Positive Fields!!!");
							input.setValueState("Error");
						}
					}
				}

			});
			var canContinue = true;
			jQuery.each(inputs, function (i, input) {
				if (input.getValueState() === "Error") {
					canContinue = false;
					return false;
				}
			});
			if (!canContinue) {
				sap.m.MessageToast.show("Please Fill all Mandatory fields with Positive Numbers");
			} else {
				this._oDialog1.close();
				var oThis = this;
				var grain_num = sap.ui.getCore().byId("QAip1").getValue();
				var moist_single = sap.ui.getCore().byId("QAip2").getValue();
				var moist_double = sap.ui.getCore().byId("QAip3").getValue();
				var unmat_grain = sap.ui.getCore().byId("QAip4").getValue();
				var water_damage = sap.ui.getCore().byId("QAip5").getValue();
				var weeviled_damage = sap.ui.getCore().byId("QAip6").getValue();
				var broken = sap.ui.getCore().byId("QAip7").getValue();
				var dust = sap.ui.getCore().byId("QAip8").getValue();
				var cobs = sap.ui.getCore().byId("QAip9").getValue();
				var insp_lot = this.byId("InspLot").getValue();
				/*	var unload_charge = sap.ui.getCore().byId("unload_charges").getValue();
					var cash_disc = sap.ui.getCore().byId("cash_disc").getValue();*/
				// var gpdate = this.byId("GatepassDate").getValue();
				// var PONum = this.byId("ipPONo").getValue();

				var oEntry = {
					"Field10": grain_num,
					"Field20": moist_single,
					"Field30": moist_double,
					"Field40": unmat_grain,
					"Field50": water_damage,
					"Field60": weeviled_damage,
					"Field70": broken,
					"Field80": dust,
					"Field90": cobs,
					"Insplot": insp_lot,
					// "Unlodchg": unload_charge,
					//	"Cashdisc": cash_disc,
					// "Matnr": matcode,
					// "MatDoc": Matdoc,
					"ChnoField10": "0010",
					"ChnoField20": "0020",
					"ChnoField30": "0030",
					"ChnoField40": "0040",
					"ChnoField50": "0050",
					"ChnoField60": "0060",
					"ChnoField70": "0070",
					"ChnoField80": "0080",
					"ChnoField90": "0090"
				};

				oModel.create("/QASet", oEntry, {
					Method: "PUT",
					success: function (oData, oResponse) {
						oThis.byId("BtnGenPay").setVisible(true);
						oThis.onCancelQADialog();
						var QAMsg = oData.Message;
						var usg_dsc = oData.UsageDecision;

						// two condition of error and success messages&nbsp;
						//if error then no further process if success then perform QA and then PAyment
						if (QAMsg == "") {
							var parser = new DOMParser();
							var res = oResponse.headers["sap-message"];
							var xmlDoc = parser.parseFromString(res, "text/xml");
							var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
							// sap.m.MessageToast.show(Number);
							MessageBox.error(Number);
						} else {
							// sap.m.MessageToast.show(QAMsg);
							MessageBox.success(QAMsg);
							oThis.byId("BtnGenQA").setVisible(true);
							if (usg_dsc == "A") {
								var AcceptA = "A-Accept";
								oThis.byId("UsageDes").setValue(AcceptA);
							} else {
								oThis.byId("UsageDes").setValue(usg_dsc);
							}
						}
						this.refreshInputBinding();

					},
					error: function (cc, vv) {
						// sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator QA");

					}

				});

			}

		},
		refreshInputBinding: function () {
			sap.ui.getCore().byId("QALabel1").setVisible(false);
			sap.ui.getCore().byId("QAip1").setVisible(false);
			sap.ui.getCore().byId("QALabel2").setVisible(false);
			sap.ui.getCore().byId("QAip2").setVisible(false);
			sap.ui.getCore().byId("QALabel3").setVisible(false);
			sap.ui.getCore().byId("QAip3").setVisible(false);
			sap.ui.getCore().byId("QALabel4").setVisible(false);
			sap.ui.getCore().byId("QAip4").setVisible(false);
			sap.ui.getCore().byId("QALabel5").setVisible(false);
			sap.ui.getCore().byId("QAip5").setVisible(false);
			sap.ui.getCore().byId("QALabel6").setVisible(false);
			sap.ui.getCore().byId("QAip6").setVisible(false);
			sap.ui.getCore().byId("QALabel7").setVisible(false);
			sap.ui.getCore().byId("QAip7").setVisible(false);
			sap.ui.getCore().byId("QALabel8").setVisible(false);
			sap.ui.getCore().byId("QAip8").setVisible(false);
			sap.ui.getCore().byId("QALabel9").setVisible(false);
			sap.ui.getCore().byId("QAip9").setVisible(false);

		},
		onCancelQADialog: function () {
			//QA Dialog Cancel perform here.
			this._oDialog1.close();
			this.refreshInputBinding();
		},
		GeneratePayment: function () {
			//after QA completed  this function should be available when user clicks QA then
			//in dialog box payment calculated from backend and calculated on screen in display mode only.
			//cancel return to individual GP screen.

			//	MessageBox.success("Your Payment is Generated and your total Amount is  ₹ 22300");

			//after QA completed  this function should be available when user clicks QA then
			//in dialog box payment calculated from backend and calculated on screen in display mode only.
			//cancel return to individual GP screen.

			//	MessageBox.success("Your Payment is Generated and your total Amount is  ₹ 22300");
			var Gpnum = this.byId("GatePassNo").getValue();
			var oEntry = {
				"Gpassno": Gpnum
			};
			oModel.create("PaymentSet", oEntry, {
				Method: "PUT",
				success: function (oData, oResponse) {
					var msg = oData.Message;
					var NetAmnt = oData.NetPayAmount;

					if (msg == "") {
						var amnt = "Your Net Payable Amount is: ";
						MessageBox.success(amnt + " " + NetAmnt);
					} else {
						MessageBox.error(msg);
					}
					// 	oThis.byId("BtnGenPay").setVisible(true);
					// 	oThis.onCancelQADialog();

					// 	var QAMsg = oData.Message;

					// 	// two condition of error and success messages&nbsp;
					// 	//if error then no further process if success then perform QA and then PAyment
					// 	if (QAMsg == "") {
					// 		var parser = new DOMParser();
					// 		var res = oResponse.headers["sap-message"];
					// 		var xmlDoc = parser.parseFromString(res, "text/xml");
					// 		var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
					// 		// sap.m.MessageToast.show(Number);
					// 		MessageBox.error(Number);
					// 	} else {
					// 		// sap.m.MessageToast.show(QAMsg);
					// 		MessageBox.success(QAMsg);
					// 		oThis.byId("BtnGenQA").setVisible(true);
					// 	}

				},
				error: function (cc, vv) {
					// sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator QA");

				}
			});
		},
		FieldEditFalseSave: function () {
			// Column1
			this.byId("LRGRno").setEditable(false);
			this.byId("Truckno").setEditable(false);
			this.byId("Station").setEditable(false);
			this.byId("TransDetail").setEditable(false);
			//	this.byId("VendName").setEditable(false);
			// Column2
			// this.byId("GatepassDate").setEditable(false);
			this.byId("PartyBill").setEditable(false);
			this.byId("PartyDate").setEditable(false);
			this.byId("BillWeight").setEditable(false);
			this.byId("Billbags").setEditable(false);
			this.byId("WeightSlipNo").setEditable(false);
			// this.byId("WtSlipDate").setEditable(false);

		},
		AllFieldEditableTrue: function () {

			this.byId("Savebtn").setVisible(true);
			this.byId("Cancelbtn").setVisible(true);
			this.byId("BtnGoodMov").setVisible(true);
			this.byId("BtnGenQA").setVisible(true);
			this.byId("BtnGenPay").setVisible(true);
			this.byId("printGp").setVisible(false);

			// Column1
			this.byId("LRGRno").setEditable(true);
			this.byId("Truckno").setEditable(true);
			this.byId("Station").setEditable(true);
			this.byId("TransDetail").setEditable(true);
			//	this.byId("VendName").setEditable(true);
			// Column2
			// this.byId("GatepassDate").setEditable(true);
			this.byId("PartyBill").setEditable(true);
			// this.byId("PartyDate").setEditable(true);
			this.byId("BillWeight").setEditable(true);
			this.byId("Billbags").setEditable(true);
			this.byId("WeightSlipNo").setEditable(true);
			this.byId("Quality_deduct").setEditable(true);
			this.byId("Pay_Weight").setEditable(true);
			this.byId("GunnyBag_deduct").setEditable(true);
			this.byId("UnloadCharge_deduct").setEditable(true);

			// Column3
			this.byId("Store_loc").setEditable(true);
			this.byId("UnloadedWeight").setEditable(true);
			// this.byId("UnloadBags").setEditable(true);
			this.byId("RejectedWeight").setEditable(true);
			this.byId("RejectedBags").setEditable(true);
			this.byId("TornedBags").setEditable(true);
			// this.byId("SpecsQuality").setEditable(true);

			// Column4
			// this.byId("ReceiptNum").setEditable(true);
			this.byId("MandiTax").setEditable(true);
			this.byId("OtherDeduct").setEditable(true);
			this.byId("AnyOtherDeduct").setEditable(true);
			this.byId("RateDiff").setEditable(true);
			this.byId("remarksany").setEditable(true);

			this.getView().byId("Savebtn").setEnabled(true);
			this.getView().byId("Cancelbtn").setEnabled(true);

		},
		AllFieldEditableFalse: function () {

			var oThis = this;
			if (QualityDeduct == "X") {
				// Check box apply true
				oThis.byId("Quality_deduct").setSelected(true);
			} else {
				oThis.byId("Quality_deduct").setSelected(false);
			}
			if (PayOnWeight == "X") {
				// Check box apply true
				oThis.byId("Pay_Weight").setSelected(true);
			} else {
				oThis.byId("Pay_Weight").setSelected(false);
			}

			if (GunnyFlagVal == "X") {
				// Check box apply true
				oThis.byId("GunnyBag_deduct").setSelected(true);
			} else {
				oThis.byId("GunnyBag_deduct").setSelected(false);
			}

			if (UnloadFlagVal == "X") {
				// Check box apply true
				oThis.byId("UnloadCharge_deduct").setSelected(true);
			} else {
				oThis.byId("UnloadCharge_deduct").setSelected(false);
			}
			// if (Specs_quality == "X") {
			// 	oThis.byId("SpecsQuality").setSelected(true);
			// } else {
			// 	// Check box apply false
			// 	oThis.byId("SpecsQuality").setSelected(false);
			// }
			this.byId("Savebtn").setVisible(false);
			this.byId("Cancelbtn").setVisible(false);
			this.byId("BtnGoodMov").setVisible(false);
			this.byId("BtnGenQA").setVisible(false);
			this.byId("BtnGenPay").setVisible(false);
			this.byId("printGp").setVisible(true);

			// Column1
			this.byId("LRGRno").setEditable(false);
			this.byId("Truckno").setEditable(false);
			this.byId("Station").setEditable(false);
			this.byId("TransDetail").setEditable(false);
			//	this.byId("VendName").setEditable(false);
			// Column2
			// this.byId("GatepassDate").setEditable(false);
			this.byId("PartyBill").setEditable(false);
			// this.byId("PartyDate").setEditable(false);
			this.byId("BillWeight").setEditable(false);
			this.byId("Billbags").setEditable(false);
			this.byId("WeightSlipNo").setEditable(false);
			this.byId("Quality_deduct").setEditable(false);
			this.byId("Pay_Weight").setEditable(false);
			this.byId("GunnyBag_deduct").setEditable(false);
			this.byId("UnloadCharge_deduct").setEditable(false);

			// Column3
			this.byId("Store_loc").setEditable(false);
			this.byId("UnloadedWeight").setEditable(false);
			this.byId("UnloadBags").setEditable(false);
			this.byId("RejectedWeight").setEditable(false);
			this.byId("RejectedBags").setEditable(false);
			this.byId("TornedBags").setEditable(false);
			// this.byId("SpecsQuality").setEditable(false);

			// Column4
			this.byId("ReceiptNum").setEditable(false);
			this.byId("MandiTax").setEditable(false);
			this.byId("OtherDeduct").setEditable(false);
			this.byId("AnyOtherDeduct").setEditable(false);
			this.byId("RateDiff").setEditable(false);
			this.byId("remarksany").setEditable(false);

		},
		SetZeroVal: function () {
			this.byId("BillWeight").setValue("0.00");
			this.byId("UnloadedWeight").setValue("0.00");
			this.byId("UnloadBags").setValue("0.00");
			this.byId("RejectedWeight").setValue("0.00");
			this.byId("RejectedBags").setValue("0.00");
			this.byId("TornedBags").setValue("0.00");
			this.byId("RateDiff").setValue("0.00");
			this.byId("Avg_wt").setValue("0");
		},

		FieldEditFalseMigo: function () {

			// Column3
			this.byId("Store_loc").setEditable(false);
			this.byId("UnloadedWeight").setEditable(false);
			this.byId("UnloadBags").setEditable(false);
			this.byId("RejectedWeight").setEditable(false);
			this.byId("RejectedBags").setEditable(false);
			this.byId("TornedBags").setEditable(false);
			this.byId("Avg_wt").setEditable(false);

			// Column4
			this.byId("ReceiptNum").setEditable(false);
			this.byId("MandiTax").setEditable(false);
			this.byId("OtherDeduct").setEditable(false);
			this.byId("AnyOtherDeduct").setEditable(false);
			this.byId("RateDiff").setEditable(false);

		},
		// PRint GAte Pass Functionality
		printgp: function () {

			var that = this;
			var Gp_num = this.byId("GatePassNo").getValue();
			var Fmname = "GATEPASS";

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
		},

		// Code for Station code and Station Name (F4 help) Start (Kathan)

		ValueHelpRequestforStation: function () {
			oModel.read("zmm_stationset", {
				method: "GET",
				success: function (oData, oResponse) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData);
					this.getOwnerComponent().setModel(oModel, "StationModel");
					if (!this.StationFrag) {
						this.StationFrag = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.Fragment.StationF4", this);
						this.getView().addDependent(this.StationFrag);
					}
					this.StationFrag.open();
				}.bind(this),
				error: function (error) { }
			});
		},

		closeDlg: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.desc = oSelectedItem.getDescription();
				this.key = oSelectedItem.getTitle();
			}
			this.getView().byId("Station").setValue(this.desc);
			this.StationFrag.destroy();
			this.StationFrag = undefined;
		},

		livechangesearch: function (oEvent) {
			var sValue = oEvent.mParameters.value;
			var oFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ST_CODE", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ST_NAME", sap.ui.model.FilterOperator.Contains, sValue)
			]);
			var oBinding = sap.ui.getCore().byId("StationDialog").getBinding("items");
			oBinding.filter([oFilter]);
		}

		// Code for Station code and Station Name (F4 help) End

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.ChanDispScreen
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.ChanDispScreen
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.ChanDispScreen
		 */
		//	onExit: function() {
		//
		//	}

	});

});