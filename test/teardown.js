var nixt = require('nixt')
var should = require('should')
var pkg = require('../package.json')

var endpoint = typeof process.env.ENDPOINT !== 'undefined' ? ' -e ' + process.env.ENDPOINT + ' ' : ' '
var surge = 'node ' + pkg.bin + endpoint
var opts = {
  colors: false,
  newlines: false
}

describe('teardown', function () {

  var subdomain = ''

  before(function (done) {
    this.timeout(1500)

    nixt(opts)
      .exec(surge + 'logout') // Logout before the test starts
      .run(surge)
      .on(/.*email:.*/).respond('brock+test@