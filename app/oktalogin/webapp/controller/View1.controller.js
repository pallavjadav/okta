sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("oktalogin.controller.View1", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    username: "test.user@gmail.com",
                    password: "pallav123"
                })
                this.getView().setModel(oModel, "userModel")
                //CHECK ID TOKEN from url
                if (sessionStorage.id_token) {
                    //validate id_token 
                    this.getOwnerComponent().getModel().setHeaders({
                        id_token : sessionStorage.id_token
                    })
                    this.getOwnerComponent().getModel().read("/Customers",{
                        success: function(odata){
                            
                            this.getView().byId("logged").setVisible(true)
                            this.getView().byId("logout").setVisible(true)
                        }.bind(this),
                        error:function(err){

                        }.bind(this)
                    })
                } else if(sessionStorage.getItem("id_token")){


                } else{
                    this.getView().byId("login").setVisible(true)
                }


            },
            onsubmit: function () {
                var { username, password } = this.getView().getModel("userModel").getData()
                var payload = {
                    username: username,
                    password: password
                }
                this.getOwnerComponent().getModel().callFunction("/login", {
                    urlParameters: payload,
                    success: function (odata) {
                        // $.ajax({
                        //     type: "GET",
                        //     // url: `https://dev-87691202.okta.com/oauth2/v1/authorize?client_id=0oab9tvczfr3g1hm15d7&response_type=id_token&scope=openid&prompt=none&redirect_uri=https://port4004-workspaces-ws-bs9xn.eu10.applicationstudio.cloud.sap/oktalogin/webapp/index.html&state=Af0ifjslDkj&nonce=n-0S6_WzA2Mj&sessionToken=${odata.login.sessionID}`,
                        //     url:`https://dev-87691202.okta.com/oauth2/v1/authorize?client_id=0oab9tvczfr3g1hm15d7&response_type=code&scope=openid&prompt=none&redirect_uri=https://port4004-workspaces-ws-bs9xn.eu10.applicationstudio.cloud.sap/myapp/webapp/index.html&state=Af0ifjslDkj&sessionToken=${odata.login.sessionID}`,
                        //     success: function(data, textStatus, jqXHR) {
                        //     console.log('success')                  
                        //     }

                        //     });
                        // window.location.replace(`https://dev-87691202.okta.com/login/sessionCookieRedirect?token=${odata.login.sessionID}&redirectUrl=https://port4004-workspaces-ws-bs9xn.eu10.applicationstudio.cloud.sap/oktalogin/webapp/index.html`)
                        window.location.replace(`https://dev-87691202.okta.com/oauth2/v1/authorize?client_id=0oab9tvczfr3g1hm15d7&response_type=id_token&nonce=abcd12345nMjhut&scope=openid&prompt=none&redirect_uri=https://port4004-workspaces-ws-bs9xn.eu10.applicationstudio.cloud.sap/oktalogin/webapp/index.html&state=Af0ifjslDkj&sessionToken=${odata.login.sessionID}`)
                    }.bind(this),
                    error: function (error) {

                    }.bind(this)
                })
            },
            nextpage: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView2");
            },
            logout: function(){
                var post_logout_redirect_uri = `www.google.com`
                window.location.replace(`https://dev-87691202.okta.com/oauth2/default/v1/logout?id_token_hint=${sessionStorage.id_token}&post_logout_redirect_uri=${post_logout_redirect_uri}&state=${sessionStorage.state}`)
            }
        });
    });
