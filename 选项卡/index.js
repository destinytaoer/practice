(function () {
  function D_tab(opts) {
    let _DEFAULT = {
      eventType: 'click',
      index: 0
    }

    for (let k in opts) {
      _DEFAULT[k] = opts[k];
    }

    let $lis = this.find('.til li');

    $lis.eq(_DEFAULT.index).addClass('current')
      .siblings().removeClass('current')
      .parent().siblings('.content-box').children('.content').eq(_DEFAULT.index).addClass('current')
        .siblings().removeClass('current');
    
    $lis.on(_DEFAULT.eventType, function () {
      let index = $(this).index();
      $(this).addClass('current')
      .siblings().removeClass('current')
      .parent().siblings('.content-box').children('.content').eq(index).addClass('current')
        .siblings().removeClass('current');
    })
  }
  $.fn.extend({
    tab: D_tab
  });
})()

$('.tab-box').tab({
  eventType: 'mouseover',
  index: 1
});