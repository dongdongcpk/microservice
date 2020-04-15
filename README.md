# 微服务框架

## 快速开始

本工程仅提供 demo 演示，`请勿直接提交代码至该工程下`，请创建新的工程并拷贝该示例至新工程下

```bash
$ git clone git@git.caimi-inc.com:client/microservice.git
$ cd microservice
$ npm install
$ npm start
```

访问：http://localhost:8080/foo/user/1000 ，得到响应如下

```json
{
  "code": 0,
  "data": {
    "bar": "hello world"
  }
}
```

## 目录结构

```
microservice
|-- package.json
|-- process.json // 部署配置
|-- config // 应用配置
|     |-- app.yaml
|     |-- app.test.yaml
|     |-- app.staging.yaml
|     |-- app.production.yaml
|-- server
|     |-- server.js // 入口文件
|     |-- router.js // 路由
|     |-- controller
|     |     |-- home.js
|     |-- service
|     |     |-- user.js
|     |-- middleware
|     |     |-- error-handler.js
|     |-- lib
|     |     |-- config.js
|     |     |-- cronus.js // 核心依赖
```

## 配置

微服务框架启动后，会默认加载`config/app.yaml`文件，针对不同环境的配置，代码中提供的文件仅为配置的备份，基于obelisk3部署，请将不同环境的配置保存在obelisk平台的打包配置中

### 基础配置

```yml
serviceName: xxx-service

port: 8080

# 是否开启 debug 模式，该模式下会输出 debug 级别日志
debug: true

baseURI: '/foo'

# 数据库配置，按需开启
# mysql:
#   - 
#     database: ''
#     JDBC_PROPS_URL: ''
#     DRUID_DECRYPT_KEY: ''

# redis:
#     schema: ''
#     appKey: ''
#     appId: ''
```

## 中间件

微服务框架基于 Koa 的中间件形式，用户可自行添加所需中间件

```js
cronus.addMiddleware(async (ctx, next) => {
  ctx.body = 'hello world'
  await next()
})
```

### 内置中间件

* 日志中间件，业务开发时可直接使用`ctx.log`或者`ctx.logger`对象，二者是一致的
* fetch中间件，该中间件提供`@wac/hakone`的能力，并绑定到上下文`ctx.fetch`
* 错误中间件，该中间件默认会对应用中未捕获的错误进行兜底拦截

## 路由

微服务框架约定`server/router.js`文件用于路由规则配置

定义示例：

```js
module.exports = app => {
  router.get('/user/:id', app.controller.user.info)
}
```

## 控制器（Controller）

### 如何编写 Controller

所有的 Controller 文件都必须放在`server/controller`目录下，我们可以通过定义 Controller 类的方式来编写代码，所有 Controller 需继承基类

```js
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
}
```

基类默认提供以下属性：

* `this.ctx`：当前请求的上下文 Context 对象
* `this.service`：应用定义的 Service，通过它我们可以访问到抽象出的业务层

## 服务（Service）

与 Controller 类似，所有的 Service 文件必须放在`server/service`目录下，也需继承基类

foo.js

```js
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
```

bar.js

```js
const Service = require('./base')

module.exports = class BarService extends Service {
  async query() {
    return 'hello world'
  }
}
```

基类默认提供以下属性：

* `this.ctx`：当前请求的上下文 Context 对象
* `this.service`：应用定义的 Service，通过它我们可以访问到抽象出的业务层

## 内置对象

### 日志

logger 对象，上面有四个方法（`debug`，`info`，`warn`，`error`），分别代表打印四个不同级别的日志

```js
const cronus = require('./lib/cronus')
const logger = cronus.getLogger()
logger.debug()
logger.info()
logger.warn()
logger.error()
```

### MySQL

参考`@wac/mysql-client`

```js
const mysqlClient = cronus.getMySQLClient('db_name')
const result = await mysqlClient.query('select * from xxx')
```

### Redis

参考`@wac/redis-client`

```js
const redisClient = cronus.getRedisClient()
const result = await redisClient.get('key')
```

## 原 wax 项目迁移

1. 将 wax 应用 node 目录迁移到微服务框架`./server/node`下
2. 重新整理依赖到`package.json`
3. 修改`package.json`中 name 为对应 wax 应用
4. 在 uav 中申请 artifactId
5. 在 obelisk3 进行打包部署
6. 部署后，将原域名路径重新指向新的服务
7. 迁移完成

### 注意事项

* `baseDir`由于迁移之后的层级变化，如有依赖该变量的，需作出调整
* body parser 由于各项目使用上的差异，该中间件没有作为内置，可在微服务框架中按需开启
* 配置以微服务框架为准，框架配置会覆盖 wax 应用配置，需注意

## 开发人员

@苏枋 @宁远
