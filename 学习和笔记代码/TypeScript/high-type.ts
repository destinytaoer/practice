/**
 * 交叉类型
 */
function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{};
  for (let id in first) {
      (<any>result)[id] = (<any>first)[id];
  }
  for (let id in second) {
      if (!result.hasOwnProperty(id)) {
          (<any>result)[id] = (<any>second)[id];
      }
  }
  return result;
}

class Person {
  constructor(public name: string) { }
}
interface Loggable {
  log(): void;
}
class ConsoleLogger implements Loggable {
  log() {
      // ...
  }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();

// 不能交叉基本类型
let cha: number & string // 不会报错，但是没办法给它赋值

/**
 * 联合类型
 */
// 是或的关系，是其中一个类型都符合
let union: number | string;
union = 1;
union = 'qq';
// union = undefined // 报错
// union = true // 报错

// 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员，与 any 作为参数类型时一样，不能访问 length 属性一样
function add(num: number | string): number | string {
  // num.length // 报错
  // num + num // 报错，这个比较奇怪
  return num
}
interface Bird {
  fly(): any;
  layEggs(): any;
}

interface Fish {
  swim():any;
  layEggs():any;
}

interface Dog2 {
  bark(): any;
}

function getSmallPet(): Fish | Bird {
  // ...
  let a: Bird = {
    fly: () => { return 'aa' },
    layEggs: () =>{ return 'aa'}
  }
  return a
}

let pet = getSmallPet();
pet.layEggs(); // okay
// pet.swim();    // errors

/**
 * 类型保护与区分类型
 */

let pet1 = getSmallPet();
// 每一个成员访问都会报错
// if (pet1.swim) {
//     pet1.swim();
// }
// else if (pet1.fly) {
//     pet1.fly();
// }

// 类型断言，去除报错，但是，我们不得不使用很多的类型断言
let pet2 = getSmallPet();

if ((<Fish>pet2).swim) {
    (<Fish>pet2).swim();
}
else {
    (<Bird>pet2).fly();
}

// 自定义类型保护
function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
} // 返回值为一个类型谓词

// 每当使用一些变量调用 isFish时，TypeScript会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的。
if (isFish(pet)) {
  pet.swim();
}
else { // TypeScript 不仅知道在 if 分支里 pet 是 Fish 类型，它还清楚在 else 分支里，一定不是 Fish 类型，一定是剩下的其他类型的联合类型
  pet.fly();
}

function getSmallPet1(): Fish | Bird | Dog2 {
  // ...
  let a: Bird = {
    fly: () => { return 'aa' },
    layEggs: () =>{ return 'aa'}
  }
  return a
}
function isFish2(pet: Fish | Bird | Dog2): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}
let pet3 = getSmallPet1()

if (isFish2(pet3)) {
  pet3.swim()
}
else {
  // pet3.bark() // 报错，剩下的是 Bird | Dog2 类型
}

// typeof 类型保护
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
      return Array(padding + 1).join(" ") + value;
  }
  if (isString(padding)) {
      return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

// 但是每一个类型判断都需要定义一个独立的函数，这是不友好的，TypeScript 可以自动识别 typeof x === "number" 为一个类型保护
function padLeft2(value: string, padding: string | number) {
  if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
      return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

// typeof类型保护只有两种形式能被识别： typeof v === "typename"和 typeof v !== "typename"， "typename"必须是 "number"， "string"， "boolean"或 "symbol"。

// instanceof 类型保护，通过构造函数来细化类型
interface Padder {
  getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) { }
  getPaddingString() {
      return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) { }
  getPaddingString() {
      return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5 ?
      new SpaceRepeatingPadder(4) :
      new StringPadder("  ");
}

// 类型为SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
  padder; // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
  padder; // 类型细化为'StringPadder'
}

