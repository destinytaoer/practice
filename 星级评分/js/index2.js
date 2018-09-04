//=> 使用单例模式进行封装
//=> 传参来提高可复用性
//=> 通过传入配置和设置默认配置来提高灵活性
let ratingRender = (function () {
  let defaults = {
    mode: 'LightEntire',
    num: 0,
    readOnly: false,
    select: null,
    chosen: null
  }

  let LightEntire = function (el, options) {
    this.$el = $(el);
    this.$item = this.$el.find('.rating-item');
    this.opts = options;
  }
  LightEntire.prototype.init = function () {
    this.lightOn(this.opts.num);
    this.opts.readOnly ? null : this.bindEvent();
  }
  LightEntire.prototype.lightOn = function (num) {
    num = parseInt(num);

    this.$item.each(function (index) {
      if (index < num) {
        $(this).css('background-position', '0 -67px');
      } else {
        $(this).css('background-position', '0 0');
      }
    })
  }
  LightEntire.prototype.bindEvent = function () {
    let _this = this,
      itemLen = this.$item.length;
    this.$el.on('mouseover', '.rating-item', function () {
      let num = $(this).index() + 1;
      _this.lightOn(num);
      (typeof _this.opts.select === 'function') && _this.opts.select.call(_this, num, itemLen);
      _this.$el.trigger('select', [num, itemLen]);
    }).on('click', '.rating-item', function () {
      _this.opts.num = $(this).index() + 1;
      (typeof _this.opts.chosen === 'function') && _this.opts.chosen.call(_this, _this.opts.num, itemLen);
      _this.$el.trigger('chosen', [_this.opts.num,itemLen])
    }).on('mouseout', function () {
      _this.lightOn(_this.opts.num);
    })
  }

  let LightHalf = function (el, options) {
    this.$el = $(el);
    this.$item = this.$el.find('.rating-item');
    this.opts = options;
    this.add = 1;
  }
  LightHalf.prototype.init = function () {
    this.lightOn(this.opts.num);
    this.opts.readOnly ? null : this.bindEvent();
  }
  LightHalf.prototype.lightOn = function (num) {
    let count = parseInt(num),
      isHalf = count !== num;

    this.$item.each(function (index) {
      if (index < count) {
        $(this).css('background-position', '0 -67px');
      } else {
        $(this).css('background-position', '0 0');
      }
    });

    if (isHalf) {
      this.$item.eq(count).css('background-position', '0 -134px');
    }
  }
  LightHalf.prototype.bindEvent = function () {
    let _this = this,
      itemLen = this.$item.length;
    this.$el.on('mousemove', '.rating-item', function (e) {
      let num = 0;
      if (e.pageX - $(this).offset().left < $(this).width() / 2) {
        _this.add = 0.5;
      } else {
        _this.add = 1;
      }
      num = $(this).index() + _this.add;
      console.log(num);
      _this.lightOn(num);
      (typeof _this.opts.select === 'function') && _this.opts.select.call(_this, num, itemLen);
      _this.$el.trigger('select', [num, itemLen]);
    }).on('click', '.rating-item', function () {
      _this.opts.num = $(this).index() + _this.add;
      (typeof _this.opts.chosen === 'function') && _this.opts.chosen.call(_this, _this.opts.num, itemLen);
      _this.$el.trigger('chosen', [_this.opts.num,itemLen])
    }).on('mouseout', function () {
      _this.lightOn(_this.opts.num);
    })
  }

  let mode = {
    'LightEntire': LightEntire,
    'LightHalf': LightHalf
  }

  let init = function (el, options) {
    options = $.extend({}, defaults, options);
    // new LightHalf(el, options).init();
    if (!mode[options.mode]) {
      options.mode = 'LigthEntire';
    }
    new mode[options.mode](el, options).init();
  }

  return {
    init
  }
})();

ratingRender.init('.rating', {
  num: 2.5
});