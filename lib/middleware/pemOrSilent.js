var helpers = require("./util/helpers")
var moniker = require("moniker")
var fs = require("fs")
var path = require("path")
var os = require("os")

module.exports = function(req, next, abort){
  var label = helpers.smart("pem file:").grey
  var pemPath
  var getPem = function(placeholder){
    req.read({
      prompt: label,
      default: p