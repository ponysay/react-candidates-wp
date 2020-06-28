

var middleware  = require('./middleware')
var skin        = require('./middleware/util/skin.js')
var help        = require('./middleware/help')
var read        = require("read")
var minimist    = require('minimist')


var whitelist   = require("./middleware/whitelist")
var endpoint    = require("./middleware/endpoint")
var pkg         = require("./middleware/pkg")
var version     = require("./middleware/version")
var welcome     = require("./middleware/welcome")
var creds       = require("./middleware/creds")
var whoami      = require("./middleware/whoami")
var tokencheck  = require("./middleware/tokencheck")
var email       = require("./middleware/email")
var auth        = require("./middleware/auth")
var logout      = require("./middleware/logout")
var help        = require("./middleware/help")
var project     = require("./middleware/project")
var size        = require("./middleware/size")
var domain      = require("./middleware/domain")
var protocol    = require("./middleware/protocol")
var deploy      = require("./middleware/deploy")
var domainOrSilent      = require("./middleware/domainOrSilent")
var pemOrSilent      = require("./middleware/pemOrSilent")
var ipaddress   = require("./middleware/ipaddress")
var login       = require("./middleware/login")
var shorthand   = require("./middleware/shorthand")
var list        = require("./middleware/list")
var token       = require("./middleware/token")
var teardown    = require("./middleware/teardown")
var discovery   = require("./middleware/discovery")
var plus        = require("./middleware/plus")

var subscription= require("./middleware/subscription")
var plans       = require("./middleware/plans")
var plan        = require("./middleware/plan")
var payment     = require("./middleware/payment")
var card        = require("./middleware/card")
var setcard     = require("./middleware/setcard")
var subscribe   = require("./middleware/subscribe")

var ssl         = require("./middleware/ssl")
var log         = require("./middleware/log")
var helpers     = require('./middleware/util/helpers')




var exitifcurrentplan = function(req, next){
  if (req.plans.current && req.plans.current.id === req.selectedPlan.id){
    helpers.trunc("Success".green + (" - You remain on the " + req.plans.current.name.underline + " plan.").grey)
    helpers.space()
    process.exit()
  }else{
    return next()
  }
}


var space = function(req, next){ 
  helpers.space()
  next() 
}

var parse = function(arg){
  if(arg.hasOwnProperty("parent") && arg.parent.hasOwnProperty("rawArgs")){
    arg = arg.parent.rawArgs.slice(3)
  } else if (arg.argv && arg.argv._) {
    arg = arg.parsed.argv._.slice(1)
  }
  return arg instanceof Array
    ? minimist(arg)
    : arg
}

module.exports = function(config){
  config = config || {}

  var ep = config.endpoint
    ? config.endpoint
    : config.platform ? "https://surge." + config.platform : 'https://surge.surge.sh'

  config.platform = config.platform || "surge.sh"
  config.name = config.name || "surge"

  var options = {
    alias: {
      p: 'project',
      d: 'domain',
      e: 'endpoint',
      a: 'add',
      r: 'remove'
    },
    default: { e: ep }
  }

  var authInfo = function(req, next){
    var str = ("Running as " + req.account.email.underline).grey
    if (req.account.plan){ str = str + (" (" + req.account.plan.name + ")").grey }
    helpers.space()
    helpers.trunc(str)
    helpers.space()
    return next()
  }

  var surge = function(args){
    // will be one of:
    // commander, yargs, process.argv.split(2), OR minimist

    var argv = minimist(args, options)
    var cmd  = argv._[0]

    var commands = ["login", "logout", "whoami", "list", "publish", "teardown", "token", "plus", "ssl", "plan", "card"]