using { metadata as external } from './external/metadata';

service okta {

    entity Customers as projection on external.Customers;
    function resetPassword() returns String;
    function enrollMFA() returns String; 
    function login(username: String, password : String) returns {sessionID: String};

}