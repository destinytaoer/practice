//=> 单例模式，只支持一个实例，页面只有一个轮播图的情况

//=> 应用五张图片来实现无缝滚动，通过操作外层盒子才实现切换
let banner = (function () {
  let oUl = utils.getByClass('img-box')[0];
  let wrapper = document.getElementById('wrapper');
  let boxW = utils.css(oUl, 'width');
  let next = document.getElementById('next'),
    prev = document.getElementById('prev'),
    buttons = document.getElementById('buttons').getElementsByTagName('span');
  let timer = null,
    index = 0,
    n = 4,
    animated = false;

  //=> GET-DATA：基于 AJAX 获取数据
  function getData(url) {
    let data = null,
      xhr = new XMLHttpRequest();
    xhr.open('get', url, false);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && /2\d{2}/.test(xhr.status)) {
        data = JSON.parse(xhr.responseText);
      }
    }
    xhr.send();
    return data;
  };

  //=> BIND-HTML：基于 ES6 完成页面和数据的绑定
  function bindHTML(data) {
    let str = ``;
    data.forEach(function (item) {
      let {
        pic,
        title
      } = item;
      str += `<li>
          <img src="${pic}" alt="">
          <p>${title}</p>
         </li>`;
    });
    oUl.innerHTML = str;
    oUl.style.position = 'relative';
    oUl.style.width = utils.css(oUl, 'width') * data.length + 'px';
  };

  //=> PLAY：控制轮播图自动播放
  function autoPlay() {
    stop();
    timer = window.setInterval(function () {
      if (animated) return;
      animated = true;
      index++;
      showButton();
      animate(oUl, {
        'left': -boxW * index
      }, 1000, function () {
        if (index == n) {
          index = 0;
          back();
        }
        animated = false;
        autoPlay();
      });
    }, 1000);
  }

  //=> STOP：控制轮播图停止播放
  function stop() {
    clearInterval(timer);
  }

  //=> SHOW-BUTTON：显示按钮
  function showButton() {
    for (var i = 0; i < buttons.length; i++) {
      utils.removeClass(buttons[i], 'on')
    }
    if (index == n) {
      utils.addClass(buttons[0], 'on');
    } else if (index == -1) {
      utils.addClass(buttons[4], 'on');
    } else {
      utils.addClass(buttons[index], 'on');
    }
  }

  // EVENT-BIND：事件函数
  function eventBind() {
    next.onclick = function () {
      if (animated) return;
      stop();
      animated = true;
      index++;
      showButton();
      animate(oUl, {
        'left': -boxW * index
      }, 1000, function () {
        if (index == n) {
          index = 0;
          utils.css(oUl, 'left', -boxW * index);
        }
        animated = false;
      });
    }
    prev.onclick = function () {
      if (animated) return;
      stop();
      if (index == 0) {
        index = n;
        utils.css(oUl, 'left', -boxW * index);
      }
      animated = true;
      index--;
      showButton();
      animate(oUl, {
        'left': -boxW * index
      }, 1000, function () {
        if (index == 0) {
          index = n;
          utils.css(oUl, 'left', -boxW * index);
        }
        animated = false;
      });
    }
    wrapper.onmouseenter = function () {
      stop();
    }
    wrapper.onmouseleave = function () {
      autoPlay();
    }
  }

  //=> POINT-CLICK：圆点切换
  function pointClick() {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].index = i;
      buttons[i].onclick = function () {
        if (animated) return;
        if (this.index == index) return;
        animated = true;
        stop();
        index = this.index;
        showButton();
        animate(oUl, {
          'left': -boxW * index
        }, 1000, function () {
          animated = false;
          play();
        });
      }
    }
  }

  return {
    init: function () {
      let data = getData('./data.json');
      bindHTML(data);
      autoPlay();
      eventBind();
      pointClick();
    }
  }
})();

banner.init();