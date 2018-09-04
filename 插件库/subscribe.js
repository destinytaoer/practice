//=> 订阅发布
class Subscribe {
  constructor() {
    //=> 创建一个容器，管理需要执行的方法
    this.pond = [];
  }

  //=> 向容器添加方法 fn，需要去重
  add(fn) {
    let n = this.pond.indexOf(fn);
    if (n === -1) {
      this.pond.push(fn);
    }
  }

  //=> 执行容器中所有的方法
  fire(...arg) {
    // this.pond.forEach((item) => {
    //   item && item(...arg)
    // });
    //=> 不使用上面的做法，用以防止数组的塌陷，避免在执行时取消订阅造成的问题。
    for (let i = 0; i < this.pond.length; i++) {
      let item = this.pond[i];
      if (item === null) {
        //=> 去除掉需要移出的项
        this.pond.splice(i, 1);
        i--;
        continue;
      }
      item(...arg);
    }
  }

  //=> 从容器中移除
  remove(fn) {
    let n = this.pond.indexOf(fn);
    if (n > -1) {
      //=> 让当前值赋值为 null，数组结构不变，防止了数组塌陷问题
      this.pond[n] = null;
    }
  }
}

let fn1 = function (x, y) {
  console.log(1, x, y);
  subscribe.remove(fn2);
}
let fn2 = function () {
  console.log(2);
}
let fn3 = function () {
  console.log(3);
  subscribe.remove(fn1);
}
let fn4 = function () {
  console.log(4);
}

let subscribe = new Subscribe();

subscribe.add(fn1);
subscribe.add(fn2);
subscribe.add(fn3);
subscribe.add(fn1);
subscribe.add(fn4);
subscribe.add(fn1);
console.log(subscribe);
setTimeout(() => {
  subscribe.fire(100, 200);
}, 1000);