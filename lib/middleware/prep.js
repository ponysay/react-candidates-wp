var fs   = require("fs")
var path = require("path")
var tar  = require('tarr')
var zlib = require('zlib')
var fsReader  = require('surge-fstream-ignore')
var ignore = require("surge-ignore")

module.exports = function(req, next){
  var pack = tar.Pack()
  var zip = zlib.Gzip()
  var project = fsReader({ 'path': req.project, ignoreFiles: [".surgeignore"] })
  project.addIgnoreRules(ignore)

  req.tarb