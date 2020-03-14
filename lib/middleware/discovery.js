

var moniker = require("moniker")
var fs      = require("fs")
var path    = require("path")
var os      = require("os")
var helpers = require("./util/helpers")

exports.suggestDomainFromCname = function(req, next){

  if (!req.domain && !req.suggestedDomain) {
    try {
      var cname = fs.readFileSync(path.join(req.project || process.cwd(), "CNAME")).toString()
      req.suggestedDomain = cname.split(os.EOL)[0].trim()
    }
    catch(e) {
      // console.log(e) // This will produce a visible error when there’s no CNAME file
    }
  }

  return next()
}

exports.setDomainFromCname = function(req, next){
  if (!req.domain && !req.suggestedDomain) {

    try {