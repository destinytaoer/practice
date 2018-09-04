/*
 * DOM 操作库
 */
let dom = (function () {

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
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        setCss(ele, k, obj[k]);
      }
    }
  }

  /**
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
   * children: get all the element subnodes of the current element
   * 
   * @parameter
   *   curEle: [object] current element
   * 
   * @return
   *   [Array] all the element nodes
   * 
   * by destiny on 2018/07/11
   */
  function children(curEle) {
    var nodeList = curEle.childNodes,
      result = [];

    for (var i = 0; i < nodeList.length; i++) {
      var item = nodeList[i];
      if (item.nodeType === 1) {
        result.push(item);
      }
    }
    return result;
  }

  /**
   * prev: get the last elder brother element node of the current element
   * 
   * @parameter
   *   curEle: [object] current element
   * 
   * @return
   *   [object] the element node
   * 
   * by destiny 2018/7/11
   */
  function prev(curELe) {
    var pre = curEle.previousSibling;
    while (pre && pre.nodeType !== 1) {
      pre = pre.previousSibling;
    }
    return pre;
  }

  /**
   * next: get next brother element node of the current element
   * 
   * @parameter
   *   curELe: [object]
   * 
   * @return
   *   [object] the element node
   * 
   * by destiny 2018/07/11
   */
  function next(curEle) {
    var nt = curEle.nextSibling;
    while (nt && nt.nodeType !== 1) {
      nt = nt.nextSibling;
    }
    return nt;
  }

  /**
   * pre: get all the elder brother element nodes of the current element
   * 
   * @parameter
   *   curEle: [object] current element
   * 
   * @return
   *   [Array] all the element nodes
   * 
   *  by destiny 2018/7/11
   */
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

  /**
   * next: get all the next brother element nodes of the current element
   * 
   * @parameter
   *   curELe: [object]
   * 
   * @return
   *   [Array] all the element nodes
   * 
   * by destiny 2018/07/11
   */
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

  /*
   * sibings: get all the brother element nodes of the current element
   * 
   * @parameter
   *   curELe: [object]
   * 
   * @return
   *   [Array] all the brother element nodes
   * 
   * by destiny 2018/07/11
   */
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

  /**
   * index: get the index of curEle
   *
   * @parameter
   *   curEle: [Object] HTML element
   *
   * @return
   *   [Number]: the index
   *
   * by destiny on 2018/07/11
   */
  function index(curEle) {
    var ary = prevAll(curEle);
    return ary.length;
  }

  /**
   * getByClass: get HTML element by class name
   *
   * @parameter
   *   str: [String] class name
   *   context: [Object] context
   *
   * @return
   *   [Object]: Array like Object contains HTML elements
   *
   * by destiny on 2018-08-14
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
    return ary

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
      var reg = new RegExp('(^| +)' + ary[i] + '( +|$)');
      ele.className = ele.className.replace(reg, ' ');
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
  function win(str) {
    return document.documentElement[str] || document.body[str];
  }

  return {
    getCss,
    setCss,
    setGroup,
    css,
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
    removeClass,
    offset,
    scrollT,
    clientH,
    win
  }
})();