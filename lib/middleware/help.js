var helpers = require("./util/helpers")

module.exports = function(req, next){
  if (req.argv.help || req.argv.h) {
    helpers
      .log()
      .log("  " + req.config.name.bold, "– single command web publishing.".grey, ("(v" + req.pkg.version + ")"). grey)
      .log()
      .log("  Usage:".grey)
      .log("    "+ req.config.name +" <project> <domain>")
      .log()
      .log("  Options:".grey)
      .log("    -a, --add           add