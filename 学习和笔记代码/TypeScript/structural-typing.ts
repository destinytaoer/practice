/**
 * 对象类型的兼容，如果 s 要兼容 y，那么 y 必须至少具有与 s 中相同的属性
 */
interface Named {
  name: string;
}

let s: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
s = y;
// 编译器只会递归检查目标类型（Named）的所有属性是否兼容
// 即，y 包含的属性只能大于等于 s

/**
 * 函数类型的兼容
 */

// 参数的兼容
let func1 = (a: number) => 0
let func2 = (a: number, b: string) => 0

func2 = func1
// func1 = func2 // 报错

// 返回值的兼容
let func3 = () => ({ a: 'aa' })
let func4 = () => ({ a: 'aa', b: 'bb' })

func3 = func4
// func4 = func3 // 报错

// 可选参数和剩余参数
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    
}

// 不健全的，invokeLater 可能提供了任意的参数
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

// 混乱且无法被发现，实际上 x y 是必须的
invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));

/**
 * 枚举的兼容性
 */
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status1 = Status.Ready;
// status1 = Color.Green;  // 报错

let status2: number = Status.Ready;
status2 = Color.Green;  // 正确

/**
 * 类的兼容性，只比较实例部分，不进行静态部分和构造函数的比较
 */
// 忽略静态属性和构造函数
class Dog {
  name: string = 'wangcai';
  static color: string = 'red';
  constructor(name: string, feet: number) {

  }
}

class Cat {
  name: string = 'kitty';
  constructor(name: string) {

  }
}

let dog: Dog = new Dog('aa', 4)
let cat: Cat = new Cat('bb')
dog = cat
cat = dog

// 私有和受保护的属性
class Windows {
  private name: string = 'windows';
}

class Mac {
  name:string = 'mac'
}

class Lenvo extends Windows {
  type: string = 'aa';
}

let windows = new Windows()
let mac = new Mac()
let lenvo = new Lenvo()
// windows = mac // 报错
// mac = windows // 报错
// lenvo = windows // 报错，如果子类没有其他任何属性，则不报错
windows = lenvo

/**
 * 泛型的兼容性
 */
// 没指定具体的泛型类型的泛型参数，会当做 any 类型
let l1 = function <T>(x: T): T { // (x: any) => any
  return x
}
let l2 = function <U>(y: U): U { // (y: any) => any
  return y
}

l1 = l2
l2 = l1

// 类型参数只影响使用其作为类型一部分的结果类型
interface Empty<T> {
}
let x1: Empty<number> = 1;
let y1: Empty<string> = 'sd';

x1 = y1;

// 对比
interface NotEmpty<T> {
  data: T;
}
let x2: NotEmpty<number> = {data: 1};
let y2: NotEmpty<string> = {data: 'sdf'};

// x2 = y2; // 报错