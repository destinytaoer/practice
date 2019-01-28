"use strict";
/**
 * 数字枚举
 */
var Direction;
(function (Direction) {
    Direction[Direction["up"] = 0] = "up";
    Direction[Direction["down"] = 1] = "down";
    Direction[Direction["left"] = 2] = "left";
    Direction[Direction["right"] = 3] = "right";
})(Direction || (Direction = {}));
// 自动分配 up-0 down-1 left-2 right-3
var Direction2;
(function (Direction2) {
    Direction2[Direction2["up"] = 1] = "up";
    Direction2[Direction2["down"] = 2] = "down";
    Direction2[Direction2["left"] = 3] = "left";
    Direction2[Direction2["right"] = 4] = "right"; // 4
})(Direction2 || (Direction2 = {}));
var Direction3;
(function (Direction3) {
    Direction3[Direction3["up"] = 0] = "up";
    Direction3[Direction3["down"] = 2] = "down";
    Direction3[Direction3["left"] = 3] = "left";
    Direction3[Direction3["right"] = 4] = "right"; // 4
})(Direction3 || (Direction3 = {}));
/**
 * 字符串枚举
 */
var Direction4;
(function (Direction4) {
    Direction4["Up"] = "UP";
    Direction4["Down"] = "DOWN";
    Direction4["Left"] = "LEFT";
    Direction4["Right"] = "RIGHT";
})(Direction4 || (Direction4 = {}));
/**
 * 异构枚举，不建议使用
 */
var BooleanLikeHeterogeneousEnum;
(function (BooleanLikeHeterogeneousEnum) {
    BooleanLikeHeterogeneousEnum[BooleanLikeHeterogeneousEnum["No"] = 0] = "No";
    BooleanLikeHeterogeneousEnum["Yes"] = "YES";
})(BooleanLikeHeterogeneousEnum || (BooleanLikeHeterogeneousEnum = {}));
/**
 * 联合枚举与枚举成员的类型
 */
// 枚举成员可以作为类型
var ShapeKind;
(function (ShapeKind) {
    ShapeKind[ShapeKind["Circle"] = 0] = "Circle";
    ShapeKind[ShapeKind["Square"] = 1] = "Square";
})(ShapeKind || (ShapeKind = {}));
var circle = {
    // kind: ShapeKind.Square, // 报错
    kind: ShapeKind.Circle,
    radius: 100,
};
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
