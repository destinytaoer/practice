"use strict";
/**
 * 交叉类型
 */
function extend(first, second) {
    var result = {};
    for (var id in first) {
        result[id] = first[id];
    }
    for (var id in second) {
        if (!result.hasOwnProperty(id)) {
            result[id] = second[id];
        }
    }
    return result;
}
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    return Person;
}());
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger() {
    }
    ConsoleLogger.prototype.log = function () {
        // ...
    };
    return ConsoleLogger;
}());
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
// 不能交叉基本类型
var cha; // 不会报错，但是没办法给它赋值
/**
 * 联合类型
 */
// 是或的关系，是其中一个类型都符合
var union;
union = 1;
union = 'qq';
// union = undefined // 报错
// union = true // 报错
// 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员，与 any 作为参数类型时一样，不能访问 length 属性一样
function add(num) {
    // num.length // 报错
    // num + num // 报错，这个比较奇怪
    return num;
}
function getSmallPet() {
    // ...
    var a = {
        fly: function () { return 'aa'; },
        layEggs: function () { return 'aa'; }
    };
    return a;
}
var pet = getSmallPet();
pet.layEggs(); // okay
// pet.swim();    // errors
/**
 * 类型保护与区分类型
 */
var pet1 = getSmallPet();
// 每一个成员访问都会报错
// if (pet1.swim) {
//     pet1.swim();
// }
// else if (pet1.fly) {
//     pet1.fly();
// }
// 类型断言，去除报错，但是，我们不得不使用很多的类型断言
var pet2 = getSmallPet();
if (pet2.swim) {
    pet2.swim();
}
else {
    pet2.fly();
}
// 自定义类型保护
function isFish(pet) {
    return pet.swim !== undefined;
} // 返回值为一个类型谓词
// 每当使用一些变量调用 isFish时，TypeScript会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的。
if (isFish(pet)) {
    pet.swim();
}
else { // TypeScript 不仅知道在 if 分支里 pet 是 Fish 类型，它还清楚在 else 分支里，一定不是 Fish 类型，一定是剩下的其他类型的联合类型
    pet.fly();
}
function getSmallPet1() {
    // ...
    var a = {
        fly: function () { return 'aa'; },
        layEggs: function () { return 'aa'; }
    };
    return a;
}
function isFish2(pet) {
    return pet.swim !== undefined;
}
var pet3 = getSmallPet1();
if (isFish2(pet3)) {
    pet3.swim();
}
else {
    // pet3.bark() // 报错，剩下的是 Bird | Dog2 类型
}
// typeof 类型保护
function isNumber(x) {
    return typeof x === "number";
}
function isString(x) {
    return typeof x === "string";
}
function padLeft(value, padding) {
    if (isNumber(padding)) {
        return Array(padding + 1).join(" ") + value;
    }
    if (isString(padding)) {
        return padding + value;
    }
    throw new Error("Expected string or number, got '" + padding + "'.");
}
// 但是每一个类型判断都需要定义一个独立的函数，这是不友好的，TypeScript 可以自动识别 typeof x === "number" 为一个类型保护
function padLeft2(value, padding) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error("Expected string or number, got '" + padding + "'.");
}
var SpaceRepeatingPadder = /** @class */ (function () {
    function SpaceRepeatingPadder(numSpaces) {
        this.numSpaces = numSpaces;
    }
    SpaceRepeatingPadder.prototype.getPaddingString = function () {
        return Array(this.numSpaces + 1).join(" ");
    };
    return SpaceRepeatingPadder;
}());
var StringPadder = /** @class */ (function () {
    function StringPadder(value) {
        this.value = value;
    }
    StringPadder.prototype.getPaddingString = function () {
        return this.value;
    };
    return StringPadder;
}());
function getRandomPadder() {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder(4) :
        new StringPadder("  ");
}
// 类型为SpaceRepeatingPadder | StringPadder
var padder = getRandomPadder();
if (padder instanceof SpaceRepeatingPadder) {
    padder; // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
    padder; // 类型细化为'StringPadder'
}
