//=> 依赖 jQuery，并非 jQuery 插件
~function ($) {
  //=> 如果不存在 jQuery，就报错
  if (typeof $ === 'undefined') {
    throw new ReferenceError('current plugin needs jQuery');
  }

  class Drag {
    constructor(ele, options={}) {
      if (typeof ele !== 'object' || ele.nodeType !== 1) {
        throw new ReferenceError('ele is a must pass parameter and must be a element object');
      }

      let {
        selector = ele
      } = options;

      /**
       * ele: 移动的对象
       * dragTarget: 拖拽事件目标
       */
      this.ele = ele;

      if (typeof selector === 'string') {
        //=> 传递一个选择器进来，则是想通过操作 ele 中的某个元素让 ele 实现移动
        this.dragTarget = $(ele).find(selector)[0];
      } else {
        this.dragTarget = selector;
      }

      //=> 三个订阅名单
      this.dragstart = $.Callbacks();
      this.draging = $.Callbacks();
      this.dragend = $.Callbacks();

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

      //=> 发布 dragstart
      this.dragstart.fire.call(this, this.ele, e)
    }
  
    move(e) {
      e.preventDefault();
      let { startX, startY, mouseX, mouseY } = this;
      let L = e.clientX - mouseX + startX,
        T = e.clientY - mouseY + startY;
      
      //=> 边界判断
      let minL = 0,
        minT = 0,
        maxL = document.documentElement.clientWidth - this.ele.offsetWidth,
        maxT = document.documentElement.clientHeight - this.ele.offsetHeight;
      
      L = L > maxL ? maxL : (L < minL ? minL : L);
      T = T > maxT ? maxT : (T < minT ? minT : T);
      
      $(this.ele).css({
        left: L,
        top: T
      });

      //=> 发布 draging
      this.draging.fire.call(this, this.ele, e);
    }
    
    up(e) {
      document.removeEventListener('mousemove', this.MOVE);
      document.removeEventListener('mouseup', this.UP);

      //=> 发布 dragend
      this.dragend.fire.call(this, this.ele, e);
    }
  }
  window.Drag = Drag;
}(jQuery);

//=> ele 为移动的元素
// let drag =  new Drag(ele, {
//   //=> 当前需要操作的可拖拽目标元素，默认为 ele，通过拖拽这个元素来使 ele 移动
//   selector: '.dialogTitle' 
// })
// //=> 通过向订阅名单添加函数，就可以在相应的事件中执行这些方法
// 函数中会传入两个实参：实例 和 事件对象
// drag.dragstart.add(fn1);
// drag.draging.add(fn2);
// drag.dragend.add(fn2);