const loadModules = require('../load-modules')
const path = require('path')

describe('load-modules.js', () => {
  it('成功加载模块', () => {
    const dir = path.join(__dirname, './fixtures')
    const services = loadModules(dir, 'service')
    const controllers = loadModules(dir, 'controller')

    expect(services).toEqual([
      { exports: {}, name: 'barBaz' },
      { exports: {}, name: 'foo' }
    ])
    expect(controllers).toEqual([{ exports: {}, name: 'user' }])
  })
})
