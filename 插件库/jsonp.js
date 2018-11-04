/**
 * jsonp: jsonp 跨域获取数据
 *
 * @parameter
 *   url [String] 请求地址
 *   params [obj] 传递的参数
 *   cb [String] 回调函数名称
 *
 * @return
 *   [Promise]: Promise 实例
 *
 * by destiny on date
 */
fucntion jsonp({ url, params, cb }) {
  //=> 创建一个 script 标签
  let script = document.createElement('script');

  //=> 创建全局函数 cb，在获取数据完毕后，会自动执行这个函数
  // 从而触发 resolve，并移除这个完成使命的 script 元素
  window[cb] = function (data) {
    resolve(data);
    document.body.removeChild(script);
  }

  //=> 拼接参数
  params = {
    ...params,
    cb
  };
  let arr = [];
  for (let k in params) {
    arr.push(`${k}=${params[k]}`);
  }

  //=> 将拼接好的 url 放入 script 标签的 src 属性中，然后把这个元素插入到 body 中
  script.src = `${url}?${arr.join('&')}`;
  document.body.appendChild(script);
}