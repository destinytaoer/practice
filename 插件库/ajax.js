/**
 * ajax: 原生 ajax 封装库
 *
 * @parameter
 *   options: [Object]
 *     type: [String] 请求方式，默认 post
 *     url: [String] 请求地址
 *     data: [Object] 发送的数据
 *     dataType: [String] 数据类型，json/xml, 默认 json
 *     cache: [Boolean] 是否缓存，默认不缓存
 *     async: [Boolean] 同步或异步，默认异步
 *     success: [Function] 请求成功的回调，传入获取的数据
 *     error: [Function] 请求失败的回调，传入 XHR 对象
 *
 * @return
 *   nothing
 *
 * by destiny on 2018-09-05
 */

function ajax(options) {
  // 初始化数据
  let {
    type = "post",
      url,
      data,
      dataType = 'json',
      cache = false,
      async = true,
        success,
        error
  } = options;

  //=> 判断 data 的处理方式
  if (Object.prototype.toString.call(data) == '[object Object]') {
    let str = '';
    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        str += `${k}=${data[k]}&`;
      }
    }
    // 去掉最后的一个 &
    str = str.slice(0, str.length - 1);
  } else if (typeof data === 'string') {
    str = data;
  }

  //=> 判断 type 是 get 还是 post 系列
  //=> get 系列的，需要把 str 拼接到 url 的后面
  //=> post 系列，直接将 str 传参到 send 即可
  let isGet = null;
  let getReg = /get|head|delete/i;
  let postReg = /post|put/i;
  if (getReg.test(type)) {
    //就是个get请求
    isGet = true;
  } else if (postReg.test(type)) {
    isGet = false;
  };

  // 若是个 get 请求，则需要把 url 进行拼接
  if (isGet) {
    if (cache) {
      url += `?${str}`;
    } else {
      //=>若 cache 是 false，则表示不要走缓存，需要我们拼接一个随机数在 url 后边
      url += `?${str}&t=` + Math.random();
    }
  }

  let xhr = new XMLHttpRequest();

  xhr.open(type, url, async);

  xhr.onreadystatechange = function () {
    // 请求成功
    if (xhr.readyState == 4 && /^2\d{2}|304/.test(xhr.status)) {
      //=> 根据 dataType 判断返回的数据格式
      switch (dataType.toLowerCase()) {
        case 'json':
          // 需要把 JSON 字符串转成 JSON 对象，并传入成功函数
          try {
            let json = JSON.parse(xhr.responseText);
            (success instanceof Function) && success(json);
          } catch (e) {
            (success instanceof Function) && success(xhr)
          }

          break;
        case 'xml':
          // 如果要求返回 xml格式，则直接传入原生 responseXML
          (success instanceof Function) && success(xhr.responseXML);
          break;
      }
    }

    // 请求失败
    if (/^[45]\d{2}/.test(xhr.status)) {
      (error instanceof Function) && error(xhr);
    }
  }

  //=> 设置请求头，使得后台接受的参数是 form data，而不是字符串
  xhr.setRequestHeader('content-type','application/x-www-form-urlencoded;charset=utf-8');

  //=> 传入的是 data 拼接成的字符串
  xhr.send(str);
}