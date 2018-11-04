
/* 图片预加载插件
 * $.preload: Picture preloading
 *
 * @parameter
 *   imgs: [Array] the paths to the images
 *   opts: [Object]
 *     order: [Boolean] order or not 
 *     each: [Function] A function that is executed after each image is loaded
 *     all: [Function] A function that is executed after all images are loaded
 *
 * @return
 *   nothing
 *
 * by destiny on 2018-08-09
 */
;(function() {
  function PreLoad(imgs, options) {
    this.imgs = imgs;
    this.opts = $.extend({}, PreLoad.DEFAULTS, options);
    if (this.opts.order) {
      this._ordered();
    } else {
      this._unordered();
    }
  }
  PreLoad.DEFAULTS = {
    order: false,
    each: null,
    all: null
  }

  //=> 有序加载
  PreLoad.prototype._ordered = function () {
    var opts = this.opts,
      imgs = this.imgs,
      total = imgs.length,
      count = 0;
    function loadImg() {
      var oImg = new Image();

      $(oImg).on('load error', function () {
        opts.each && opts.each(count);
        count++;
        if (count >= total) {
          opts.all && opts.all();
        } else {
          loadImg();
        }
      })
    }
    loadImg();
  }

  //=> 无序加载
  PreLoad.prototype._unordered = function () {
    var imgs = this.imgs,
       opts = this.opts,
       step = 0,
       total = imgs.length;

    $.each(imgs,function(i, src) {
      if(typeof src !== 'string') return;

      var oImg = new Image();
      oImg.src = src;
      $(oImg).on('load error',function() {
        step++;
        opts.each && opts.each(step);
        oImg = null;
        if(step === total) {
          opts.all && opts.all();
        }
      });
    })
  };

  $.extend($,{
    preload: function(imgs, opts) {
      new PreLoad(imgs, opts);
    }
  })
})();