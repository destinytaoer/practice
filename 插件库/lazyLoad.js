/**
 * 图片懒加载插件
 */
~ function () {
  function fadeIn(ele) {
    ele.style.opacity = 0;
    let opa = 0.1;
    let timer = window.setInterval(function () {
      opa += 0.1;
      ele.style.opacity = opa;

      if (ele.style.opacity >= 1) {
        clearInterval(timer);
      }
    }, 20)
  }
  //=> LOAD-IMG：单个图片的懒加载（图片呈现前，使用了图片预加载）
  function loadImg(ele) {
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
  function loadImgAll(eles) {
    [].forEach.call(eles, (item) => {
      loadImg(item);
    });
  };
  let oImgs = document.getElementsByTagName('img');
  loadImgAll(oImgs);
  
  window.addEventListener('scroll', function () {
    loadImgAll(oImgs);
  });
}();