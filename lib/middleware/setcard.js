
var request     = require("request")
var url         = require("url")
var helpers     = require("./util/helpers")

module.exports = function(req, next, abort){

  if (!req.paymentToken){
    helpers.log()
    if (req.card){
      helpers.trunc("Success".green + " - Using existing card.".grey)
    } else {
      helpers.trunc("Aborted".yellow + " - No card set.".grey)
    }
    helpers.space()
  } else {

    var fields = {}

    if (req.paymentToken){
      fields.token = req.paymentToken
    }

    request({
      uri: url.resolve(req.endpoint, "card"),
      method: "PUT",
      aut