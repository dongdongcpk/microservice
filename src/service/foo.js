const Service = require('./base')

module.exports = class FooService extends Service {
  async query() {
    const { service } = this
    const ret = await service.bar.query()
    return {
      bar: ret
    }
  }
}
