
var request     = require("request")
var url         = require("url")
var helpers     = require("./util/helpers")
var path        = require("path")
var fs          = require("fs")
var os          = require("os")
var parseUrl    = require("url-parse-as-address")

module.exports = function(req, next, abort){

  var remove = function(domain){
    var options = {
      'url': url.resolve(req.endpoint, domain),
      'method': 'delete',
      'auth': {
        'user': "to