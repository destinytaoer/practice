class Subscribe {
  constructor() {
    //=> []创建一个容器，管理需要执行的方法
    //=> {} 实现多个不同类型容器
    this.ponds = {};
  }

  //=> 向容器添加方法 fn，需要去重
  add(type, fn) {
    this.ponds[type] = this.ponds[type] || [];
    let n = this.ponds[type].indexOf(fn);
    if (n === -1) {
      this.ponds[type].push(fn);
    }
  }

  //=> 执行容器中所有的方法
  fire(type, ...arg) {
    if (!this.ponds[type]) return;
    for (let i = 0; i < this.ponds[type].length; i++) {
      let item = this.ponds[type][i];
      if (item === null) {
        this.ponds[type].splice(i, 1);
        i--;
        continue;
      }
      item(...arg);
    }
  }

  //=> 从容器中移除
  remove(type, fn) {
    if (this.ponds[type]) return;
    let n = this.ponds[type].indexOf(fn);
    if (n > -1) {
      //=> 让当前值赋值为 null，数组结构不变，防止了数组塌陷问题
      this.ponds[type][n] = null;
    }
  }
}