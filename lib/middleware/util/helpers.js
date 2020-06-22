
var colors      = require("colors")
var request     = require("request")
var localCreds  = require("./creds.js")
var os          = require('os')
var url         = require("url")
var urlAddy     = require("url-parse-as-address")
var read        = require("read")
var isDomain    = require("is-domain")
var s           = 0
var pkg         = require("../../../package.json")


exports.read = read


var sig = '[' + 'surge'.cyan + ']'
sig = null


var reset = exports.reset = function(){
  s = 0
}

var show = exports.show = function(){
  process.stdout.write(s.toString())
}


var space = exports.space = function(){
  if (s === 0){
    s++
    console.log()
  }
}

var span = exports.gap = function(){
  s = 1
}

var log = exports.log = function(){
  var args = Array.prototype.slice.call(arguments)
  args.unshift(sig)
  args = args.filter(function(n){ return n != undefined });
  console.log.apply(console, args)
  s = 0
  return this
};

var hr = exports.hr = function(){
  return console.log()
};

var smart = exports.smart = function(str){
  var difference = 16 - str.length
  var rsp = ""
  for(var i=0; i < difference; i++){
    rsp += " "
  }
  return rsp + str
}

var trunc = exports.trunc = function(arg){
  log("   " + arg)
  s = 0
  return this
}


exports.stacktrace = function(str, options){
  var lineno  = options.lineno  || -1
  var context = options.context || 8
  var context = context = context / 2
  var lines   = (os.EOL + str).split(os.EOL)
  var start   = Math.max(lineno - context, 1)
  var end     = Math.min(lines.length, lineno + context)

  if(lineno === -1) end = lines.length

  var pad     = end.toString().length

  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start
    return (curr == lineno ? ' > ' : '   ')
      + Array(pad - curr.toString().length + 1).join(' ')
      + curr
      + '| '
      + line
  }).join(os.EOL)

  return context
}


var fetchAccount = exports.fetchAccount = function(endpoint){

  return function(email, pass, callback){
    var options = {
      'url': url.resolve(endpoint.format(), '/account'),
      'method': 'get',
      headers: { version: pkg.version },
      'auth': {
        'user': "token",
        'pass': pass || "",
        'sendImmediately': true
      }
    }
    request(options, function(e, r, obj){
      if (e) throw e
      
      if (r.statusCode == 200){
        return callback(null, JSON.parse(obj))
      } else if (r.statusCode == 417){
        space()
        trunc("Aborted".yellow + " - your client requires upgrade".grey)
        space()
        process.exit(1)
      } else if (r.statusCode == 503){
        space()
        trunc("Error".red + " - Deployment endpoint temporarily unreachable".grey)
        space()
        process.exit(1)
      }else{
        return callback(JSON.parse(obj))
      }
    })
  }
}


var fetchToken = exports.fetchToken = function(endpoint){

  return function(email, pass, callback){

    var options = {
      'url': url.resolve(endpoint.format(), '/token'),
      'method': 'post',
      'auth': {
        'user': email,
        'pass': pass || "",
        'sendImmediately': true
      }
    }

    request(options, function(e, r, obj){
      if (e) throw e

      if(r.statusCode == 417){
        console.log()
        console.log("     Update Required".yellow, "-", obj)
        console.log()
        process.exit(1)
      } else if(r.statusCode == 401){
        var obj = JSON.parse(obj)
        return callback(obj, null)
      }else{
        try {
          var o = JSON.parse(obj)
          localCreds(endpoint).set(obj.email, o.token.replace(os.EOL, ""))
          return callback(null, o)
        } catch(e){
          return callback({"messages": ["password required"]})
        }

      }
    })
  }
}

var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i

exports.loginForm = function(req, callback){
  var count = 0

  var abort = function(msg){
    console.log()
    console.log("   " + "Aborted".yellow + (" - " + msg).grey)
    console.log()
    process.exit(1)
  }

  var promptEmail = function(suggestion, cb){
    req.read({
      silent: false,
      prompt: smart("email:").grey,
      default: suggestion,
      edit: true,
      terminal: req.config.terminal,
      output: req.config.output,
      input: req.config.input
    }, function(err, answer){
      if (answer === undefined) {
        console.log()
        return abort("Not authenticated.".grey)
      }
      if (!pattern.test(answer)){
        return promptEmail(answer, cb)
      } else {
        req.email = answer
        return cb()
      }
    })
  }
