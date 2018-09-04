//=> 简单的动画插件
(function () {
  var moveType = {
    //=> t: time, c: changeL, d: duration, b: beginL
    linear: function linear(t, c, d, b) {
      return c / d * t + b;
    },
    easeIn: function (t, c, d, b) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOut: function (t, c, d, b) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOut: function (t, c, d, b) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      }
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
  };

  function move(ele, duration, obj, moveT, callback) {
    var beginL = {};
    var changeL = {};
    moveT = moveT || 'linear';
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        beginL[k] = utils.css(ele, k);
        changeL[k] = obj[k] - beginL[k];
      }
    }
    var times = 0;
    var timer = setInterval(function () {
      times += 20;
      if (times >= duration) {
        clearInterval(timer);
        times = duration;
        callback && callback();
      }
      for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
          var curPos = moveType[moveT](times, changeL[k], duration, beginL[k]);
          utils.setCss(ele, k, curPos);
        }
      }
    }, 20);

  }

  window.myAnimate = move;
})();