const Controller = require('./base')

module.exports = class UserController extends Controller {
  async info() {
    const { ctx, service } = this
    const ret = await service.foo.query()
    ctx.body = {
      code: 0,
      data: ret
    }
  }

  async create() {
    const { ctx } = this
    ctx.logger.info('create a user')
    ctx.body = {
      code: 0,
      data: ctx.request.body
    }
  }
}
