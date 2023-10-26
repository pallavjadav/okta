const axios = require('axios');
const qs = require('qs')

module.exports = cds.service.impl(function () {


  this.before("READ","*", async function(req){
    if(req.headers.id_token){
    var id_token = req.headers.id_token
    var {active} = await Introspect(id_token)
    if(!active){
      req.reject(401,"Unauthorized")
    }
  }
  })
  this.on("READ","Customers", async function (req) {
    // if (introspect.active) {
      let northwind_config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://3380ab75trial-trial.integrationsuitetrial-apim.us10.hana.ondemand.com:443/3380ab75trial/Customers?$format=json',
        headers: {}
      };

      var northwinddata = await axios.request(northwind_config)
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(northwinddata)
      return northwinddata.d.results
    // }
  })



  this.on("login", async function (req) {

    let data = JSON.stringify({
      "username": req.data.username,
      "password": req.data.password,
      "options": {
        "multiOptionalFactorEnroll": true,
        "warnBeforePasswordExpired": false
      }
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-87691202.okta.com/api/v1/authn',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: data
    };

    var res = await axios.request(config)
      .then((response) => {
        return response.data
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    //create session 
    // var session = await createSession(res.sessionToken) //session id is recieved
    console.log(res)
    //axios call - get cookie - send as header to ui5 
    // axios call to get access token 
    let data_f = qs.stringify({
      'grant_type': 'password',
      'username': 'test.user@gmail.com',
      'password': 'pallav123',
      'scope': 'openid'
    });

    let access_token_config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-87691202.okta.com/oauth2/v1/token',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic MG9hY3RyMnprYmluNGhid0Q1ZDc6Mnd1NUZRUWVuQWQ5Szgzb3hxMy05dWZLNzcydzlvRjB4allUVDVNRUZsOUxpRjktcDkwaUxjS1N0eEJzZE1Hag==',
        'Cookie': 'JSESSIONID=0C862E70A9FA2D45E1434E945E4BED84'
      },
      data: data_f
    };

    var access_token = await axios.request(access_token_config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data.access_token
      })
      .catch((error) => {
        console.log(error);
      });
    // introspect token - validate 
    let data_introspect = qs.stringify({
      'token': `${access_token}`,
      'token_type_hint': 'access_token'
    });

    let config_introspect = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-87691202.okta.com/oauth2/v1/introspect',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic MG9hY3RyMnprYmluNGhid0Q1ZDc6Mnd1NUZRUWVuQWQ5Szgzb3hxMy05dWZLNzcydzlvRjB4allUVDVNRUZsOUxpRjktcDkwaUxjS1N0eEJzZE1Hag==',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data_introspect
    };

    introspect = await axios.request(config_introspect)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(introspect);
    //call apim to get northwind data only if the jwt token is valid 


    return { sessionID: res.sessionToken }

  })

  async function Introspect(id_token){
    let data_introspect = qs.stringify({
      'token': `${id_token}`,
      'token_type_hint': 'access_token'
    });

    let config_introspect = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-87691202.okta.com/oauth2/v1/introspect',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic MG9hY3RyMnprYmluNGhid0Q1ZDc6Mnd1NUZRUWVuQWQ5Szgzb3hxMy05dWZLNzcydzlvRjB4allUVDVNRUZsOUxpRjktcDkwaUxjS1N0eEJzZE1Hag==',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data_introspect
    };

    var introspect = await axios.request(config_introspect)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data
      })
      .catch((error) => {
        console.log(error);
      });
    return introspect
  }

  async function createSession(sessionToken) {

    let data = JSON.stringify({
      "sessionToken": sessionToken
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-87691202.okta.com/api/v1/sessions',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'SSWS 00Ol6uEhK3EhM9BoZLaYDKLyv7XegzSVpZUpN8F6ve',
        'Cookie': 'DT=DI1-A7cv67ATGyeGfGKA768wg'
      },
      data: data
    };

    var sessiondetails = await axios.request(config)
      .then((response) => {

        console.log(JSON.stringify(response.data));
        return response.data
      })
      .catch((error) => {
        console.log(error);
      });

    return sessiondetails.id;
  }


  this.on("resetPassword", async function (req) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-87691202.okta.com/api/v1/users/pallavkumar.jadav@gmail.com/lifecycle/reset_password?sendEmail=true',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'SSWS 00ngitUTVYscbOc7rr04Z_yNp93gcgM3cyUT7mgltO',
        'Cookie': 'JSESSIONID=BF8DBC8F16F2051340ED0C8A712ABA31'
      }
    };

    var response = await axios.request(config)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return `error`
      });

    if (response == 'error') {
      return `error occured while resetting password`
    }

    return `If you email was found, we will send you a reset link on your mail`
  });


  this.on("enrollMFA", async function (req) {

    let data = JSON.stringify({
      "factorType": "token:software:totp",
      "provider": "GOOGLE"
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-87691202.okta.com/api/v1/users/00ub4991slN2tiIOs5d7/factors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'SSWS 00ngitUTVYscbOc7rr04Z_yNp93gcgM3cyUT7mgltO'
      },
      data: data
    };

    var response = await axios.request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return response.data._embedded.activation._links.qrcode

  })

})