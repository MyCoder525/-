// 权限拦截 导航守卫 路由守卫  router
import router from '@/router';
import store from "@/store";

// import NProgress from 'nprogress' // 引入一份进度条插件
// import 'nprogress/nprogress.css' // 引入进度条样式

const loginPath = "/login";
const notFoundPath = "/404";
const whiteList = [loginPath, notFoundPath];

// 监听路由的变化
router.beforeEach(async (to, from, next) => {
  // NProgress.start() // 开启进度条
  // 判断是否登录
  const token = store.getters.token
  if (token) {
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo');
    }
    if (to.path === loginPath) {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(loginPath)
    }
  }
  // NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
// router.afterEach(function () {
//   NProgress.done() // 关闭进度条
// })