
var request     = require("request")
var url         = require("url")
var helpers     = require("./util/helpers")
var path        = require("path")
var fs          = require("fs")
var os          = require("os")
var parseUrl    = require("url-parse-as-address")

module.exports = function(req, next, abort){

  var plus = function(domain){
    var options = {
      'url': url.resolve(req.endpoint, domain + "/subscription"),
      'method': 'get',
      'auth': {
        'user': "token",
        'pass': req.creds.token,
        'sendImmediately': true
      }
    }

    request(options, function(e, r, obj){
      if (e) throw e

      var payload = JSON.parse(obj)

      var msg = "      Project req