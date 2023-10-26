sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("myapp.controller.View1", {
            onInit: function () {
                // if(!window.location.href.split("?")[1]){
                //     window.location.replace(`https://port4004-workspaces-ws-bs9xn.eu10.applicationstudio.cloud.sap/oktalogin/webapp/index.html`)
                // }
            }
        });
    });
