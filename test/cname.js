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
    .on(/.*password:.*/).respond(pass + "\n")
    .run(surge + './test/fixtures/projects/cname-world')
    .expect(function (result) {
      should(/Success/).match(/Success/)
    }).end(done)
  })

  it('should access cname file when no arg present', function (done) {
    this.timeout(1500)
    nixt(opts)
    .exec(surge + 'logout')
    .on(/.*email:.*/).respond(user + "\n")
    .on(/.*password:.*/).respond(pass + "\n")
    .run(surge + './test/fixtures/projects/cname-world')
    .expect(function (result) {
      should(result.stdout).match(/2 file/)
      should(result.stdout).match(/Success! Project is published and running at cli-test-2/)
    }).end(done)
  })

  it('`surge` with CNAME file and protocol', function (done) {
    this.timeout(1500)
    nixt(opts)
      .run(surge + './test/fixtures/cli-test-3.surge.sh')
      .expect(function (result) {
        should(result.stdout).match(/2 file/)
        should(result.stdout).match(/Success! Project is published and running at cli-test-3/)
      })
      .end(done)
  })
  it('`surge` with CNAME file and sub