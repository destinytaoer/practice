let productRender = (function () {
  let headerBox = document.getElementById('headerBox'),
    productBox = document.getElementById('productBox'),
    linkList = headerBox.getElementsByTagName('a'),
    productList = null;
  
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
    let str = ``;
    data.forEach(function (item) {
      let {
        picImg,
        title,
        price,
        hot,
        time
      } = item;
      str += `<li data-time="${time}" data-hot="${hot}" data-price="${price}">
      <a href="#">
        <img src="${picImg}" alt="">
        <p title="${title}">${title}</p>
        <span>￥${price}</span>
        <span>${hot}</span>
        <span>${time}</span>
      </a>
    </li>`;
    });
    productBox.innerHTML = str;
    productList = productBox.getElementsByTagName('li');
  };

  //=> BIND-CLICK：给三个排序按钮绑定点击事件
  let bindClick = function () {
    [].forEach.call(linkList, (curLink, index)=> {
      curLink.flag = -1;
      curLink.onclick = function () {
        this.flag *= -1;
        let ary = ['data-time', 'data-price', 'data-hot'];
        //=> 给 productList 进行排序
        let productListAry = [...productList]
        productListAry.sort((a, b) => {
          let aInn = a.getAttribute(ary[index]),
            bInn = b.getAttribute(ary[index]);
          if (index === 0) {
            aInn = aInn.replace(/-/g, '');
            bInn = bInn.replace(/-/g, '');
          }
          return (aInn - bInn)*this.flag;
        });
        //=> 按照最新顺序依次添加到容器中
        let frg = document.createDocumentFragment();
        productListAry.forEach((item)=> {
          frg.appendChild(item);
        });
        productBox.appendChild(frg);
        frg = null;
      }
    })
  }

  return {
    init: function () {
      let data = null;
      data = getData('./data.json');
      bindHTML(data);
      bindClick();
    }
  }
})();

productRender.init();