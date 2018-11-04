function Stack() {
  this.dataStore = [];
  this.top = 0;
}

// 入栈，传入参数为入栈的元素
Stack.prototype.push = function (element) {
  this.dataStore[this.top++] = element;
}

// 出栈，弹出一个元素，并返回这个元素
Stack.prototype.pop = function () {
  return this.dataStore[--this.top];
}

// 返回栈顶元素
Stack.prototype.peek = function () {
  return this.dataStore[this.top - 1];
}

// 返回栈的长度
Stack.prototype.length = function () {
  return this.top;
}

// 清空栈
Stack.prototype.clear = function () {
  this.top = 0;
}

function mulBase(num, base) {
  var s = new Stack();
  do {
    s.push(num % base);
    num = Math.floor(num /= base);
  } while (num > 0);
  var converted = '';
  while (s.length() > 0) {
    converted += s.pop();
  }
  return converted;
}

console.log(mulBase(10, 2));
console.log(mulBase(10, 8));

function isPalindrome(word) {
  var s = new Stack();
  for (var i = 0; i < word.length; i++) {
    s.push(word[i]);
  }
  var rword = '';
  while (s.length() > 0) {
    rword += s.pop();
  }
  if (word == rword) {
    return true;
  } else {
    return false;
  }
}
console.log(isPalindrome('abccba'));
console.log(isPalindrome('1010'));