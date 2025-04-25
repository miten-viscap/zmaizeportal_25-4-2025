sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "MaizeProcurementPortal/MaizeProcurementPortal/model/models",
  ],
  function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend(
      "MaizeProcurementPortal.MaizeProcurementPortal.Component",
      {
        metadata: {
          manifest: "json",
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */

        //	src="resources/sap-ui-core.js"
        //instead of hana link is replaced with this
        init: async function () {
          // call the base component's init function
          UIComponent.prototype.init.apply(this, arguments);

          // enable routing
          this.getRouter().initialize();

          // set the device model
          this.setModel(models.createDeviceModel(), "device");

          var oRootPath = jQuery.sap.getModulePath(
            "MaizeProcurementPortal.MaizeProcurementPortal"
          ); // your resource root

          let oImageModel = new sap.ui.model.json.JSONModel({
            path: oRootPath,
          });
          this.setModel(oImageModel, "imageModel");
        },
        getUserInfoService: function () {
          return new Promise((resolve) =>
            sap.ui.require(
              [
                "sap/ushell/Container", // In the future, "sap/ushell/Container" might need to be required instead. Refer to API reference.
              ],
              (sapUshellLib) => {
                // const Container = sapUshellLib.Container;
                const service = sapUshellLib.getServiceAsync("UserInfo"); // .getService is deprecated!
                resolve(service);
              }
            )
          );
        },
      }
    );
  }
);
