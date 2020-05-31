var helpers   = require("./util/helpers")
var fsReader  = require('surge-fstream-ignore')
var fs        = require("fs")
var ignore    = require("surge-ignore")

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' bytes';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KB','MB','GB','TB