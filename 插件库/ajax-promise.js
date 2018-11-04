; (function (window) {
  
  function ajaxPromise(opts) {
    let {
      url,
      type = 'get',
      data = {},
      dataType = 'json',
      cache = false
    } = opts;

    //=> 处理 data
    if (typeof data === 'object') {
      let str = '';
      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          str += `${k}=${data[k]}&`;
        }
      }
      data = str.slice(0, str.length - 1);
    }

    // 判断是否是 get 类型请求
    if (/^(GET|DELETE|HEAD|TRACE|OPTIONS)$/i.test(type)) {
      let char = '';
      if (url.indexOf('?') === -1) {
        char = `?`;
      } else {
        url = url.replace(/&$/, '');
        char = `&`;
      }
      url += `${char}${data}`;
      data = null;
    }

    //=> 处理 cache
    if (/^GET$/i.test(type) && cache === false) {
      //=> url 末尾追加时间戳
      let char = '';
      if (url.indexOf('?') === -1) {
        char = `?`;
      } else {
        url = url.replace(/&$/, '');
        char = `&`;
      }
      url += `${char}_=${+(new Date())}`;
      this.url = url;
    }


    return new Promise(function (resolve, reject) {
      //=> 这里执行原生 Ajax
      let xhr = new XMLHttpRequest();
      xhr.open(type, url); // 默认异步
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}|304/.test(xhr.status)) {
          //=> 成功
          // 处理数据类型
          let data = xhr.responseText;
          switch (dataType.toLowerCase()) {
            case 'json':
              data = JSON.parse(data);
              break;
            case 'xml':
              data = xhr.responseXML;
            case 'text':
              break;
            default:
          }
          resolve(data);
        }

        if (xhr.readyState === 4 && /^[45]\d{2}/.test(xhr.status)) {
          //=> 失败
          reject(xhr);
        }
      };
      //=> 设置请求头，使得后台接受的参数是 form data，而不是字符串
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
      xhr.send(data);
    })
  }

  window.ajaxPromise = ajaxPromise;
}) (window);