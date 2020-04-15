const config = require('./config')
const Koa = require('koa')
const http = require('http')
const Logger = require('@sufang/logger')

class Cronus {
  constructor(config) {
    this.config = config
    this.app = new Koa()
    this.server = http.createServer(this.app.callback())
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server.once('error', reject)
      this.server.listen(this.config.port, resolve)
    })
  }

  async exit() {
    return new Promise((resolve, reject) => {
      this.server.close(err => {
        err ? reject(err): resolve()
      })
    })
  }

  initRouter(router) {
    this.app
      .use(router.routes())
      .use(router.allowedMethods())
  }

  getLogger() {
    if (this._logger) return this._logger
    this._logger = new Logger(this.config.log)
    return this._logger
  }

  addMiddleware(middleware) {
    this.app.use(middleware)
  }
}

module.exports = new Cronus(config)
