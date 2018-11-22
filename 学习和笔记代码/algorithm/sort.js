/* 冒泡排序 */
function bubbleSort(arr) {
  let len = arr.length - 1,
    outer, inner;

  for (outer = len; outer > 0; outer--) {
    for (inner = 0; inner < len; inner++) {
      if (arr[inner] > arr[inner + 1]) {
        [arr[inner], arr[inner + 1]] = [arr[inner + 1], arr[inner]];
      }
    }
  }
}

/* 选择排序 */
function selectionSort(arr) {
  let len = arr.length - 1,
    outer, inner, min;
  for (outer = 0; outer < len; outer++) {
    min = outer;
    for (inner = outer + 1; inner <= len; inner++) {
      if (arr[min] > arr[inner]) {
        min = inner;
      }
    }
    if (outer !== min) {
      [arr[outer], arr[min]] = [arr[min], arr[outer]];
    }
  }
}

/* 插入排序 */
function insertionSort(arr) {
  let len = arr.length;
  for (let outer = 1; outer < len; outer++) {
    let temp = arr[outer];
    let inner = outer;
    while (inner > 0 && arr[inner - 1] > temp) {
      arr[inner] = arr[inner - 1];
      inner--;
    }
    arr[inner] = temp
  }
}

/* 希尔排序 */
let gaps = [5, 3, 1];

function shellSort(arr) {
  let g, i, j, temp;
  // 外层对间隔序列进行遍历
  // 也就是说，第一轮使用间隔 5，第二轮使用间隔 3，第三轮使用间隔 1
  for (g = 0; g < gaps.length; g++) {
    // i 从间隔数开始，后面所有的数都要与对应前面一定间隔的数进行比较
    for (i = gaps[g]; i < arr.length; i++) {
      temp = arr[i];// 保存当前的数
      
      // 把前面一定间隔的数中，比它大的都往后挪，直到找到比它小的为止
      // 注意这个 j 必须大于等于 gaps[g]，原因在于， j 表示的是当前位置，而它比较的是前一个位置的值，如果 j 小于间隔，那么前面的位置就没有值了
      for (j = i; j >= gaps[g] && arr[j - gas[g]] > temp; j -= gaps[g]) {

      }
      arr[j] = temp;
    }
  }
}


/* 归并排序 */
function merge(arr, lStart, lStop, rStart, rStop) {
  let lArr = [],
    rArr = [],
    rLen = rStop - rStart,
    lLen = lStop - lStart,
    k = lStart,
    m = 0,
    n = 0;
  for (let i = 0; i < lLen; i++) {
    lArr[i] = arr[k];
    k++;
  }
  k = rStart;
  for (let i = 0; i < rLen; i++) {
    rArr[i] = arr[k];
    k++;
  }
  k = lStart;
  while (m < lLen && n < rLen) {
    if (lArr[m] < rArr[n]) {
      arr[k++] = lArr[m++];
    } else {
      arr[k++] = rArr[n++]
    }
  }
  while (m < lLen) {
    arr[k++] = lArr[m++];
  }
  while (n < rLen) {
    arr[k++] = rArr[n++];
  }
}

function mergeSort(arr) {
  if (arr.length < 2) {
    return;
  }
  let step = 1,
    len = arr.length,
    left, right;
  while (step < len) {
    left = 0;
    right = step;
    while (right + step <= len) {
      merge(arr, left, left + step, right, right + step);
      left = right + step;
      right = left + step;
    }
    if (right < len) {
      merge(arr, left, left + step, right, arr.length);
    }
    step *= 2;
  }
}

/* 快速排序 */
function quickSort(arr) {
  if (arr.length < 2) return arr;

  let left = [],
    right = [],
    pivot = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }
  return quickSort(left).concat(pivot, quickSort(right));
}

function partition(arr, start, stop) {
  let pivot = Math.floor((start + stop) / 2),
    i = start,
    j = stop;

  while (i <= j) {
    while (arr[i] < arr[pivot]) {
      i++;
    }
    while (arr[j] > arr[pivot]) {
      j--;
    }

    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }
  return i;
}

function quickSort2(arr, left, right) {

  if (arr.length < 2) return arr;

  left = (typeof left !== "number" ? 0 : left);

  right = (typeof right !== "number" ? arr.length - 1 : right);

  var index = partition(arr, left, right);

  if (left < index - 1) {
    quickSort(arr, left, index - 1);
  }

  if (index < right) {
    quickSort(arr, index, right);
  }

  return arr;

}

let ary = [];

for (let i = 0; i < 10000; i++) {
  ary.push(Math.floor(Math.random() * 10000));
}

quickSort(ary)

console.log(ary);