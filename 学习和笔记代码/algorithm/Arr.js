function Grades(grades) {
  this.grades = grades;
}

//查找，参数为字符串名字，查找成功返回 1，并打印该人成绩；查找失败返回 -1。
Grades.prototype.search = function(name) {
  for(var i = 0; i < this.grades.length; i++){
    if(this.grades[i][0] == name) {
      console.log(this.grades[i]);
      return 1;
    }
  }
  console.log("Not Found");
  return -1;
};

//添加成绩，参数为数组：名字和成绩，把这个数组添加进成绩表的二维数组。
Grades.prototype.addGrades = function(grade) {
  this.grades.push(grade);
  console.log("添加成功");
  return true;
};

//显示学生平均成绩，参数为名字，找到其位置，计算并打印其平均成绩。
Grades.prototype.showAverage = function(name) {
  var total = 0;
  var average = 0;
  var foundAt = this.search(name);
  if(foundAt > -1) {
    for(var j = 1; j < this.grades[foundAt].length; j++) {
      total += this.grades[foundAt][j];
    }
    average = total / (this.grades[foundAt].length - 1);
    console.log(average);
    return average;
  }
  console.log("未找到该学生");
  return -1;
};

var arr = [["zhu", 20, 10, 30], ["xin", 30, 40, 50]];

var list = new Grades(arr);

list.search("zhu");
list.showAverage("zhu");
list.showAverage("xin");
list.addGrades(["mei", 60, 70, 80]);
list.search("mei");

var words = ["aa", "cc", "bb", "dd"];

function concat(a, b) {
  return a + " " + b;
}

var search = words.reduceRight(concat).split(" ");
console.log(search);
