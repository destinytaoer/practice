/**
 * 轮播图插件
 * fnName: description
 *
 * @parameter
 *   id: [String] 元素id
 *   url: [String] 请求数据的地址url
 *
 * @return
 *   [Onject]: 实例
 *
 * by destiny on 2018-08-16
 */
;(function () {
  function Banner(id, url) {
    this.url = url;
    //=> 需要操作的元素
    this.wrapper = document.getElementById(id);
    this.oUl = this.wrapper.getElementsByClassName('img-box')[0];
    this.list = this.oUl.getElementsByTagName('li');
    this.next = document.getElementById('next');
    this.prev = document.getElementById('prev');
    this.btnBox = document.getElementById('buttons')
    this.buttons = this.btnBox.getElementsByTagName('span');
  
    //=> 需要用到的数据或标记
    this.data = null;
    this.boxW = utils.css(this.oUl, 'width');
    this.timer = null;
    this.index = 0;
    this.n = 0;
    this.animated = false;
  }
  
  Banner.prototype = {
    constructor: Banner,
    getData: function () {
      let xhr = new XMLHttpRequest();
      xhr.open('get', this.url, false);
  
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && /2\d{2}/.test(xhr.status)) {
          this.data = JSON.parse(xhr.responseText);
        }
      }
      xhr.send();
    },
    bindHTML: function () {
      let str = ``,
        tipStr = ``;
      this.data.forEach((item,index) => {
        let {
          pic,
          title
        } = item;
        str += `<li>
            <img src="${pic}" alt="">
            <p>${title}</p>
           </li>`;
        
        if (index < this.data.length) {
          tipStr += `<span class="tip ${index == 0 ? 'on' : ''}"></span>`
        }
      });
      this.n = this.data.length;
      this.oUl.innerHTML = str;
      this.btnBox.innerHTML = tipStr;
    },
    autoPlay: function () {
      this.stop();
      this.timer = window.setInterval(() => {
        if (this.animated) return;
        this.animated = true;
        let now = this.index;
        this.index++;
        if (this.index == this.n) {
          this.index = 0;
        }
        this.showButton();
        this.list[this.index].style.left = this.boxW + 'px';
        animate(this.list[now], {
          "left": -this.boxW
        }, 500);
        animate(this.list[this.index], {
          "left": 0
        }, 500, () => {
          this.animated = false;
          this.autoPlay();
        });
      }, 1000);
    },
    stop: function () {
      window.clearInterval(this.timer);
    },
    showButton: function () {
      for (let i = 0; i < this.buttons.length; i++) {
        utils.removeClass(this.buttons[i], 'on')
      }
      utils.addClass(this.buttons[this.index], 'on');
    },
    eventBind: function () {
      this.next.onclick = () => {
        if (this.animated) return;
        this.stop();
        this.animated = true;
        let now = this.index;
        this.index++;
        if (this.index == this.n) {
          this.index = 0;
        }
        this.showButton();
        this.list[this.index].style.left = this.boxW + 'px';
        animate(this.list[now], {
          "left": -this.boxW
        }, 500);
        animate(this.list[this.index], {
          "left": 0
        }, 500, () => {
          this.animated = false;
        });
      }
      this.prev.onclick = () => {
        if (this.animated) return;
        this.stop();
        this.animated = true;
        let now = this.index;
        this.index--;
        if (this.index == -1) {
          this.index = this.n - 1;
        }
        this.showButton();
        this.list[this.index].style.left = -this.boxW + 'px';
        animate(this.list[now], {
          "left": this.boxW
        }, 500);
        animate(this.list[this.index], {
          "left": 0
        }, 500, () => {
          this.animated = false;
        });
      }
      this.wrapper.onmouseenter = () => {
        this.stop();
      }
      this.wrapper.onmouseleave = () => {
        this.autoPlay();
      }
    },
    pointClick: function () {
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].onclick = () => {
          if (this.animated) return;
          if (i == this.index) return;
          this.stop();
          this.animated = true;
          let now = this.index;
          this.index = i;
          this.showButton();
          let flag = this.index > now ? -1 : 1
          this.list[this.index].style.left = -this.boxW * flag + 'px';
          animate(this.list[now], {
            "left": this.boxW * flag
          }, 500);
          animate(this.list[this.index], {
            "left": 0
          }, 500, () => {
            this.animated = false;
          });
        }
      }
    },
    init: function () {
      this.getData();
      this.bindHTML();
      this.autoPlay();
      this.eventBind();
      this.pointClick();
    }
  }
  window.Banner = Banner;
})(window)

/* 使用
 * var banner = new Banner('wrapper', './data.json');
 * banner.init();
 */