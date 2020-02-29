var request     = require("request")
var localCreds  = require("./util/creds.js")
var helpers     = require("./util/helpers.js")
var os          = require('os')
var url         = require("url")
var parseUrl    = require("url-parse-as-address")

module.exports = function(req, next, abort){

  var authenticateAndSave = function(callback){
    if (req.creds){
      helpers.space()  
    }
    hel