// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import router from '@/router'

// 定义超时时间
const timeout = 6000000
function isCheckTime() {
  return Date.now() - getTime() < timeout
}
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建一个axios的实例

// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters.token

  if (token) {
    if (isCheckTime()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      Message.error('登录超时，请重新登录')
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('登录超时，请重新登录'))
    }
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
  const { data: { success, data, message } } = response
  if (success) {
    return data
  }
  Message.error(message || '系统错误')
  return Promise.reject(message || '系统错误')
}, error => {
  // 添加一些错误处理
  if (error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  Message.error(error.response?.status?.message || '系统错误')
  return Promise.reject(error)
})

export default request // 导出axios实例
