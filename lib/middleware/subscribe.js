
var request     = require("request")
var url         = require("url")
var path        = require("path")
var helpers = require("./util/helpers")

module.exports = function(req, next, abort){

  var fields = { 
    plan: req.selectedPlan.id
  }

  if (req.paymentToken){
    fields.token = req.paymentToken
  }

  var subscribeUrl = req.domain
    