//=> 单例模式，只支持一个实例，页面只有一个轮播图的情况

//=> 应用四张图片来实现无缝滚动，通过操作图片位置来实现切换。每次把将要操作的盒子进行定位到左边或右边，然后让现有图片和将要展示图片一起向左或向右移动。
let banner = (function () {
  let oUl = utils.getByClass('img-box')[0];
  let wrapper = document.getElementById('wrapper');
  let boxW = utils.css(oUl, 'width');
  let list = oUl.getElementsByTagName('li');
  let next = document.getElementById('next'),
    prev = document.getElementById('prev'),
    btnBox = document.getElementById('buttons')
    buttons = btnBox.getElementsByTagName('span');
  let timer = null,
    index = 0,
    n = 0,
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
    let str = ``,
    tipStr = ``;
    data.forEach(function (item, index) {
      let {
        pic,
        title
      } = item;
      str += `<li>
          <img src="${pic}" alt="">
          <p>${title}</p>
         </li>`;
         if (index < data.length) {
          tipStr += `<span class="tip ${index == 0 ? 'on' : ''}"></span>`
        }
    });
    n = data.length;
    oUl.innerHTML = str;
    btnBox.innerHTML = tipStr;
  };

  //=> AUTO-PLAY：控制轮播图自动播放
  function autoPlay() {
    stop();
    timer = window.setInterval(function () {
      if (animated) return;
      animated = true;
      let now = index;
      index++;
      if (index == n) {
        index = 0;
      }
      showButton();
      list[index].style.left = boxW + 'px';
      animate(list[now], {
        "left": -boxW
      }, 500);
      animate(list[index], {
        "left": 0
      }, 500, function () {
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
    utils.addClass(buttons[index], 'on');
  }

  //左右箭头点击事件函数
  function eventBind() {
    next.onclick = function () {
      if (animated) return;
      stop();
      animated = true;
      let now = index;
      index++;
      if (index == n) {
        index = 0;
      }
      showButton();
      list[index].style.left = boxW + 'px';
      animate(list[now], {
        "left": -boxW
      }, 500);
      animate(list[index], {
        "left": 0
      }, 500, function () {
        animated = false;
      });
    }
    prev.onclick = function () {
      if (animated) return;
      stop();
      animated = true;
      let now = index;
      index--;
      if (index == -1) {
        index = n - 1;
      }
      showButton();
      list[index].style.left = -boxW + 'px';
      animate(list[now], {
        "left": boxW
      }, 500);
      animate(list[index], {
        "left": 0
      }, 500, function () {
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

  // 圆点切换
  function pointClick() {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].index = i;
      buttons[i].onclick = function () {
        if (animated) return;
        if (this.index == index) return;
        stop();
        animated = true;
        let now = index;
        index = this.index;
        showButton();
        let flag = index > now ? -1 : 1
        list[index].style.left = -boxW * flag + 'px';
        animate(list[now], {
          "left": boxW * flag
        }, 500);
        animate(list[index], {
          "left": 0
        }, 500, function () {
          animated = false;
        });
      }
    }
  }

  return {
    init: function () {
      let data = getData('./data.json');
      bindHTML(data);
      showButton();
      autoPlay();
      eventBind();
      pointClick();
    }
  }
})();

banner.init();