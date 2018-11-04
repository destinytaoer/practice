/**
 * ajax: 原生 ajax 封装库，简化 JQuery
 *
 * @parameter
 *   options: [Object]
 *     type: [String] 请求方式，默认 get
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

// function ajax(options) {
//   // 初始化数据
//   let {
//     type = "post",
//       url,
//       data,
//       dataType = 'json',
//       cache = false,
//       async = true,
//         success,
//         error
//   } = options;

//   //=> 判断 data 的处理方式
//   if (Object.prototype.toString.call(data) == '[object Object]') {
//     let str = '';
//     for (let k in data) {
//       if (data.hasOwnProperty(k)) {
//         str += `${k}=${data[k]}&`;
//       }
//     }
//     // 去掉最后的一个 &
//     str = str.slice(0, str.length - 1);
//   } else if (typeof data === 'string') {
//     str = data;
//   }

//   //=> 判断 type 是 get 还是 post 系列
//   //=> get 系列的，需要把 str 拼接到 url 的后面
//   //=> post 系列，直接将 str 传参到 send 即可
//   let isGet = null;
//   let getReg = /get|head|delete/i;
//   let postReg = /post|put/i;
//   if (getReg.test(type)) {
//     //就是个get请求
//     isGet = true;
//   } else if (postReg.test(type)) {
//     isGet = false;
//   };

//   // 若是个 get 请求，则需要把 url 进行拼接
//   if (isGet) {
//     if (cache) {
//       url += `?${str}`;
//     } else {
//       //=>若 cache 是 false，则表示不要走缓存，需要我们拼接一个随机数在 url 后边
//       url += `?${str}&t=` + Math.random();
//     }
//   }

//   let xhr = new XMLHttpRequest();

//   xhr.open(type, url, async);

//   xhr.onreadystatechange = function () {
//     // 请求成功
//     if (xhr.readyState == 4 && /^2\d{2}|304/.test(xhr.status)) {
//       //=> 根据 dataType 判断返回的数据格式
//       switch (dataType.toLowerCase()) {
//         case 'json':
//           // 需要把 JSON 字符串转成 JSON 对象，并传入成功函数
//           try {
//             let json = JSON.parse(xhr.responseText);
//             (success instanceof Function) && success(json);
//           } catch (e) {
//             (success instanceof Function) && success(xhr)
//           }

//           break;
//         case 'xml':
//           // 如果要求返回 xml格式，则直接传入原生 responseXML
//           (success instanceof Function) && success(xhr.responseXML);
//           break;
//       }
//     }

//     // 请求失败
//     if (/^[45]\d{2}/.test(xhr.status)) {
//       (error instanceof Function) && error(xhr);
//     }
//   }

//   //=> 设置请求头，使得后台接受的参数是 form data，而不是字符串
//   xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');

//   //=> 传入的是 data 拼接成的字符串
//   xhr.send(str);
// }

;(function () {
  function ajax(options) {
    return new init(options);
  }

  let init = function init(options = {}) {
    let {
      url,
      type = 'get',
      data = null,
      dataType = 'json',
      async = true,
      cache = false,
      success,
      error
    } = options;

    //=> 把配置项挂载到实例上
    ['url', 'type', 'data', 'dataType', 'async', 'cache', 'success', 'error'].forEach(item => {
      this[item] = eval(item);
    });
  }

  ajax.prototype = {
    constructor: ajax,
    //=> 初始化以及作为构造函数
    init,
    //=> 发送 Ajax 请求
    sendAjax() {
      this.handleData();
      this.handleCache();
      let {
        type,
        url,
        data,
        async,
        error,
        success
      } = this;
      xhr = new XMLHttpRequest();
      xhr.open(type, url, async);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          //=> error
          if (!/^(2|3)\d{2}$/.test(xhr.status)) {
            error && error(xhr.statusText, xhr);
            return;
          }
          //=> success
          let result = this.handleDataType(xhr);
          success && success(result, xhr);
        }
      };
      //=> 设置请求头，使得后台接受的参数是 form data，而不是字符串
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
      xhr.send(data);
    },
    //=> 处理 dataType
    handleDataType(xhr) {
      let dataType = this.dataType.toUpperCase(),
        result = xhr.responseText;

      //=> 这里只处理了 三种 格式
      switch (dataType) {
        case 'TEXT':
          break;
        case 'JSON':
          result = JSON.parse(result);
          break;
        case 'XML':
          result = xhr.responseXML;
          break;
      }
      return result;
    },
    //=> 处理 cache
    handleCache() {
      let {
        type,
        url,
        cache
      } = this;
      if (/^GET$/i.test(type) && cache === false) {
        //=> url 末尾追加时间戳
        url += `${this.checkURL()}_=${+(new Date())}`;
        this.url = url;
      }
    },
    //=> 处理 data
    handleData() {
      let {
        data,
        type
      } = this;
      if (!data) return;
      // 如果是对象，转换为 x-www-form-urlencoded 模式，方便后期传递给服务器
      if (typeof data === 'object') {
        let str = ``;
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            str += `${key}=${data[key]}&`
          }
        }
        data = str.slice(0, str.length - 1);
      }
      // 根据请求方式的不同，传递数据的方式不同
      if (/^(GET|DELETE|HEAD|TRACE|OPTIONS)$/i.test(type)) {
        this.url += `${this.checkURL()}${data}`;
        this.data = null;
        return;
      }
      this.data = data;
    },
    //=> 检测 URL中是否存在问号
    checkURL() {
      return this.url.indexOf('?') > -1 ? '&' : '?';
    }
  }
  //=> 借鉴 JQuery，使得 new ajax 或者直接使用 ajax 都会返回 ajax 的实例
  init.prototype = ajax.prototype;
  window.ajax = ajax;
})(window)