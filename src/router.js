const Router = require('@koa/router')

module.exports = (app, config) => {
  const router = new Router({
    prefix: config.baseURI
  })

  router.get('/user/:id', app.controller.user.info)
  router.post('/user', app.controller.user.create)

  return router
}
