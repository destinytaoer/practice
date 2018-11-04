function Dictionary() {
  this.dataStore = new Object();
}

Dictionary.prototype.add = function(key, value) {
  this.dataStore[key] = value;
}

Dictionary.prototype.find = function(key) {
  return this.dataStore[key];
}

Dictionary.prototype.remove = function(key) {
  delete this.dataStore[key];
}

Dictionary.prototype.showAll = function() {
  var keys = Object.keys(this.dataStore);
  keys.sort();
  for (var key in keys) {
    console.log(keys[key] + ' -> ' + this.dataStore[keys[key]]);
  }
}

Dictionary.prototype.count = function() {
  var n = 0;
  for (var key in this.dataStore) {
    n++;
  }
  return n;
}

Dictionary.prototype.clear = function() {
  for (var key in this.dataStore) {
    delete this.dataStore[key];
  }
}

var a = new Dictionary();
a.add('cc', '3');
a.add('aa', '1');
a.add('dd', '4');
a.add('bb', '2');
a.showAll();
console.log(a.count())
console.log(a.find('bb'));
console.log(a.find('ee'));
a.remove('aa');
a.showAll();
console.log(a.count());
a.clear();
a.showAll();
console.log(a.count());

var str = 'I love i you you love me';
str = str.split(' ');
console.log(str);
var b = new Dictionary();
str.forEach(function(key) {
  key = key.toLowerCase()
  if(b.find(key)) {
    var count = b.find(key) + 1;
    b.add(key, count);
  } else {
    b.add(key, 1);
  }
})
b.showAll();
var c = {a:1};
c.a++;
console.log(c.a)