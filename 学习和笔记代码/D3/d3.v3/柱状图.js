let width = 300,
  height = 300;
// 创建 svg
let svg = d3.select('#container').append('svg')
  .style('background', 'blue')
  .attr('width', width)
  .attr('height', height);


let data = [20, 50, 10, 30, 40]

// 线性比例尺
let linear = d3.scale.linear()
  .domain([0, d3.max(data)])
  .range([0, height - 20]);

// 坐标轴
let axis = d3.svg.axis()
  .scale(linear) // 按比例尺缩放
  .orient('bottom') // 位置
  .ticks(7) // 点数

svg.selectAll('rect')
  .data(data) // 绑定数据
  .enter()
  .append('rect') // 通过 enter 添加足够多的 rect 元素
  .attr('x', function (d, i) {
    return i * 22
  }) // 根据数据来设置 x 坐标
  .attr('y', 0) 
  .attr('width', 20)
  .attr('height', function (d) {
    return linear(d)
  }) // 根据数据和比例尺来定义高度
  .attr('fill', 'red')

svg.attr('transform', 'rotate(180 50 50)')