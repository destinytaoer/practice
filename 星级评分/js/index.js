//=> 使用单例模式进行封装
//=> 传参来提高可复用性
let ratingRender = (function () {
  let lightOn = function (el, num) {
    [].forEach.call(el, function (item, index) {
      if (index < num) {
        item.style.backgroundPosition = '0 -67px';
      } else {
        item.style.backgroundPosition = '0 0';
      }
    })
  }

  let bindEvent = function (el, num) {
    [].forEach.call(el, function (item, index) {
      item.onmousemove = function () {
        lightOn(el, (index + 1));
      }
      item.onclick = function () {
        num = index + 1;
      }
    });
    rating.onmouseout = function () {
      lightOn(el, num);
    }
  }

  return {
    init: function (rating, num) {
      let ratingItem = rating.getElementsByTagName('li');

      lightOn(ratingItem, num);
      bindEvent(ratingItem,num);
    }
  }
})();

let rating = document.getElementById('rating')
ratingRender.init(rating, 2);