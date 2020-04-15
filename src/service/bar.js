const Service = require('./base')

module.exports = class BarService extends Service {
  async query() {
    return 'hello world'
  }
}
