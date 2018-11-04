//=> 接受一个回调函数
function Promise(fn) {
  //=> 初始状态
  let _this = this;
  this.status = 'pending';

  //=> 传给成功和失败函数参数的初始值
  this.value = undefined;
  this.err = undefined;

  //=> 存储成功和失败的回调，利用了订阅发布模式思想
  this.resCallbacks = [];
  this.rejCallbacks = [];

  function resolve(value) {
    //=> 只有在 pending 状态才会执行相关操作
    if (_this.status === 'pending') {
      _this.status = 'resolved';
      _this.value = value;
      _this.resCallbacks.forEach(item => {
        item && item(_this.value);
      });
    }
  }

  function reject(err) {
    //=> 只有在 pending 状态才会执行相关操作
    if (_this.status === 'pending') {
      _this.status = 'rejected';
      _this.err = err;
      _this.rejCallbacks.forEach(item => {
        item && item(_this.err);
      })
    }
  }

  //=> 创建实例时，立即执行 fn
  try {
    fn(resolve, reject);
  } catch (e) {
    // 如果执行报错，则直接执行失败回调
    reject(e);
  }
}

Promise.prototype.then = function then(success, fail) {
  switch (this.status) {
    case 'resolved':
      success && success(this.value);
      break;
    case 'rejected':
      fail && fail(this.err);
      break;
    case 'pending':
      // 处理异步操作
      this.resCallbacks.push(success);
      this.rejCallbacks.push(fail);
  }
}

let p = new Promise(function (res, rej) {
  setTimeout(() => {
    res(11);
  }, 1000);
  console.log(1234);
}).then((data) => {
  console.log(data);
  }, (err) => {
  console.log(err);
});