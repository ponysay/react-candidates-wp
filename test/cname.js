var nixt = require('nixt')
var should = require('should')
var pkg = require('../package.json')

var endpoint = typeof process.env.ENDPOINT !== 'undefined' ? ' -e ' + process.env.ENDPOINT + ' ' : ' '


var user = "brock+test@chloi.io"
var pass = "12345"
var surge  = 'node ' + pkg.bin + endpoint


var opts = {
  colors: false,
  newlines: false
}

describe('crud', function (done) {

  describe("publish", function(done){

  })

  it('work', function (done) {
    this.timeout(1500)
    nixt(opts)
    .exec(surge + 'logout')
    .on(/.*email:.*/).respond(user + "\n")
    .on(/.*password:.*/).respond(