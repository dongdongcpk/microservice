# 微服务框架

## 快速开始

访问：http://localhost:8080/base/user/1001 ，得到响应如下

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
|-- config // 应用配置
|     |-- app.yaml
|-- src
|     |-- app.js // 入口文件
|     |-- router.js // 路由
|     |-- controller
|     |     |-- user.js
|     |-- service
|     |     |-- foo.js
|     |-- middleware
|     |     |-- error.js
|     |-- lib
|     |     |-- config.js
|     |     |-- cronus.js // 核心依赖
```

## 配置

微服务框架启动后，会默认加载`config/app.yaml`文件

### 基础配置

```yml
serviceName: &serviceName my-service

port: 8080

log:
  name: *serviceName
  level: debug

baseURI: '/base'
```

## 中间件

微服务框架基于 Koa 的中间件形式，用户可自行添加所需中间件

```js
cronus.addMiddleware(async (ctx, next) => {
  ctx.body = 'hello world'
  await next()
})
```

## 路由

微服务框架约定`src/router.js`文件用于路由规则配置

定义示例：

```js
module.exports = app => {
  router.get('/user/:id', app.controller.user.info)
}
```

## 控制器（Controller）

### 如何编写 Controller

所有的 Controller 文件都必须放在`src/controller`目录下，我们可以通过定义 Controller 类的方式来编写代码，所有 Controller 需继承基类

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

与 Controller 类似，所有的 Service 文件必须放在`src/service`目录下，也需继承基类

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
