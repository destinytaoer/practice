//=> 数据获取和绑定模块
~function () {
  function getData() {
    let data = null;
    let xhr = new XMLHttpRequest();

    xhr.open('get', './data.json', false);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        data = JSON.parse(xhr.responseText);
      }
    };
    xhr.send();
    return data;
  }

  let data = getData();

  let watchBox = document.getElementById('watch-box');

  function bindHTML(data) {
    var str = ``;
    for (let i = 0; i < data.length; i++) {
      let {
        picImg,
        title,
        price,
        hot,
        time
      } = data[i];
      str += `<li
                data-price="${price}"
                data-hot="${hot}"
                data-time="${time}">
            <div class="img">
              <img src="${picImg}" alt="">
            </div>
            <div class="title">${title}</div>
            <div class="price">
              价格：<span>￥${price}</span>
            </div>
            <div class="commment">
              评价数：<span>${hot}</span>
            </div>
            <div class="time">
              上架时间：<span>${time}</span>
            </div>
          </li>`
    }
    watchBox.innerHTML = str;
  }

  bindHTML(data);
}();

//=> 操作 DOM 排序模块
~function () {
  let btnBox = document.getElementById('btn-box'),
    btnList = btnBox.getElementsByTagName('li'),
    oUl = document.getElementById('watch-box'),
    oLis = oUl.getElementsByTagName("li");
  let aLis = [...oLis],
    btnAry = [...btnList];


  btnAry.forEach(function (item, index) {
    item.flag = -1;
    item.index = index;
    item.onclick = function () {
      for (let i = 0; i < btnAry.length; i++) {
       let item = btnAry[i];
        if (item !== this) {
          item.flag = -1;
       }
      }
      this.flag *= -1;
      sortFn.call(this);
    };
  })

  function sortFn() {
    let ary = ['data-price', 'data-hot', 'data-time'];
    let {
      flag,
      index
    } = this;
    aLis.sort(function (a, b) {
      let aIn = a.getAttribute(ary[index]).toString().replace(/-/g, ''),
        bIn = b.getAttribute(ary[index]).toString().replace(/-/g, '')
      return (aIn - bIn) * flag;
    });
    aLis.forEach(function (item) {
      oUl.appendChild(item);
    })
  }
}();