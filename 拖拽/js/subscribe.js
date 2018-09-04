class Subscribe {
  constructor() {
    //=> []创建一个容器，管理需要执行的方法
    //=> {} 实现多个不同类型容器
    this.pond = [];
  }

  //=> 向容器添加方法 fn，需要去重
  add(fn) {
    this.pond = this.pond || [];
    let n = this.pond.indexOf(fn);
    if (n === -1) {
      this.pond.push(fn);
    }
  }

  //=> 执行容器中所有的方法
  fire(...arg) {
    if (!this.pond) return;
    for (let i = 0; i < this.pond.length; i++) {
      let item = this.pond[i];
      if (item === null) {
        this.pond.splice(i, 1);
        i--;
        continue;
      }
      item(...arg);
    }
  }

  //=> 从容器中移除
  remove(fn) {
    if (this.pond) return;
    let n = this.pond.indexOf(fn);
    if (n > -1) {
      //=> 让当前值赋值为 null，数组结构不变，防止了数组塌陷问题
      this.pond[n] = null;
    }
  }
}