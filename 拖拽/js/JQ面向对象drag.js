//=> 依赖 jQuery，并非 jQuery 插件
~function ($) {
  //=> 如果不存在 jQuery，就报错
  if (typeof $ === 'undefined') {
    throw new ReferenceError('current plugin needs jQuery');
  }

  let emptyFn = function emptyFn() {
    //=> 空函数，可以把它作为回调函数的默认值
    //=> 也可以使用 cb && cb();
  }

  class Drag {
    constructor(ele, options={}) {
      if (typeof ele !== 'object' || ele.nodeType !== 1) {
        throw new ReferenceError('ele is a must pass parameter and must be a element object');
      }

      let {
        selector = ele,
        dragstart,
        draging,
        dragend
      } = options;

      /**
       * ele: 移动的对象
       * dragTarget: 拖拽事件目标
       */
      this.ele = ele;

      if (typeof selector === 'string') {
        //=> 传递一个选择器进来，则是想通过操作 ele 中的某个元素让 ele 实现移动
        this.dragTarget = $(ele).find(selector)[0];
      }
      this.dragstart = dragstart;
      this.draging = draging;
      this.dragend = dragend;

      // drag start: 保证执行原型上的方法，方法中的 this 都是当前类的实例
      this.dragTarget.addEventListener('mousedown', this.down.bind(this));
    }
    down(e) {
      //=> 这里的 this 是 Drag 的实例
      this.startX = parseFloat($(this.ele).css('left'));
      this.startY = parseFloat($(this.ele).css('top'));
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
  
      // 这里记录这两个个函数是为了后面移除事件，因为 dragMove.bind(this) === dragMove //=> false
      // 绑定在 document 是为了防止移动过快，鼠标丢失
      this.MOVE = this.move.bind(this);
      this.UP = this.up.bind(this);
      document.addEventListener('mousemove', this.MOVE);
      document.addEventListener('mouseup', this.UP);

      this.dragstart && this.dragstart();
    }
  
    move(e) {
      let { startX, startY, mouseX, mouseY } = this;
      let L = e.clientX - mouseX + startX,
        T = e.clientY - mouseY + startY;
      
      //=> 边界判断，可以在回调函数中执行
      // let minL = 0,
      //   minT = 0,
      //   maxL = winW - boxW,
      //   maxT = winH - boxH;
      
      // L = L > maxL ? maxL : (L < minL ? minL : L);
      // T = T > maxT ? maxT : (T < minT ? minT : T);
      
      $(this.ele).css({
        left: L,
        top: T
      });
      this.draging && this.draging();
    }
    up() {
      document.removeEventListener('mousemove', this.MOVE);
      document.removeEventListener('mouseup', this.UP);
      this.dragend && this.dragend();
    }
  }
  window.Drag = Drag;
}(jQuery);

//=> ele 为移动的元素
// new Drag(ele, {
//   //=> 当前需要操作的可拖拽目标元素，默认为 ele，通过拖拽这个元素来使 ele 移动
//   selector: '.dialogTitle',
//   //=> 通过回调函数来使得用户可以在特定的阶段执行自己的事情，里面的 this 是实例
//   dragstart: function() {},
//   draging: function() {},
//   dragend: function() {} 
// })
