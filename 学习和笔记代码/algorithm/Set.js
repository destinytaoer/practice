function Set() {
  this.dataStore = [];
}

// 返回元素的个数
Set.prototype.size = function() {
  return this.dataStore.length;
};

// 添加元素，成功则返回 ture，否则返回 false
Set.prototype.add = function(data) {
  if (this.dataStore.indexOf(data) < 0) {
    this.dataStore.push(data);
    return true;
  } else {
    return false;
  }
};

// 删除元素，成功则返回 ture，否则返回 false
Set.prototype.remove = function(data) {
  var pos = this.dataStore.indexOf(data);
  if (pos > -1) {
    this.dataStore.splice(pos, 1);
    return true;
  } else {
    return false;
  }
};

// 显示所有元素
Set.prototype.show = function() {
  console.log(this.dataStore);
};

// 判断是否包含某元素
Set.prototype.contains = function(data) {
  if (this.dataStore.indexOf(data) > -1) {
    return true;
  } else {
    return false;
  }
};

// 并集操作
Set.prototype.union = function(set) {
  var tempSet = new Set();
  for (var i = 0; i < this.dataStore.length; i++) {
    tempSet.add(this.dataStore[i]);
  }
  for (var i = 0; i < set.dataStore.length; i++) {
    tempSet.add(set.dataStore[i]);
  }
  return tempSet;
};


// 交集操作
Set.prototype.intersect = function(set) {
  var tempSet = new Set();
  for (var i = 0; i < this.dataStore.length; i++) {
    if (set.contains(this.dataStore[i])) {
      tempSet.add(this.dataStore[i]);
    }
  }
  return tempSet;
};

// 补集操作
Set.prototype.difference = function(set) {
  var tempSet = new Set();
  for (var i = 0; i < this.dataStore.length; i++) {
    if (!set.contains(this.dataStore[i])) {
      tempSet.add(this.dataStore[i]);
    }
  }
  return tempSet;
};


// 判断是否为参数子集
Set.prototype.subset = function(set) {
  if (this.size() > set.size()) {
    return false;
  } else {
    for (var data in this.dataStore) {
      console.log(data)
      if (!set.contains(data)) {
        return false;
      }
    }
  }
  return true;
}

var a = new Set();
a.add('a');a.add('b');a.add('c');a.add('d');
var b = new Set();
b.add('a');b.add('b');b.add('e');b.add('f');

console.log(a.subset(b));