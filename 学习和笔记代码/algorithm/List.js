function List(arr=[]) {
  this.listSize = arr.length;
  this.pos = 0;
  this.dataStore = arr;
}

//添加元素，参数为元素，在数组末尾添加元素。
List.prototype.append = function (element) {
  this.dataStore[this.listSize++] = element;
}

//查找元素，参数为元素，查找成功返回其位置；查找失败返回 -1。
List.prototype.find = function (element) {
  for (var i = this.listSize - 1; i >= 0; i--) {
    if (this.dataStore[i] == element) {
      return i;
    }
  }
  return -1;
}

//删除元素，参数为元素，先查找元素，再将其删除，删除成功返回 true；查找失败或删除失败返回 false。
List.prototype.remove = function (element) {
  var foundAt = this.find(element);

  if (foundAt > -1) {
    this.dataStore.splice(foundAt, 1);
    this.listSize--;
    return true;
  }
  return false;
}


//列表长度，返回列表元素个数
List.prototype.length = function () {
  return this.listSize;
}

//显示列表中的元素，直接返回数组
List.prototype.toString = function () {
  return this.dataStore;
}

//插入元素，参数为要插入的元素以及在哪个元素后插入，插入成功返回 true；插入失败返回 false。
List.prototype.insert = function (element, after) {
  var insertPos = this.find(after);
  if (insertPos > -1) {
    this.dataStore.splice(insertPos + 1, 0, element);
    this.listSize++;
    return true;
  }
  return false;
}

//清空列表
List.prototype.clear = function () {
  delete this.dataStore;
  this.dataStore = [];
  this.listSize = this.pos = 0;
}

//迭代器方法

//当前位置回到开头
List.prototype.front = function () {
  this.pos = 0;
}

//当前位置跳到最后
List.prototype.end = function () {
  this.pos = this.listSize - 1;
}

//当前位置往后移一位
List.prototype.next = function () {
  if (this.pos < this.listSize) {
    this.pos++;
  }
}

//当前位置向前移一位
List.prototype.prev = function () {
  if (this.pos >= 0) {
    this.pos--;
  }
}

//返回当前位置
List.prototype.currentPos = function () {
  return this.pos;
}

//移动到某一位置
List.prototype.moveTo = function (position) {
  if (position < this.listSize && position >= 0) {
    this.pos = position;
  }
}

//获取当前位置元素
List.prototype.getElement = function () {
  return this.dataStore[this.pos];
}

function displayList(list) {
  for (list.front(); list.currentPos() < list.length(); list.next()) {
    if (list.getElement() instanceof Customer) {
      console.log(list.getElement().name + ',' + list.getElement().movie);
    } else {
      console.log(list.getElement());
    }
  }
}

function Customer(name, movie) {
  this.name = name;
  this.movie = movie;
}

function checkOut(name, movie, movieList, customerList) {
  if (movieList.find(movie) > -1) {
    var c = new Customer(name, movie);
    customerList.append(c);
    movieList.remove(movie)
  } else {
    console.log(movie + ' is available')
  }
}

var movie = ['aa', 'bb', 'cc']

var movieList = new List(movie);
var customerList = new List();

displayList(movieList)
checkOut('destiny', 'aa', movieList, customerList)
displayList(customerList)
displayList(movieList)