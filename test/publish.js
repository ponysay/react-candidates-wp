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

  it('Run `surge` to login and publish', function (done) {
    this.timeout(1500)
    nixt(opts)
      .run(surge)
      .on(/.*email:.*/).respond('brock+test@chloi.io\n')
      .on(/.*password:.*/).respond('12345\n')
      .on(/.*project:.*/).respond('./test/fixtures/cli-test.surge.sh\n')
      .on(/.*domain:.*/).respond('cli-test.surge.sh\n')
      .expect(function (result) {
        should(result.stdout).not.match('12345')
        should(result.stdout).match(/1 file/)
        should(result.stdout).match(/Success! Project is published and running at cli-test/)
      })
      .end(done)
  })
  it('Run `surge` when already logged in', function (d