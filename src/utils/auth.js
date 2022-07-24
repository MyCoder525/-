import Cookies from 'js-cookie'

const TokenKey = 'hrsass_token' // token存储到本地存储 token的key
const timeKey = 'time_key' // token的过期时间

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取token的过期时间
export function getTime() {
  return Cookies.get(timeKey)
}
// 设置token的过期时间
export function setTime() {
  return Cookies.set(timeKey, Date.now())
}
