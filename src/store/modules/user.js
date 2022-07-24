import { setToken, removeToken, getToken, setTime } from '@/utils/auth.js'
import { getUserInfo, login, getUserDetailById } from '@/api/user.js'

// 状态
const state = {
  token: getToken(), // 存储token的值
  userInfo: {}// 存储用户信息
}
// 修改状态
const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 修改token的方法
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token的方法
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 删除用户信息的方法
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录请求
  async login(context, data) {
    const res = await login(data)
    // console.log(res)
    context.commit('setToken', res)
    setTime()
  },
  // 获取用户信息请求
  async getUserInfo(context) {
    const res = await getUserInfo()
    // console.log(res);
    const baseInfo = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...baseInfo })
  },
  // 退出登录
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
