var utils = (function() {
  /*
   * toJson: convert the JSON format string to JSON object
   * 
   * @parameter
   *   str: [String] a string that needs to be converted
   *
   * @return
   *   [Object] JSON object
   *
   * by destiny on 2018-08-05
   */
  function toJson(str) {
    var obj = {};
    try{
      obj = JSON.parse(str);
    }catch (e) {
      obj = eval(str);
    }
    return obj;
  }

  /*
   * toArray: Turns an array-like object into a true array
   * 
   * @parameter
   *   list: [Object] an array-like object
   *
   * @return
   *   [Array] a true array
   *
   * by destiny on 2018-08-05
   */
  function toArray(list) {
    var ary = [];
    try {
      ary = [].slice.call(list)
    }catch (e) {
      for(let i = 0; i < list.length; i++){
        ary.push(list[i])
      }
    }
    return ary;
  }

  /* 这三个为辅助方法 */
  function getCss(ele, attr) {
    var res = null;
    try {
      res = window.getComputedStyle(ele)[attr];
    } catch (e) {
      res = ele.currentStyle[attr];
    }
    isNaN(parseFloat(res)) ? null : res = parseFloat(res);
    return res;
  }
  function setCss(ele, attr, value) {
    ele.style[attr] = value;
  }
  function setGroup(ele, obj) {
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
      return;
    }
    for(var k in obj) {
      if (obj.hasOwnProperty(k)) {
        setCss(ele, k, obj[k]);
      }
    }
  }
  
  /*
   * css: Get and set the CSS Style
   *
   * @parameter
   *   ele: [Object] HTML Element Object
   *   attr: [String]|[Object] Attribute or the options object
   *   value: [String] Attribute value
   *
   * @return
   *   [Number] | [String] | nothing: Attribute value
   *
   * by destiny on 2018-08-09
   */
  function css() {
    var arg = arguments;
    if (arg.length ==2) {
      if (typeof arg[1] === 'string') {
        return getCss(arg[0], arg[1]);
      }
      setGroup(arg[0], arg[1])
    } else {
      setCss(arg[0], arg[1], arg[2])
    }
  }

  function offset(ele) {
    var left = ele.offsetLeft;
    var top = ele.offsetTop;
    var temp = ele.offsetParent;
    while (temp && temp.nodeName.toLowerCase() != 'body'){
      left += temp.offsetLeft + temp.clientLeft;
      top += temp.offsetTop + temp.clientTop;
      temp = temp.offsetParent;
    }
    return {
      left,top
    }
  }

  function scrollT() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }
  function clientH() {
    return document.documentElement.clientHeight || document.body.clientHeight;
  }

  return {
    toJson,
    toArray,
    css,
    offset,
    scrollT,
    clientH
  }
})();