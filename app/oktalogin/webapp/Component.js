/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "oktalogin/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("oktalogin.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                if (window.location.href.split("#")[1]) {
                var urlParams = new URLSearchParams(window.location.href.split("#")[1]);
                var idToken = urlParams.get("id_token");
                sessionStorage.setItem("id_token", idToken);
                sessionStorage.setItem("state",urlParams.get("state"))
                window.location.replace(window.location.href.split("#")[0])
            }
            }
        });
    }
);