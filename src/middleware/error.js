module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      error: err.message
    }
  }
}