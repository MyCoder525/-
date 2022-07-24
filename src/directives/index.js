// 定义自定义指令
// 解决图片报错问题
export const imgError = {
  inserted(el, options) {
    // console.log(el);
    // console.log(options);
    el.onerror = function () {
      el.src = options.value
    }
  }
};

// 自定义指令
export const focus = {
  inserted(el) {
    el.focus();
  }
}