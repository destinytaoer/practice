~function () {
  let oImg = document.getElementsByTagName('img')[0];
  
  oImg.loaded = false;
  function loadImg(ele) {
    if (ele.loaded) return;
    let sT = utils.scrollT(),
      cH = utils.clientH(),
      tarT = utils.offset(ele).top;
    if (sT + cH >= tarT) {
      let realSrc = ele.getAttribute('realSrc')
      let temp = new Image();
      temp.src = realSrc;
      temp.onload = function () {
        ele.src = realSrc;
        ele.loaded = true;
        fadeIn(ele);
      }
    }
  }
  window.onscroll = function () {
    loadImg(oImg);
  }
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
}();