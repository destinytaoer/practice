var utils = (function () {
  function toJson(str) {
    var obj = {};
    try {
      obj = JSON.parse(str);
    } catch (e) {
      obj = eval(str);
    }
    return obj;
  }

  function toArray(list) {
    var ary = [];
    try {
      ary = [].slice.call(list)
    } catch (e) {
      for (let i = 0; i < list.length; i++) {
        ary.push(list[i])
      }
    }
    return ary;
  }

  /**
   * DOM 样式操作
   */
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
    var reg = /width|height|padding|margin|left|top|bottom|right|fontsize/i;
    if (reg.test(attr)) {
      value = parseFloat(value) + 'px';
    }
    ele.style[attr] = value;
  }

  function setGroup(ele, obj) {
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
      return;
    }
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        setCss(ele, k, obj[k]);
      }
    }
  }

  function css() {
    var arg = arguments;
    if (arg.length == 2) {
      if (typeof arg[1] === 'string') {
        return getCss(arg[0], arg[1]);
      }
      setGroup(arg[0], arg[1])
    } else {
      setCss(arg[0], arg[1], arg[2])
    }
  }

  /**
   * DOM 盒子
   */
  function offset(ele) {
    var left = ele.offsetLeft;
    var top = ele.offsetTop;
    var temp = ele.offsetParent;
    while (temp && temp.nodeName.toLowerCase() != 'body') {
      left += temp.offsetLeft + temp.clientLeft;
      top += temp.offsetTop + temp.clientTop;
      temp = temp.offsetParent;
    }
    return {
      left,
      top
    }
  }

  function scrollT() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }

  function clientH() {
    return document.documentElement.clientHeight || document.body.clientHeight;
  }

  /**
   * DOM 操作
   */
  function children(ele) {
    var childs = ele.children;
    var ary = [];
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].nodeType == 1) {
        ary.push(childs[i]);
      }
    }
    return ary;
  }

  function prev(curELe) {
    var pre = curEle.previousSibling;
    while (pre && pre.nodeType !== 1) {
      pre = pre.previousSibling;
    }
    return pre;
  }

  function next(curEle) {
    var nt = curEle.nextSibling;
    while (nt && nt.nodeType !== 1) {
      nt = nt.nextSibling;
    }
    return nt;
  }

  function prevAll(curELe) {
    var pre = curEle.previousSibling,
      result = [];
    while (pre) {
      if (pre.nodeType === 1) {
        result.push(pre);
      }
      pre = pre.previousSibling;
    }
    return result;
  }

  function nextAll(curEle) {
    var nt = curEle.nextSibling,
      result = [];
    while (nt) {
      if (nt.nodeType === 1) {
        result.push(nt);
      }
      nt = nt.nextSibling;
    }
    return result;
  }

  function sibings(curELe) {
    var parent = curELe.parentNode;
    var sons = children(parent);
    var result = [];
    sons.forEach(function (item) {
      if (item !== curELe) {
        result.push(item);
      }
    });
    return result;
  }

  function index(curEle) {
    var parent = curEle.parentNode;
    var sons = children(parent);
    var nodeName = curEle.nodeName;
    var ary = [];
    sons.forEach(function (item) {
      if (item.nodeName === nodeName) {
        ary.push(item);
      }
    });
    return ary.indexOf(curEle);
  }

  /*
   * DOM 类名操作
   */
  function getByClass(str, context) {
    context = context || document;
    str = str.replace(/^ +| +$/g, '');
    var classAry = str.split(/ +/g);
    var eles = context.getElementsByTagName("*");
    for (var k = 0; k < classAry.length; k++) {
      var reg = new RegExp("(^| +)" + classAry[k] + "( +|$)");
      var ary = [];
      for (var i = 0; i < eles.length; i++) {
        if (reg.test(eles[i].className)) {
          ary.push(eles[i])
        }
      }
      eles = ary;
    }
    return ary;
  }

  function hasClass(ele, str) {
    str = str.replace(/^ +| +$/g, '');
    var ary = str.split(/ +/g);
    for (var i = 0; i < ary.length; i++) {
      var reg = new RegExp("(^| +)" + ary[i] + "( +|$)");
      if (!reg.test(ele.className)) {
        return false
      }
    }
    return true;
  }

  function addClass(ele, str) {
    str = str.replace(/^ +| +$/g, '');
    if (hasClass(ele, str)) return;
    var ary = str.split(/ +/);
    for (var i = 0; i < ary.length; i++) {
      if (!hasClass(ele, ary[i])) {
        ele.className += (' ' + ary[i]);
      }
    }
  }

  function removeClass(ele, str) {
    str = str.replace(/^ +| +$/g, '');
    var ary = str.split(/ +/g);
    for (var i = 0; i < ary.length; i++) {
      var reg = new RegExp('(^| +)' + ary[i] + '( +|$)', 'g');
      ele.className = ele.className.replace(reg, ' ');
    }
  }

  return {
    toJson,
    toArray,
    css,
    offset,
    scrollT,
    clientH,
    children,
    prev,
    next,
    prevAll,
    nextAll,
    sibings,
    index,
    getByClass,
    hasClass,
    addClass,
    removeClass
  }
})();