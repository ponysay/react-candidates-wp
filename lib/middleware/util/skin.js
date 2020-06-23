
// lets onion skin cli!!
//
module.exports = function(req, stack, abort){

  abort = abort || function(msg){
    console.log("\n")
    msg === null
      ? console.log("   Aborted".yellow)
      : console.log("  