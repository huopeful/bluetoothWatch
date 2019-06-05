import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
// 导入modules下面所有的js文件
const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
// 自动导入所有的vuex模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  state: { //  这里相当于Vue实例中的data，用于存放数据
    alarmCount: 0
  },
  mutations: { //  这里相当于Vue实例中的methods，用于定义方法 所有的方法都过来拿
    modifyAlarmCount(state, count) { // state是个形参 是state对象里面的数据都可以拿到 不通过this来拿
      state.alarmCount = count
    }
  }
})

export default store
