const cronus = require('../lib/cronus')
const logger = cronus.getLogger()

module.exports = (ctx, next) => {
  ctx.logger = logger.child({ type: 'app' })
  return next()
}