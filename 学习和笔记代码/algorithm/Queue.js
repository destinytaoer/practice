function Queue() {
  this.dataStore = [];
}

// 向队尾添加一个元素，参数为要添加的元素
Queue.prototype.enqueue = function (element) {
  this.dataStore.push(element);
}

// // 删除并返回队首的元素
// Queue.prototype.dequeue = function () {
//   return this.dataStore.shift();
// }

// 返回队首的元素
Queue.prototype.front = function () {
  return this.dataStore[0];
}

// 返回队尾的元素
Queue.prototype.back = function () {
  return this.dataStore[this.dataStore.length - 1];
}

// // 返回队列的字符串形式
// Queue.prototype.toString = function () {
//   var retStr = '';
//   for (var i = 0; i < this.dataStore.length; i++) {
//     retStr += this.dataStore[i] + '\n';
//   }
//   return retStr;
// }

// 返回队列的长度
Queue.prototype.length = function () {
  return this.dataStore.length;
}

// 判断队列是否为空
Queue.prototype.empty = function () {
  if (this.dataStore.length == 0) {
    return true;
  } else {
    return false;
  }
}

// 清空队列
Queue.prototype.clear = function () {
  this.dataStore = [];
}

// /*************
//  *  舞者分配  *
//  *************/
//
// // 使用 Dancer 对象存储每个舞者的信息
// function Dancer(name, sex) {
//   this.name = name;
//   this.sex = sex;
// }
//
// // 读取舞者信息，并分配不同队列
// function getDancers(dancers, males, females) {
//   for (var i = 0; i < dancers.length; i++) {
//     var sex = dancers[i][0];
//     var name = dancers[i][1];
//     if (sex == 'F') {
//       females.enqueue(new Dancer(name, sex));
//     } else {
//       males.enqueue(new Dancer(name, sex));
//     }
//   }
// }
//
// // 组成舞伴开始跳舞
// function dance(males, females) {
//   if (!males.empty() && !females.empty()) {
//     console.log('下一对是：');
//     console.log(females.dequeue().name + '女士和' + males.dequeue().name + '男士');
//   } else if (males.empty() && !females.empty()) {
//     console.log(females.front().name + '女士在等待舞伴');
//   } else if (!males.empty() && females.empty()) {
//     console.log(males.front().name + '男士在等待舞伴');
//   } else {
//     console.log('舞会结束');
//   }
// }
//
// var maleDancers = new Queue();
// var femalesDancers = new Queue();
// var dancers = [['F', 'amy'], ['M', 'selldon'], ['F', 'penny'], ['M', 'lenerd'], ['F', 'emily']];
// getDancers(dancers, maleDancers, femalesDancers);
//
// dance(maleDancers, femalesDancers)
//
// /*************
//  *  基数排序  *
//  *************/
//
// // 将数字分配到相应的队列，digit为1时，按个位分配，digit为10时，按十位分配
// function distribute(nums, queues, digit) {
//   for (var i = 0; i < nums.length; i++) {
//     if (digit == 1) {
//       queues[nums[i] % 10].enqueue(nums[i]);
//     } else {
//       queues[Math.floor(nums[i] / 10)].enqueue(nums[i]);
//     }
//   }
// }
//
// // 按照队列的顺序把排序好的数字重新放入数组中
// function collect(queues, nums) {
//   var i = 0;
//   for (var digit = 0; digit < 10; digit++) {
//     while (!queues[digit].empty()) {
//       nums[i++] = queues[digit].dequeue();
//     }
//   }
// }
//
// // 显示数组
// function dispArray(arr) {
//   console.log(arr);
// }
//
// var queues = [];
// for (var i = 0; i < 10; i++) {
//   queues[i] = new Queue();
// }
// var nums = [];
// for (var i = 0; i < 10; i++) {
//   nums[i] = Math.floor(Math.random() * 100);
// }
// dispArray(nums);
// distribute(nums, queues, 1);
// collect(queues, nums);
// dispArray(nums);
// distribute(nums, queues, 10);
// collect(queues, nums);
// dispArray(nums);

/*************
 *  优先队列  *
 *************/
// 定义存储队列元素的病人对象，优先码小的优先级高。
function Patient(name, code) {
  this.name = name;
  this.code = code;
}

// 重新定义队列类的 dequeue 方法
Queue.prototype.dequeue = function () {
  var index = 0;
  var priority = this.dataStore[0].code;
  for (var i = 1; i < this.dataStore.length; i++) {
    if(this.dataStore[i].code < priority) {
      index = i;
      priority = this.dataStore[i].code;
    }
  }
  return this.dataStore.splice(index, 1);
}

// 显示队列
Queue.prototype.show = function () {
  var retStr = '';
  for (var i = 0; i < this.dataStore.length; i++) {
    retStr += this.dataStore[i].name + ' ' + this.dataStore[i].code + '\n';
  }
  console.log(retStr);
  return retStr;
}
var p = new Patient('selldon', 5);
var ed = new Queue();
ed.enqueue(p);
p = new Patient('amy', 4);
ed.enqueue(p);
p = new Patient('penny', 6);
ed.enqueue(p);
p = new Patient('lenerd', 1);
ed.enqueue(p);
p = new Patient('howerd', 1);
ed.enqueue(p);
ed.show();
console.log(ed.dequeue());
console.log(ed.dequeue());
console.log(ed.dequeue());
console.log(ed.dequeue());