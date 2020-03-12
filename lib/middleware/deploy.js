
var fs = require("fs")
var request   = require("request")
var helpers   = require('./util/helpers')
var localCreds  = require("./util/creds.js")
var tar  = require('tarr')
var zlib = require('zlib')
var fsReader  = require('surge-fstream-ignore')
var surge    = require('../surge')
var ProgressBar = require("progress")
var split = require("split")
var url = require("url")
var ignore = require("surge-ignore")


module.exports = function(req, next){
  req.success = false;

  /**
   * Some useful metadata
   */

  var headers = {
    "version" : req.pkg.version,
    "file-count": req.fileCount,
    "cmd": req.config.cmd,
    "project-size": req.projectSize,
    "timestamp": new Date().toJSON()
  }


  /**
   * Collaborators to add
   */

  if (req.argv.a)
    headers["add"] = req.argv.a;


  /**
   * Collaborators to remove
   */

  if (req.argv.r)
    headers["rem"] = req.argv.r;


  /**
   * Perform build on server
   */

  if (req.argv.build)
    headers["build"] = req.argv.build;


  /**
   * Force Protocol?
   */

  if (req.ssl !== null)
    headers["ssl"] = req.ssl

  req.headers = headers

  /**
   * Progress Bars
   */

  var progress = {}


  /**
   * Our upload "data" handle
   */

  var tick = function(tick){
    //console.log("tick", tick.toString())

    if (Object.keys(progress).length > 1) global.ponr = true
    //try {

      try {
        var payload  = JSON.parse(tick.toString())
      } catch(e) {
        //console.log(e)
        return;
      }


      if (payload.hasOwnProperty("type") && payload.type === "error") {
        console.log()
        console.log()
        helpers.log("   Processing Error:".yellow, payload.error.filename).log()

        console.log(helpers.stacktrace(payload.error.stack, { lineno: payload.error.lineno }))
        helpers.log()
        console.log("  ", payload.error.message)

        console.log()
        process.exit(1)
        req.status = req.status || "Compile Error"
      } else

      if (payload.hasOwnProperty("type") && payload.type === "users") {
        helpers.log(helpers.smart("users:").grey, payload.users.join(", "))
      } else

      if (payload.hasOwnProperty("type") && payload.type === "collect") {
        //console.log("payload:collect", payload)
        var msg = ("   " + payload.plan.name.underline + " plan requred. ").grey + ("$" + (payload.plan.amount / 100) + "/mo with a " + payload.plan.trial_period_days + " day trial").underline.grey

        helpers.log()
        if (payload.hasOwnProperty("perks")) {
          helpers.log(msg += "\n\n     Includes...".blue)
          payload.perks.forEach(function(perk){
            helpers.log(("       - " + perk).blue)
          })
          helpers.log()
        } else {
          helpers.log(msg)
        }

        req.plan = payload.plan.name

        helpers.payment(req, payload["stripe_pk"], payload.card)(function(token){

          // can this be passed in?
          var uri = url.resolve(req.endpoint, "subscription")
          request({
            uri: uri,
            method: "PUT",
            auth: {
              'user': 'token',
              'pass': req.creds.token,
              'sendImmediately': true
            },
            form: {
              plan: payload.plan.id,
              token: token,
              timestamp: req.headers.timestamp
            }
          }, function(e,r,b){
            if (r.statusCode == 201 || r.statusCode == 200) {
              //console.log("here")