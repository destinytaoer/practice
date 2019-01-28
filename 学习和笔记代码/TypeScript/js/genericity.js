"use strict";
/**
 * 什么是泛型
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function log1(arg) {
    return arg;
}
// 虽然按照函数代码，传入什么就是什么，但是没有明确的类型规定，因此丢失了一些信息，无法判断是否传入和返回的是相同的类型
//=> 转换成泛型，T 为类型变量
function log2(arg) {
    return arg;
}
/**
 * 泛型函数的使用
 */
// T 可以在使用时规定，也可以通过自动的类型推断，传入什么类型的值，T 就会自动成为什么类型
log2('long'); // T 为 string
log2(12); // T 为 number
/**
 * 泛型变量
 */
// 使用时特别注意的是，泛型变量可能是任意类型，只有当指定的所有类型都满足时，才能使用
function log3(arg) {
    // console.log(arg.length) // 报错，原因在于不是所有类型都拥有 length 属性
    return arg;
}
// 解决方案：将泛型当作泛型变量类型的一部分，而不是完全是泛型。将其转换为泛型数组
function log4(arg) {
    console.log(arg.length); // 正确，所有数组都拥有 length 属性
    return arg;
}
/**
 * 泛型的类型
 */
// 箭头表示法
var myLog = log1;
// T 可以替换成其他
var myLog2 = log1;
// 对象字面量表示法
var myLog3 = log1;
var myLog4 = log1;
var myLog5 = log1;
// 此时我们就能够知道具体使用的是哪一个泛型类型。传入类型之后，就会锁定了该泛型函数内部的类型
/**
 * 泛型类
 */
var NumberSet = /** @class */ (function () {
    function NumberSet() {
        this.arr = [];
    }
    NumberSet.prototype.add = function (ele) {
        this.arr.push(ele);
    };
    NumberSet.prototype.min = function () {
        var min = this.arr[0];
        this.arr.forEach(function (value) {
            if (value < min) {
                min = value;
            }
        });
        return min;
    };
    return NumberSet;
}());
var number = new NumberSet();
number.min();
function log5(arg) {
    console.log(arg.length); // 正确
    return arg;
}
// 类型参数之间的约束
function getProperty(obj, key) {
    return obj[key];
}
var x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, "a"); // 正确
// getProperty(x, "m"); // 报错: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
// 泛型约束中使用类类型
function create(c) {
    return new c();
}
// 高级使用类类型的例子
var BeeKeeper = /** @class */ (function () {
    function BeeKeeper(hasMask) {
        this.hasMask = hasMask;
    }
    return BeeKeeper;
}());
var ZooKeeper = /** @class */ (function () {
    function ZooKeeper(nameTag) {
        this.nameTag = nameTag;
    }
    return ZooKeeper;
}());
var Animal = /** @class */ (function () {
    function Animal(numLegs) {
        this.numLegs = numLegs;
    }
    return Animal;
}());
var Bee = /** @class */ (function (_super) {
    __extends(Bee, _super);
    function Bee(numLegs, keeper) {
        if (keeper === void 0) { keeper = new BeeKeeper(true); }
        var _this = _super.call(this, numLegs) || this;
        _this.keeper = keeper;
        return _this;
    }
    return Bee;
}(Animal));
var Lion = /** @class */ (function (_super) {
    __extends(Lion, _super);
    function Lion(numLegs, keeper) {
        if (keeper === void 0) { keeper = new ZooKeeper('a'); }
        var _this = _super.call(this, numLegs) || this;
        _this.keeper = keeper;
        return _this;
    }
    return Lion;
}(Animal));
function createInstance(c, num) {
    return new c(num);
}
createInstance(Lion, 4).keeper.nameTag;
createInstance(Bee, 10).keeper.hasMask;
