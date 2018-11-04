function Node(element) {
  this.data = element;
  this.next = null;
  this.previous = null;
}

function LList() {
  this.head = new Node('head');
  this.head.next = this.head;
}

// 查找指定 item 值的节点，查找成功返回该节点，否则返回 null
LList.prototype.find = function(item) {
  var curNode = this.head;
  while (curNode.data != item) {
    if (!curNode.next) {
      return null;
    } else {
      curNode = curNode.next;
    }
  }
  return curNode;
}

// 将新的节点插入到指定位置，成功返回 true，否则返回 false，说明查找插入位置的节点 item 不存在。
LList.prototype.insert = function(element, item) {
  var newNode = new Node(element);
  var curNode = this.find(item);
  if (curNode) {
    newNode.next = curNode.next;
    newNode.previous = curNode;
    if (curNode.next) {
      curNode.next.previous = newNode;
    }
    curNode.next = newNode;
    return true;
  } else {
    return false;
  }
}

// 查找某个节点的前一个节点
// LList.prototype.findPrevious = function(item) {
//   var curNode = this.head;
//   while(curNode.next && curNode.next.data != item) {
//     curNode = curNode.next;
//   }
//   return curNode;
// }

// 删除某个元素
LList.prototype.remove = function(item) {
  var curNode = this.find(item);
  if (curNode) {
    curNode.previous.next = curNode.next;
    if (curNode.next) {
      curNode.next.previous = curNode.previous;
    }
    curNode.next = null;
    curNode.previous = null;
  }
}

// 显示链表
LList.prototype.display = function() {
  var curNode = this.head;
  while (curNode.next) {
    console.log(curNode.next.data);
    curNode = curNode.next;
  }
}

// 直接找到最后一个节点，避免每次都从前遍历到最后
LList.prototype.findLast = function() {
  var curNode = this.head;
  while (curNode.next) {
    curNode = curNode.next;
  }
  return curNode;
}

// 从后遍历显示
LList.prototype.displayReverse = function() {
  var curNode = this.findLast();
  while (curNode.previous) {
    console.log(curNode.data);
    curNode = curNode.previous;
  }
}


var cities = new LList();
cities.insert('aa', 'head');
cities.insert('bb', 'aa');
cities.insert('cc', 'bb');
cities.display();
cities.remove('bb');
cities.display();
cities.displayReverse();