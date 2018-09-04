//=> 基于高级单例模式开发业务逻辑
let waterFallRender = (function () {

  //=> GET-DATA：基于 AJAX 获取数据
  let getData = function (url) {
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
  let bindHTML = function (data) {
    data.forEach(function (item, index) {
      let str = ``;
      let {
        pic,
        height,
        title
      } = item;
      let li = document.createElement('li');
      str = `<img src="img/default.gif" height="${height}" realSrc="${pic}" alt="">
          <p>${title}</p>`;
      li.innerHTML = str;
      getMinUl().appendChild(li);
    })
  };

  //=> GET-MIN-UL：获取页面中高度最小的 UL
  let getMinUl = function () {
    let oUl = document.getElementsByTagName('ul');
    let aUl = [...oUl];
    aUl.sort(function (a, b) {
      return a.clientHeight - b.clientHeight;
    });
    return aUl[0];
  };

  //=> LOAD-IMG：单个图片的懒加载（图片呈现前，使用了图片预加载）
  let loadImg = function (ele) {
    if (ele.loaded) return;
    let sT = utils.scrollT(),
      cH = utils.clientH(),
      tarT = utils.offset(ele).top;
    if (sT + cH > tarT) {
      let realSrc = ele.getAttribute('realsrc');
      let temp = document.createElement('img');
      temp.src = realSrc;
      temp.onload = function () {
        ele.src = realSrc;
        ele.loaded = true;
        fadeIn(ele);
      }
      temp = null;
    }
  };

  //=> LOAD-IMG-ALL：所有图片的懒加载（调用前面的单个懒加载方法）
  let loadImgAll = function (eles) {
    [].forEach.call(eles, (item) => {
      loadImg(item);
    });
  };

  //=> FADE-IN：图片展示时的渐显动画
  let fadeIn = function (ele) {
    ele.style.opacity = 0;
    let opa = 0.1;
    let timer = window.setInterval(function () {
      opa += 0.1;
      ele.style.opacity = opa;
  
      if (ele.style.opacity >= 1) {
        clearInterval(timer);
      }
    }, 20)
  };
  
  //=> GET-MORE：获取更多的图片（调用了前面的获取数据和绑定数据方法）
  let getMore = function (url) {
    let temp = getMinUl();
    let sT = utils.scrollT(),
      cH = utils.clientH(),
      tarT = utils.offset(temp).top + temp.clientHeight;
    
    if (sT + cH > tarT) {
      console.log(2);
      let data = getData(url);
      bindHTML(data);
    }
  };

  return {
    //=> INIT：模块入口，规划所有业务逻辑
    init: function(){
      let data = null;
      data = getData('./data.json');
      bindHTML(data);
      let oImgs = document.getElementsByTagName('img');
      loadImgAll(oImgs);
      window.onscroll = function () {
        loadImgAll(oImgs);
        getMore('./data.json');
      }
    }
  }
})();

waterFallRender.init();