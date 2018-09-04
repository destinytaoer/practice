//=> 图片预加载插件
(function($) {
  function PreLoad(imgs, options) {
    this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
    this.opts = $.extend({}, PreLoad.DEFAULTS, options);
    this._unordered();
  }
  PreLoad.DEFAULTS = {
    each: null,
    all: null
  };
  //=> 无序加载
  PreLoad.prototype._unordered = function () {
    var imgs = this.imgs,
      opts = this.opts;
    var step = 0,
      total = imgs.length;

    $.each(imgs, function (i, src) {
      if (typeof src != 'string') return;
      var oImg = new Image();
      oImg.src = src;
      $(oImg).on('load', function() {
        step++;
        opts.each && opts.each(step);
        oImg = null;
        if (step === total) {
          opts.all && opts.all();
        }
      })
    });
  };

  //=> $.fn.extend => 定义原型的方法，使用时应该使用实例来调用
  //=> $.extend => 直接绑定在 $ 对象上。
  $.extend($, {
    preload: function(imgs, opts) {
      new PreLoad(imgs, opts);
    }
  })
})(jQuery)