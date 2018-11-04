function HashTable() {
  this.table = new Array(137);
  this.values = new Array(137);
}

HashTable.prototype.betterHash = function(key) {
  var total = 0;
  for (var i = 0; i < key.length; i++) {
    total += key.charCodeAt(i);
  }
  return total % this.table.length;
}

HashTable.prototype.put = function(key, data) {
  var pos = this.betterHash(key);
  if (!this.table[pos]) {
    this.table[pos] = key;
    this.values[pos] = data;
  } else {
    while (this.table[pos]) {
      pos++;
    }
    this.table[pos] = key;
    this.values[pos] = data;
  }
}

HashTable.prototype.get = function(key) {
  var hash = -1;
  hash = this.betterHash(key);
  if (hash > -1) {
    for (var i = hash; this.table[hash]; i++) {
      if (this.table[hash] == key) {
        return this.values[hash]
      }
    }
  }
  return undefined;
}

HashTable.prototype.showDistro = function() {
  var n = 0;
  for (var i = 0; i < this.table.length; i++) {
    if (this.table[i]) {
      console.log(i + ': ' + this.table[i]);
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genStuData(arr) {
  for (var i = 0; i < arr.length; i++) {
    var num = '';
    for (var j = 1; j <= 9; j++) {
      num += Math.floor(Math.random() * 10);
    }
    num += getRandomInt(50, 100);
    arr[i] = num;
  }
}

HashTable.prototype.buildChains = function() {
  for (var i = 0; i < this.table.length; i++) {
    this.table[i] = new Array();
  }
}

HashTable.prototype.put = function(key, data) {
  var pos = this.betterHash(key);
  var index = 0;
  if (!this.table[pos][index]) {
    this.table[pos][index] = key;
    this.table[pos][index + 1] = data;
  } else {
    do {
      index++;
    } while (this.table[pos][index])
    this.table[pos][index] = key;
    this.table[pos][index + 1] = data;
  }
}

HashTable.prototype.get = function(key) {
  var index = 0;
  var hash = this, betterHash
  (key);
  if (this.table[pos][index] == key) {
    return this.table[pos][index + 1];
  } else {
    do {
      index += 2;
    } while (this.table[pos][index] != key)
    return this.table[pos][index + 1];
  }
  return undefined;
}