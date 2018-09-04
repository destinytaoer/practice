if (typeof Subscribe === 'undefined') {
  throw new ReferenceError('no subscribe.js')
}
class Drag extends Subscribe {
  constructor(ele) {
    //=> this: Drag 的实例
    // [私有属性]
    // this.pond
    // [公有方法]
    // this.add() this.remove() this.fire
    super();

    //=> 三个订阅名单
    this.ponds['down'] = [];
    this.ponds['move'] = [];
    this.ponds['up'] = [];

    //=> init parameters
    //=> 把使用时需要的私有属性预先定义，可以使用的属性一目了然
    this.ele = ele;
    ['strX', 'strY', 'strL', 'strT', 'curL', 'curT'].forEach((item) => {
      this[item] = null;
    });

    //=> drag-start
    //=> 绑定事件最好使用 DOM 2级，防止被别人绑定事件所覆盖
    //=> 后面可能需要移除，所以预先保存
    this.DOWN = this.down.bind(this);
    this.ele.addEventListener('mousedown', this.DOWN);
  }

  down(e) {
    //=> this都指向实例
    e = e || window.event;
    e.preventDefault();

    let ele = this.ele;
    this.strX = e.clientX;
    this.strY = e.clientY;
    this.strL = parseFloat(window.getComputedStyle(ele).left);
    this.strT = parseFloat(window.getComputedStyle(ele).top);


    this.MOVE = this.move.bind(this);
    this.UP = this.up.bind(this);
    document.addEventListener('mousemove', this.MOVE);
    document.addEventListener('mouseup', this.UP);

    this.fire.call(this, 'down', this.ele, e);
  }

  move(e) {
    e = e || window.event;

    let ele = this.ele;
    this.curL = e.clientX - this.strX + this.strL;
    this.curT = e.clientY - this.strY + this.strT;

    //=> 边界判断
    let minL = 0,
      minT = 0,
      maxL = document.documentElement.clientWidth - this.ele.offsetWidth,
      maxT = document.documentElement.clientHeight - this.ele.offsetHeight;

    this.curL = this.curL > maxL ? maxL : (this.curL < minL ? minL : this.curL);
    this.curT = this.curT > maxT ? maxT : (this.curT < minT ? minT : this.curT);

    ele.style.left = this.curL + 'px';
    ele.style.top = this.curT + 'px';

    this.fire.call(this, 'move', this.ele, e);
  }

  up(e) {
    //移除绑定的事件
    document.removeEventListener('mousemove', this.MOVE);
    document.removeEventListener('mouseup', this.UP);

    this.fire.call(this, 'up', this.ele, e);
  }
}