sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
  "sap/m/MessageBox"
], function (Controller, History, UIComponent, MessageBox) {
  "use strict";
  var oModel;
  var matcode;
  var Plat_Num;
  var Podate;
  var Storage_LOvc;
  var Storage_Lgobe;
  var BrokerNum;
  var BrokerName;
  var Vend_Num;
  var Vend_Name;
  var POLineItem;
  var Matdoc;
  var InspectionLot;
  var FlagVal;
  // var FlagVal1;
  var Rate;
  var GunnyFlagVal;
  var UnloadFlagVal;
  var PayOnWeight;

  return Controller.extend("MaizeProcurementPortal.MaizeProcurementPortal.controller.IndividualGpScreen", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.IndividualGpScreen
     */
    onInit: function () {
      //locaion.reload(true);
      this.byId("Billbags").setValue("0.00");
      // uodate bindings on any table or list
      // oList.getModel().updateBindings().
      var serviceURl = "/sap/opu/odata/sap/ZGW_GATEPASS_SRV/";
      oModel = new sap.ui.model.odata.ODataModel(serviceURl);
      this.getView().setModel(oModel);

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("IndividualGpScreen").attachPatternMatched(this._onObjectMatched, this);

      var oDate = new Date();
      // var date = oDate.getDate() + '-' + (oDate.getMonth() + 1)+ '-' +&nbsp;
      //  oDate.getFullYear();
      var dateFormat = sap.ui.core.format.DateFormat.getInstance({
        pattern: "yyyy-MM-ddThh:mm:ss"
      });
      var dateFormatted = dateFormat.format(new Date(oDate));
      this.byId("GatepassDate").setValue(dateFormatted);
      this.byId("WtSlipDate").setValue(dateFormatted);

      this.byId("GatepassDate").setMaxDate(oDate);
      this.byId("PartyDate").setMaxDate(oDate);
      this.byId("WtSlipDate").setMaxDate(oDate);
    },

    onNavBack: function () {
      this.byId("labelUnloadbadgs").setProperty("required", false);
      this.byId("labNoBags").setProperty("required", false);
      this.byId("labMandiReceipt").setProperty("required", false);
      var that = this;
      var url = window.localStorage.getItem("key");

      var data = url.split("/")[1];
      var data1 = url.split("/")[2];
      var data2 = url.split("/")[3];
      var data3 = url.split("/")[4];
      var data4 = url.split("/")[5];
      var data5 = url.split("/")[6];
      var data6 = url.split("/")[7];

      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("GPList", {
          invoicePath: data,
          invoicePath1: data1,
          invoicePath2: data2,
          invoicePath3: data3,
          invoicePath5: data4,
          invoicePath6: data5,
          invoicePath7: data6
        });
      }
      this.OnCancelBtn();
      /*

        var that = this;
        var url = window.localStorage.getItem("key");


        var data = url.split("/")[1];
        var data1 = url.split("/")[2];
        var data2 = url.split("/")[3];
        var data3 = url.split("/")[4];
        var data4 = url.split("/")[5];
        var data5 = url.split("/")[6];
        var data6 = url.split("/")[7];

        // var oHistory = History.getInstance();
        var sPreviousHash;
        // var sPreviousHash; = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = UIComponent.getRouterFor(this);
          // oRouter.navTo(url);
          oRouter.navTo("GPList", {
            // invoicePath: oEntry
            invoicePath: data,
            invoicePath1: data1,
            invoicePath2: data2,
            invoicePath3: data3,
            invoicePath5: data4,
            invoicePath6: data5,
            invoicePath7: data6
          });
        }
        this.OnCancelBtn();
        // this.FieldEditTrue();
      */
    },
    CheckBox1: function () {
      var QualityDeduct = this.byId("Quality_deduct");

      if (QualityDeduct.getSelected()) {
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
    GunnyBagDed: function () {

      var GunnyDeduct = this.byId("GunnyBag_deduct");

      if (GunnyDeduct.getSelected()) {
        GunnyFlagVal = "X";
      } else {
        GunnyFlagVal = "";
      }

    },
    UnloadChargeDed: function () {

      var UnloadDeduct = this.byId("UnloadCharge_deduct");

      if (UnloadDeduct.getSelected()) {
        UnloadFlagVal = "X";
      } else {
        UnloadFlagVal = "";
      }

    },
    // CheckBox2: function () {
    //  var POSpecific = this.byId("SpecsQuality");
    //  if (POSpecific.getSelected()) {
    //    FlagVal1 = "X";
    //  } else {
    //    FlagVal1 = "";
    //  }
    // },

    onInputDecimalChange: function (oEvent) {

      // var textinp1 = this.byId("BillWeight").getValue();
      // var oThis = this;
      /*  var view = this.getView();
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
      /*  var norej1 = this.byId("RejectedBags").getValue(); //1st
        var norej = parseInt(norej1);
        var billbags1 = this.byId("Billbags").getValue(); //2nd
        var billbags = parseInt(billbags1);
        if (billbags >= norej) {
          this.byId("RejectedBags").setValueState("None");

        } else {
          this.byId("RejectedBags").setValueState("Error");
          sap.m.MessageToast.show("Unload bags should not be greater than bags party bill");
        }*/

      var fValue = this.byId("RejectedBags").getValue();
      var regex = "^[0-9]*$";
      if (fValue.match(regex)) {
        this.byId("RejectedBags").setValueState("None");

      } else {
        this.byId("RejectedBags").setValueState("Error");
      }

    },
    inputgreater: function () {
      /*
            var MandiTax1 = this.byId("MandiTax").getValue(); //1st
            var MandiTax = parseInt(MandiTax1);
            var billbags1 = this.byId("Billbags").getValue(); //2nd
            var billbags = parseInt(billbags1);
            if (billbags >= MandiTax) {
              this.byId("MandiTax").setValueState("None");

            } else {
              this.byId("MandiTax").setValueState("Error");
              sap.m.MessageToast.show("Unload bags should not be greater than bags party bill");
            }
          */
    },
    otherdeductlive: function () {
      /*

            var OtherDeduc1 = this.byId("OtherDeduct").getValue(); //1st
            var OtherDeduc = parseInt(OtherDeduc1);
            var billbags1 = this.byId("Billbags").getValue(); //2nd
            var billbags = parseInt(billbags1);
            if (billbags >= OtherDeduc) {
              this.byId("OtherDeduct").setValueState("None");

            } else {
              this.byId("OtherDeduct").setValueState("Error");
              sap.m.MessageToast.show("Unload bags should not be greater than bags party bill");
            }

          */
    },
    anyotherdeductlive: function () {
      /*

            var AnyOtherDeduct1 = this.byId("AnyOtherDeduct").getValue(); //1st
            var AnyOtherDeduct = parseInt(AnyOtherDeduct1);
            var billbags1 = this.byId("Billbags").getValue(); //2nd
            var billbags = parseInt(billbags1);
            if (billbags >= AnyOtherDeduct) {
              this.byId("AnyOtherDeduct").setValueState("None");

            } else {
              this.byId("AnyOtherDeduct").setValueState("Error");
              sap.m.MessageToast.show("Unload bags should not be greater than bags party bill");
            }

          */
    },
    inputlivebags3: function () {

      /*  var tornbag1 = this.byId("TornedBags").getValue(); //1st
        var tornbag = parseInt(tornbag1);
        var billbags1 = this.byId("Billbags").getValue(); //2nd
        var billbags = parseInt(billbags1);
        if (billbags >= tornbag) {
          this.byId("TornedBags").setValueState("None");

        } else {
          this.byId("TornedBags").setValueState("Error");
          sap.m.MessageToast.show("Unload bags should not be greater than bags party bill");
        }*/

      var fValue = this.byId("TornedBags").getValue();
      var regex = "^[0-9]*$";
      if (fValue.match(regex)) {
        this.byId("TornedBags").setValueState("None");

      } else {
        this.byId("TornedBags").setValueState("Error");
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
      //  ip2.setValueState("None");
      //  // this.byId("BillWeight").setValueState("Error");
      // } else {
      //  ip2.setValueState("Error");
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
    greaterrejMT: function () {
      /*
            var RejMT1 = this.byId("RejectedWeight").getValue(); //1st
            var RejMT = parseInt(RejMT1);
            var billweight1 = this.byId("BillWeight").getValue(); //2nd
            var billweight = parseInt(billweight1);
            if (billweight >= RejMT) {
              this.byId("RejectedWeight").setValueState("None");

            } else {
              this.byId("RejectedWeight").setValueState("Error");
              sap.m.MessageToast.show("Unload bags should not be greater than bags party bill");
            }
          */
    },
    DivAvgWt: function () {

      /*  var bagparty = this.byId("Billbags").getValue();
        var fValue = this.byId("UnloadBags").getValue();
        if (bagparty >= fValue) {
          sap.m.MessageToast.show("Unload bags should not be greater than bags party bill");
        } else {*/
      /*  var fValue = this.byId("UnloadBags").getValue();
        var regex = "^[0-9]*$";
        if (fValue.match(regex)) {
          this.byId("UnloadBags").setValueState("None");
          var Unload_Val = this.byId("UnloadedWeight").getValue();
          var Unload_BagVal = this.byId("UnloadBags").getValue();

          var AvgWeight = (+Unload_Val / +Unload_BagVal);
          var AvgDecimal = AvgWeight.toFixed(3);
          this.byId("AvgWtBag").setValue(AvgDecimal);
        } else {
          this.byId("UnloadBags").setValueState("Error");
        }*/
      // }

    },
    GpLivedate: function () {

      var gpdate = this.byId("GatepassDate").getValue();
      this.byId("WtSlipDate").setValue(gpdate);
    },
    Stor_caps: function () {
      var stora_loc = this.byId("Store_loc").getValue().toUpperCase();
      this.byId("Store_loc").setValue(stora_loc);

    },
    _onObjectMatched: function (oEvent) {

      this.SetZeroVal();

      var PoVal = oEvent.getParameter("arguments").PoNumManifest;
      this.byId("ipPONo").setValue(PoVal);

      Plat_Num = oEvent.getParameter("arguments").PlantNum;
      matcode = oEvent.getParameter("arguments").MatCode;
      POLineItem = oEvent.getParameter("arguments").POLineItem;
      if (matcode === "110029") {
        this.byId("labelUnloadbadgs").setProperty("required", true);
        this.byId("labNoBags").setProperty("required", true);
        this.byId("labMandiReceipt").setProperty("required", true);
      }

      Rate = oEvent.getParameter("arguments").ManiRate;
      //vALUE to backend with key

      // oModel.read("/GpautofillSet(Ebeln='" + PoVal + "')", {
      // /sap/opu/odata/sap/ZGW_GATEPASS_SRV/GpautofillSet(Ebeln='',Werks='')
      // });
      var oEntry = {
        "Ebeln": PoVal,
        "Werks": Plat_Num
      };
      var oThis = this;
      // var sPath = "/GpautofillSet('" + PoVal + "')";
      // oModel.read("/GpautofillSet('" + PoVal + "')", {
      //Sending two key fields to abap
      oModel.read("/GpautofillSet(Ebeln='" + PoVal + "',Werks='" + Plat_Num + "')", {
        method: "GET",
        success: function (data, response) {

          Podate = data.Bedat;
          var dateFormat = sap.ui.core.format.DateFormat.getInstance({
            pattern: "dd/MM/yyyy"
          });
          var dateFormatted = dateFormat.format(new Date(Podate));

          oThis.getView().byId("Po_date").setValue(dateFormatted);

          BrokerNum = data.Brokerno;
          BrokerName = data.Brokername;
          var Concate_Broker = BrokerNum + "" + BrokerName;
          oThis.getView().byId("BrokName").setValue(Concate_Broker);

          Vend_Num = data.Vendorno;
          Vend_Name = data.Vendorname;
          var Concate_Vendor = Vend_Num + "" + Vend_Name;
          oThis.getView().byId("PartName").setValue(Concate_Vendor);

          Storage_LOvc = data.StorageLocation;
          Storage_Lgobe = data.DescOfSloc;
          // var Concate_Lgobe = Storage_LOvc + " " + Storage_Lgobe;
          oThis.getView().byId("Store_loc").setValue(Storage_LOvc);
          // oThis.getView().byId("Store_desc").setValue(Storage_Lgobe);

          /*var oPartnerData = new sap.ui.model.json.JSONModel(data.results);
          for (var i = 0; i <= data.results.length; i++) {
            if (PoVal === oPartnerData.getProperty("/" + [i] + "/Ebeln")) {

              var GP_Num = oPartnerData.getProperty("/" + [i] + "/Gpassno");
              oThis.getView().byId("GatePassNo").setValue(GP_Num);


            }
          }*/
          /*  }
          });*/
          /*
            sap.m.MessageToast.show("Success");
            var oPartnerData = new sap.ui.model.json.JSONModel(data.results);
            for (var i = 0; i <= data.results.length; i++) {
              if (PoVal === oPartnerData.getProperty("/" + [i] + "/Ebeln")) {
                var GP_Num = oPartnerData.getProperty("/" + [i] + "/Gpassno");
                oThis.getView().byId("GatePassNo").setValue(GP_Num);
              }
            }

          */
        },
        error: function (cc, vv) {
          sap.m.MessageToast.show("Somthing is wrong. Please contact your Backend Administrator");

        }

      });

    },
    OnSaveBtn: function () {
      // var Gp_num = this.byId("GatePassNo");
      // if (Gp_num == "") {
      //  sap.m.MessageToast.show("Gate Pass Number Already Generated")
      // } else {
      /*  var Gp_date = this.byId("GatepassDate");
        var PartyBill_date = this.byId("PartyDate");
        var Wt_Slipdate = this.byId("WtSlipDate");

        var sDate = "1111-11-11T00:00:00";
        //var day = new Date(data.startDate).getDate();
        var dateFormat = sap.ui.core.format.DateFormat.getInstance({
          pattern: "yyyy-MM-ddThh:mm:ss"
        });
        var dateFormatted = dateFormat.format(new Date(sDate));

        if (Gp_date == "") {
          Gp_date = dateFormatted;
        }
        if (PartyBill_date == "") {
          PartyBill_date = dateFormatted;
        }
        if (Wt_Slipdate == "") {
          Wt_Slipdate = dateFormatted;
        }
        if (Gp_date == dateFormatted || PartyBill_date == dateFormatted || Wt_Slipdate == dateFormatted) {*/

      if (matcode === "110029") {
        var BillBags = this.byId("Billbags").getValue();
        var RecNum = this.byId("ReceiptNum").getValue();
        var UnloBags = this.byId("UnloadBags").getValue();
        if (BillBags === "0.00") {
          this.byId("Billbags").setValueState("Error");
          this.byId("ReceiptNum").setValueState("None");
          this.byId("UnloadBags").setValueState("None");
          return;
        }
        if (RecNum === "") {
          this.byId("ReceiptNum").setValueState("Error");
          this.byId("Billbags").setValueState("None");
          this.byId("UnloadBags").setValueState("None");
          return;
        }
        if (UnloBags === "0.00") {
          this.byId("UnloadBags").setValueState("Error");
          this.byId("Billbags").setValueState("None");
          this.byId("ReceiptNum").setValueState("None");
          return;
        }
      }

      // this.byId("labelUnloadbadgs").setProperty("required", false);
      // this.byId("labNoBags").setProperty("required", false);
      // this.byId("labMandiReceipt").setProperty("required", false);

      var oThis = this;
      var view = this.getView();
      var inputs = [
        // view.byId("GatePassNo"),
        view.byId("ipPONo"),
        view.byId("Po_date"),
        view.byId("PartName"),
        view.byId("GatepassDate"),
        view.byId("PartyBill"),
        view.byId("PartyDate"),
        view.byId("BillWeight"),
        // view.byId("Billbags"),
        // view.byId("ReceiptNum"),
        view.byId("WeightSlipNo"),
        view.byId("WtSlipDate")

        //  view.byId("BrokName"),
        //view.byId("TransDetail"),
        //  view.byId("UnloadedWeight"),
        //  view.byId("UnloadBags")
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

        /*
                var reg = /^(\d*\.\d{2})+$/;
                // var textinp1 = this.byId("BillWeight").getValue();
                var oThis = this;
                var view = this.getView();
                var inputs = [
                  view.byId("BillWeight"),
                  view.byId("Billbags"),
                  view.byId("TornedBags"),
                  view.byId("RejectedWeight")
                ];
                jQuery.each(inputs, function (i, input) {
                  if (!input.getValue().match(reg)) {
                    // input.setValueState("Error");
                    sap.m.MessageToast.show("Please Input the decimal Fields!!!");
                  } else {
                    // input.setValueState("None");
                  }

                });
        */
        //set editable false all the values here.
        sap.m.MessageToast.show("All fields will be editable false.");

        //  sap.m.MessageToast.show("Now you can perform Goods Movement");

        //  Column 1
        var Gp_num = this.byId("GatePassNo");
        var PO_num = this.byId("ipPONo");
        //  var Brok_name = this.byId("BrokName");
        //  var Vendor_name = this.byId("PartName");
        var Transport_num = this.byId("LRGRno");
        var vehicle_num = this.byId("Truckno");
        var Station_num = this.byId("Station");
        var Trans_Vendor_code = this.byId("TransDetail");
        //  var Trans-Vendor_name = this.byId("VendName");

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
        var Avg_wt_bags = this.byId("AvgWtBag");

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

        /*  if (Gp_date == "") {
            Gp_date = dateFormatted;
          }*/
        if (PartyBill_date == "") {
          PartyBill_date = dateFormatted;
        }
        /*  if (Wt_Slipdate == "") {
            Wt_Slipdate = dateFormatted;
          }*/
        if (PartyBill_date !== "") { //Gp_date !== "" || Wt_Slipdate !== "" ||&nbsp;

          var oEntry = {};
          //Column1

          var QualityDeduct1 = this.byId("Quality_deduct").getSelected();
          if (QualityDeduct1 == false) {
            FlagVal = "";
          }
          var PayWeight = this.byId("Pay_Weight").getSelected();
          if (PayWeight == false) {
            PayOnWeight = "";
          }
          var GunnyDeduct1 = this.byId("GunnyBag_deduct").getSelected();
          if (GunnyDeduct1 == false) {
            GunnyFlagVal = "";
          }
          var UnlloadDeduct1 = this.byId("UnloadCharge_deduct").getSelected();
          if (UnlloadDeduct1 == false) {
            UnloadFlagVal = "";
          }

          // oEntry.QltyPar = FlagVal1;
          oEntry.NoQltyDeduction = FlagVal;
          oEntry.PaymentOnPbw = PayOnWeight;
          oEntry.NoGunnyDed = GunnyFlagVal;
          oEntry.NoUnldChargeDed = UnloadFlagVal;

          oEntry.Werks = Plat_Num;
          oEntry.Bedat = Podate;
          oEntry.Matnr = matcode;
          oEntry.Gpassno = Gp_num.getValue();
          oEntry.Ebeln = PO_num.getValue();
          oEntry.Brokerno = BrokerNum;
          oEntry.Brokername = BrokerName;
          oEntry.Vendorno = Vend_Num;
          oEntry.Vendorname = Vend_Name;

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
          oEntry.DescOfSloc = Storage_Lgobe;

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
          oEntry.Ebelp = POLineItem;
          oEntry.Netpr = Rate;
          // oEntry.CreateDate = "1111-11-11T00:00:00";
          // oEntry.CreateTime = "PT11H00M00S";

          var BillWeightzero = this.byId("BillWeight").getValue();
          // var Billbagszero = this.byId("Billbags").getValue();

          //var Zeroregx = ;

          if (BillWeightzero == 0) {
            sap.m.MessageToast.show("Bill Weight can't be kept Zero");

          } else {

            oModel.create("/GatepasscreateSet", oEntry, {
              Method: "PUT",
              success: function (oData, oResponse) {
                // sap.m.MessageToast.show("Data Has been Successfully Created");
                oThis.FieldEditFalseSave();

                oThis.getView().byId("Quality_deduct").setEditable(false);
                oThis.getView().byId("Pay_Weight").setEditable(false);
                oThis.getView().byId("GunnyBag_deduct").setEditable(false);
                oThis.getView().byId("UnloadCharge_deduct").setEditable(false);

                oThis.getView().byId("GPSave").setEnabled(false);
                oThis.getView().byId("GpCancel").setEnabled(false);

                var msg = oData.Message;
                var GP_Num = oData.Gpassno;
                var AvgWt = oData.Bagavgwt;

                oThis.getView().byId("GatePassNo").setValue(GP_Num);
                oThis.getView().byId("AvgWtBag").setValue(AvgWt);

                if (GP_Num == "") {
                  sap.m.MessageToast.show("Please Input correct Field");
                } else if (GP_Num == "0000000000") {
                  sap.m.MessageToast.show(msg);
                } else {
                  oThis.getView().byId("BtnGoodMov").setVisible(true);
                  sap.m.MessageToast.show("Data Has been Successfully Created");
                }

                // oThis.byId("UnloadedWeight").setValue("");
                // oThis.byId("UnloadBags").setValue("");
                // oThis.byId("AvgWtBag").setValue("");

                //  oThis.OnCancelBtn();
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

      // }

      /*
        //save all the fields in table and generate gate pass num and then lock all the fields.
        //this function will be disable.
        //  var A1 = this.getView().byId("").getValue();

        var GPNum = this.byId("GatePassNo").getValue();
        var PONum = this.byId("ipPONo").getValue();
        var BrokerName = this.byId("BrokName").getValue();
        var PartyName = this.byId("PartName").getValue();
        var VendorCode = this.byId("TransDetail").getValue();
      //  var VendorName = this.byId("VendName").getValue();
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
      /*  }*/
    },
    OnCancelBtn: function () {
      //Clears all the value and navto main page&nbsp;
      // this.getView().byId("SpecsQuality").setSelected(false);
      this.getView().byId("Quality_deduct").setSelected(false);
      this.getView().byId("Pay_Weight").setSelected(false);
      this.getView().byId("GunnyBag_deduct").setSelected(false);
      this.getView().byId("UnloadCharge_deduct").setSelected(false);
      var view = this.getView();
      var inputs = [
        view.byId("LRGRno"),
        view.byId("Truckno"),
        view.byId("Station"),
        view.byId("TransDetail"),
        view.byId("GatePassNo"),

        //Column2
        //  view.byId("GatepassDate"),
        view.byId("PartyBill"),
        view.byId("PartyDate"),
        view.byId("BillWeight"),
        view.byId("Billbags"),
        view.byId("WeightSlipNo"),
        // view.byId("WtSlipDate"),
        view.byId("Store_loc"),

        // Column3
        view.byId("UnloadedWeight"),
        view.byId("UnloadBags"),
        view.byId("MatDoc"),
        view.byId("RejectedBags"),
        view.byId("DocYr"),
        view.byId("AvgWtBag"),

        // Column 4
        view.byId("ReceiptNum"),
        view.byId("MandiTax"),
        view.byId("OtherDeduct"),
        view.byId("AnyOtherDeduct"),
        view.byId("RateDiff"),
        view.byId("InspLot")

      ];
      jQuery.each(inputs, function (i, input) {
        input.setValue("");
        input.setValueState("None");
      });
      this.FieldEditTrue();
      // var oRouter = UIComponent.getRouterFor(this);
      // oRouter.navTo("Gate_Pass");

    },
    PerformGoodsMovment: function () {

      var insp_lot = this.byId("InspLot").getValue();
      var matdocNo = this.byId("MatDoc").getValue();
      if (!insp_lot == "" && !matdocNo == "") {
        sap.m.MessageToast.show("Goods Movement Already Performed");
      } else {
        //after gate pass created this function will  enable,&nbsp;
        //open dialog box with post good movement fragment
        //ok generate good movement num generated then return to individual gate pass screen.
        //cancel return to the individual gate pass screen.
        // Storage_Lgobe]
        var Gp_date = this.getView().byId("GatepassDate").getValue();
        var PO_num = this.getView().byId("ipPONo").getValue();
        var Gp_num = this.getView().byId("GatePassNo").getValue();
        var Quantity = this.getView().byId("UnloadedWeight").getValue();
        var No_Bags = this.getView().byId("Billbags").getValue();
        var Storage_location = this.getView().byId("Store_loc").getValue();

        var oThis = this;
        var view = this.getView();
        var inputs = [
          // view.byId("GatePassNo"),
          view.byId("Store_loc"),
          view.byId("UnloadedWeight"),
          // view.byId("UnloadBags")

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

          // var oDate = new Date();
          // var date = oDate.getDate() + '-' + (oDate.getMonth() + 1)+ '-' +&nbsp;
          //  oDate.getFullYear();
          var dateFormat = sap.ui.core.format.DateFormat.getInstance({
            pattern: "dd/MM/yyyy"
          });
          var dateFormatted = dateFormat.format(new Date(Gp_date));

          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.view.GoodsMovement", this);
            //  this._oDialog.setModel(this.getView().getModel());
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
            oThis.FieldEditFalseMigo();
            var concatmmg = Matdoc + "," + Docyr;
            sap.m.MessageToast.show(concatmmg);
            oThis.getView().byId("MatDoc").setValue(Matdoc);
            oThis.getView().byId("DocYr").setValue(Docyr);
            oThis.getView().byId("InspLot").setValue(InspectionLot);
            oThis.byId("BtnGenQA").setVisible(true);

            sap.ui.getCore().byId("Goods_Date").setText("");
            sap.ui.getCore().byId("Po_Num").setText("");
            sap.ui.getCore().byId("Gp_Num").setText("");
            sap.ui.getCore().byId("quantity_Num").setText("");
            sap.ui.getCore().byId("Bags_Num").setText("");
            sap.ui.getCore().byId("Store_locDialog").setText("");

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
      //QAcharSet   "Insplot": InspectionLot,

      // var a = oModel.read("/QAcharSet?$filter=Insplot eq '" + InspectionLot + "'");
      // console.log(a);
      // var a = oModel.read("/QAcharSet?$filter=Insplot eq '" + InspectionLot + "'");
      oModel.read("/QAcharSet?$filter=(Insplot eq '" + InspectionLot + "')", {
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
              //  this._oDialog.setModel(this.getView().getModel());
            }
            oThis._oDialog1.open();
            var i;
            for (i = 0; i <= data.results.length; i++) {
              var Inspchar = data.results[i].Inspchar;

              if ("0010" === Inspchar) {
                var labelQA1 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel1").setVisible(true);
                sap.ui.getCore().byId("QAip1").setVisible(true);
                sap.ui.getCore().byId("QAip1").setRequired(true);
                // sap.ui.getCore().byId("Num_Grain_Text").setVisible(true);
                sap.ui.getCore().byId("QALabel1").setText(labelQA1);
              }

              if ("0020" === Inspchar) {
                var labelQA2 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel2").setVisible(true);
                sap.ui.getCore().byId("QAip2").setVisible(true);
                sap.ui.getCore().byId("QAip2").setRequired(true);
                // sap.ui.getCore().byId("Moist_Single_text").setVisible(true);
                sap.ui.getCore().byId("QALabel2").setText(labelQA2);
              }

              if ("0030" === Inspchar) {
                var labelQA22 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel3").setVisible(true);
                sap.ui.getCore().byId("QAip3").setVisible(true);
                sap.ui.getCore().byId("QAip3").setRequired(true);
                // sap.ui.getCore().byId("Moist_Double_text").setVisible(true);
                sap.ui.getCore().byId("QALabel3").setText(labelQA22);
              }
              if ("0040" === Inspchar) {
                var labelQA3 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel4").setVisible(true);
                sap.ui.getCore().byId("QAip4").setVisible(true);
                sap.ui.getCore().byId("QAip4").setRequired(true);
                // sap.ui.getCore().byId("QALabel4_txt").setVisible(true);
                sap.ui.getCore().byId("QALabel4").setText(labelQA3);
              }
              if ("0050" === Inspchar) {
                var labelQA4 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel5").setVisible(true);
                sap.ui.getCore().byId("QAip5").setVisible(true);
                sap.ui.getCore().byId("QAip5").setRequired(true);
                // sap.ui.getCore().byId("QALabel5_txt").setVisible(true);
                sap.ui.getCore().byId("QALabel5").setText(labelQA4);
              }
              if ("0060" === Inspchar) {
                var labelQA5 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel6").setVisible(true);
                sap.ui.getCore().byId("QAip6").setVisible(true);
                sap.ui.getCore().byId("QAip6").setRequired(true);
                // sap.ui.getCore().byId("QALabel6_txt").setVisible(true);
                sap.ui.getCore().byId("QALabel6").setText(labelQA5);
              }
              if ("0070" === Inspchar) {
                var labelQA6 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel7").setVisible(true);
                sap.ui.getCore().byId("QAip7").setVisible(true);
                sap.ui.getCore().byId("QAip7").setRequired(true);
                // sap.ui.getCore().byId("QALabel7_txt").setVisible(true);
                sap.ui.getCore().byId("QALabel7").setText(labelQA6);
              }
              if ("0080" === Inspchar) {
                var labelQA7 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel8").setVisible(true);
                sap.ui.getCore().byId("QAip8").setVisible(true);
                sap.ui.getCore().byId("QAip8").setRequired(true);
                // sap.ui.getCore().byId("QALabel8_txt").setVisible(true);
                sap.ui.getCore().byId("QALabel8").setText(labelQA7);
              }
              if ("0090" === Inspchar) {
                var labelQA8 = data.results[i].CharDescr;
                sap.ui.getCore().byId("QALabel9").setVisible(true);
                // sap.ui.getCore().byId("QALabel9_txt").setVisible(true);
                sap.ui.getCore().byId("QAip9").setVisible(true);
                sap.ui.getCore().byId("QAip9").setRequired(true);
                sap.ui.getCore().byId("QALabel9").setText(labelQA8);
              }
              /*  if (9 <= Length) {
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
      //  oThis._oDialog1 = sap.ui.xmlfragment("MaizeProcurementPortal.MaizeProcurementPortal.view.PerformQA", oThis);
      //  //  this._oDialog.setModel(this.getView().getModel());
      // }
      // oThis._oDialog1.open();

    },

    onSubmitQADialog: function () {

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
      //  $("input").attr("required", "true");
      // var PositiveRegx = "^[+]?[0-9]$";

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
        /*  var unload_charge = sap.ui.getCore().byId("unload_charges").getValue();
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
          "Insplot": InspectionLot,
          // "Unlodchg": unload_charge,
          //  "Cashdisc": cash_disc,
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
      sap.ui.getCore().byId("QAip1").setValue("");

      sap.ui.getCore().byId("QALabel2").setVisible(false);
      sap.ui.getCore().byId("QAip2").setVisible(false);
      sap.ui.getCore().byId("QAip2").setValue("");

      sap.ui.getCore().byId("QALabel3").setVisible(false);
      sap.ui.getCore().byId("QAip3").setVisible(false);
      sap.ui.getCore().byId("QAip3").setValue("");

      sap.ui.getCore().byId("QALabel4").setVisible(false);
      sap.ui.getCore().byId("QAip4").setVisible(false);
      sap.ui.getCore().byId("QAip4").setValue("");

      sap.ui.getCore().byId("QALabel5").setVisible(false);
      sap.ui.getCore().byId("QAip5").setVisible(false);
      sap.ui.getCore().byId("QAip5").setValue("");

      sap.ui.getCore().byId("QALabel6").setVisible(false);
      sap.ui.getCore().byId("QAip6").setVisible(false);
      sap.ui.getCore().byId("QAip6").setValue("");

      sap.ui.getCore().byId("QALabel7").setVisible(false);
      sap.ui.getCore().byId("QAip7").setVisible(false);
      sap.ui.getCore().byId("QAip7").setValue("");

      sap.ui.getCore().byId("QALabel8").setVisible(false);
      sap.ui.getCore().byId("QAip8").setVisible(false);
      sap.ui.getCore().byId("QAip8").setValue("");

      sap.ui.getCore().byId("QALabel9").setVisible(false);
      sap.ui.getCore().byId("QAip9").setVisible(false);
      sap.ui.getCore().byId("QAip9").setValue("");

    },
    onCancelQADialog: function () {
      //QA Dialog Cancel perform here.
      this.refreshInputBinding();
      this._oDialog1.close();

    },
    OnEnableEditing: function () {

    },
    GeneratePayment: function () {
      //after QA completed  this function should be available when user clicks QA then
      //in dialog box payment calculated from backend and calculated on screen in display mode only.
      //cancel return to individual GP screen.

      //  MessageBox.success("Your Payment is Generated and your total Amount is  ₹ 22300");

      //after QA completed  this function should be available when user clicks QA then
      //in dialog box payment calculated from backend and calculated on screen in display mode only.
      //cancel return to individual GP screen.

      //  MessageBox.success("Your Payment is Generated and your total Amount is  ₹ 22300");

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
          //  oThis.byId("BtnGenPay").setVisible(true);
          //  oThis.onCancelQADialog();

          //  var QAMsg = oData.Message;

          //  // two condition of error and success messages&nbsp;
          //  //if error then no further process if success then perform QA and then PAyment
          //  if (QAMsg == "") {
          //    var parser = new DOMParser();
          //    var res = oResponse.headers["sap-message"];
          //    var xmlDoc = parser.parseFromString(res, "text/xml");
          //    var Number = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
          //    // sap.m.MessageToast.show(Number);
          //    MessageBox.error(Number);
          //  } else {
          //    // sap.m.MessageToast.show(QAMsg);
          //    MessageBox.success(QAMsg);
          //    oThis.byId("BtnGenQA").setVisible(true);
          //  }

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
      //  this.byId("VendName").setEditable(false);
      // Column2
      // this.byId("GatepassDate").setEditable(false);
      this.byId("PartyBill").setEditable(false);
      this.byId("PartyDate").setEditable(false);
      this.byId("BillWeight").setEditable(false);
      this.byId("Billbags").setEditable(false);
      this.byId("WeightSlipNo").setEditable(false);
      // this.byId("WtSlipDate").setEditable(false);

    },
    FieldEditFalseMigo: function () {

      // Column3
      this.byId("Store_loc").setEditable(false);
      this.byId("UnloadedWeight").setEditable(false);
      this.byId("UnloadBags").setEditable(false);
      this.byId("RejectedWeight").setEditable(false);
      this.byId("RejectedBags").setEditable(false);
      this.byId("TornedBags").setEditable(false);
      this.byId("AvgWtBag").setEditable(false);

      // Column4
      this.byId("ReceiptNum").setEditable(false);
      this.byId("MandiTax").setEditable(false);
      this.byId("OtherDeduct").setEditable(false);
      this.byId("AnyOtherDeduct").setEditable(false);
      this.byId("RateDiff").setEditable(false);

    },
    FieldEditTrue: function () {

      // Column1
      this.byId("LRGRno").setEditable(true);
      this.byId("Truckno").setEditable(true);
      this.byId("Station").setEditable(true);
      this.byId("TransDetail").setEditable(true);
      //  this.byId("VendName").setEditable(true);
      // Column2
      // this.byId("GatepassDate").setEditable(true);
      this.byId("PartyBill").setEditable(true);
      this.byId("PartyDate").setEditable(true);
      this.byId("BillWeight").setEditable(true);
      this.byId("Billbags").setEditable(true);
      this.byId("WeightSlipNo").setEditable(true);
      this.byId("Store_loc").setEditable(true);

      // Column3
      this.byId("UnloadedWeight").setEditable(true);
      this.byId("UnloadBags").setEditable(true);
      this.byId("RejectedWeight").setEditable(true);
      this.byId("RejectedBags").setEditable(true);
      this.byId("TornedBags").setEditable(true);

      // Column4
      this.byId("ReceiptNum").setEditable(true);
      this.byId("MandiTax").setEditable(true);
      this.byId("OtherDeduct").setEditable(true);
      this.byId("AnyOtherDeduct").setEditable(true);
      this.byId("RateDiff").setEditable(true);
      this.getView().byId("Quality_deduct").setEditable(true);
      this.getView().byId("Pay_Weight").setEditable(true);
      this.getView().byId("GunnyBag_deduct").setEditable(true);
      this.getView().byId("UnloadCharge_deduct").setEditable(true);
      this.byId("BtnGoodMov").setVisible(false);
      this.byId("BtnGenQA").setVisible(false);
      this.byId("BtnGenPay").setVisible(false);
      this.getView().byId("GPSave").setEnabled(true);
      this.getView().byId("GpCancel").setEnabled(true);

    },
    SetZeroVal: function () {
      this.byId("BillWeight").setValue("0.00");
      this.byId("UnloadedWeight").setValue("0.00");
      this.byId("UnloadBags").setValue("0.00");
      this.byId("RejectedWeight").setValue("0.00");
      this.byId("RejectedBags").setValue("0.00");
      this.byId("TornedBags").setValue("0.00");
      this.byId("RateDiff").setValue("0.00");
      this.byId("AvgWtBag").setValue("0");
    },

    // Code for Station code and Station Name (F4 help) Start

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
        error: function (error) {}
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
    },

    // Code for Station code and Station Name (F4 help) End

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.IndividualGpScreen
     */
    //  onBeforeRendering: function() {
    //
    //  },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.IndividualGpScreen
     */
    //  onAfterRendering: function() {
    //
    //  },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf MaizeProcurementPortal.MaizeProcurementPortal.view.IndividualGpScreen
     */
    //  onExit: function() {
    //
    //  }

  });

});