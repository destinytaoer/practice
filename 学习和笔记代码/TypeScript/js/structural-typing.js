"use strict";
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
var s;
// y's inferred type is { name: string; location: string; }
var y = { name: 'Alice', location: 'Seattle' };
s = y;
// 编译器只会递归检查目标类型（Named）的所有属性是否兼容
// 即，y 包含的属性只能大于等于 s
/**
 * 函数类型的兼容
 */
// 参数的兼容
var func1 = function (a) { return 0; };
var func2 = function (a, b) { return 0; };
func2 = func1;
// func1 = func2 // 报错
// 返回值的兼容
var func3 = function () { return ({ a: 'aa' }); };
var func4 = function () { return ({ a: 'aa', b: 'bb' }); };
func3 = func4;
// func4 = func3 // 报错
// 可选参数和剩余参数
function invokeLater(args, callback) {
}
// 不健全的，invokeLater 可能提供了任意的参数
invokeLater([1, 2], function (x, y) { return console.log(x + ', ' + y); });
// 混乱且无法被发现，实际上 x y 是必须的
invokeLater([1, 2], function (x, y) { return console.log(x + ', ' + y); });
/**
 * 枚举的兼容性
 */
var Status;
(function (Status) {
    Status[Status["Ready"] = 0] = "Ready";
    Status[Status["Waiting"] = 1] = "Waiting";
})(Status || (Status = {}));
;
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
    Color[Color["Green"] = 2] = "Green";
})(Color || (Color = {}));
;
var status1 = Status.Ready;
// status1 = Color.Green;  // 报错
var status2 = Status.Ready;
status2 = Color.Green; // 正确
/**
 * 类的兼容性，只比较实例部分，不进行静态部分和构造函数的比较
 */
// 忽略静态属性和构造函数
var Dog = /** @class */ (function () {
    function Dog(name, feet) {
        this.name = 'wangcai';
    }
    Dog.color = 'red';
    return Dog;
}());
var Cat = /** @class */ (function () {
    function Cat(name) {
        this.name = 'kitty';
    }
    return Cat;
}());
var dog = new Dog('aa', 4);
var cat = new Cat('bb');
dog = cat;
cat = dog;
// 私有和受保护的属性
var Windows = /** @class */ (function () {
    function Windows() {
        this.name = 'windows';
    }
    return Windows;
}());
var Mac = /** @class */ (function () {
    function Mac() {
        this.name = 'mac';
    }
    return Mac;
}());
var Lenvo = /** @class */ (function (_super) {
    __extends(Lenvo, _super);
    function Lenvo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'aa';
        return _this;
    }
    return Lenvo;
}(Windows));
var windows = new Windows();
var mac = new Mac();
var lenvo = new Lenvo();
// windows = mac // 报错
// mac = windows // 报错
// lenvo = windows // 报错，如果子类没有其他任何属性，则不报错
windows = lenvo;
/**
 * 泛型的兼容性
 */
// 没指定具体的泛型类型的泛型参数，会当做 any 类型
var l1 = function (x) {
    return x;
};
var l2 = function (y) {
    return y;
};
l1 = l2;
l2 = l1;
var x1 = 1;
var y1 = 'sd';
x1 = y1;
var x2 = { data: 1 };
var y2 = { data: 'sdf' };
// x2 = y2; // 报错
