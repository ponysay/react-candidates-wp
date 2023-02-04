var nixt = require('nixt')
var should = require('should')
var pkg = require('../package.json')

var endpoint = typeof process.env.ENDPOINT !== 'undefined' ? ' -e ' + process.env.ENDPOINT + ' ' : ' '
var surge = 'node ' + pkg.bin + endpoint
var opts = {
  colors: false,
  newlines: false
}

describe('publish', function (done) {

  before(function (done) {
    this.timeout(1500)

    nixt(opts)
      .run(surge + 'logout') // Logout before the test starts
      .end(done)
  })

  it('Run `surge` to logi