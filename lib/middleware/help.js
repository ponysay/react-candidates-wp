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
      .log("    -a, --add           adds user to list of collaborators (email address)")
      .log("    -r, --remove        removes user from list of collaborators (email address)")
      .log("    -V, --version       show the version number")
      .