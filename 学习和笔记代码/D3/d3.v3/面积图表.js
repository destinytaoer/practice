// 面积图表是在曲线图表的基础上，增加了曲线到 x 轴之间的面积阴影
var width = 500,
  height = 200,
  margin = { left: 50, top: 30, right: 20, bottom: 20 },
  g_width = width - margin.left - margin.right,
  g_height = height - margin.top - margin.bottom
    

var svg = d3.select('#container') // 选择元素，select 单选， selectAll 多选，传入的是选择器字符串或者DOM
  .append('svg') // d3 可以使用链式写法。使用 append 插入元素
  .attr('width', width) // 使用 attr 设置属性
  .attr('height', height)
  .style('background', '#eee')

var g = svg.append('g') // g 标签分组
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')') // 平移一段距离

var data = [1, 3, 5, 7, 8, 4, 3, 7]

// 定义缩放比例尺
var scale_x = d3.scale.linear()
  .domain([0, data.length - 1])
  .range([0, g_width])

var scale_y = d3.scale.linear()
  .domain([0, d3.max(data)])
  .range([g_height, 0])

// 通过 d3.svg 的 area 方法来生成 area_generator 函数
var area_generator = d3.svg.area()
  .x(function(d, i) {return scale_x(i)}) // 生成 x 坐标值
  .y0(g_height) // 是实际上的 x 轴
  .y1(function (d, i) { return scale_y(d) }) // 生成 y 坐标值
  .interpolate('cardinal') // 指定一个折线的拟合方式，使它变成曲线

// path 元素中 d（表示 data） 属性的值，M 表示七点坐标，L 表示下一个点的坐标
g.append('path')
  .attr('d', area_generator(data)) //通过 area_generator(data) 来生成 "M1,0L20,40L40,50L50,100"
  .style('fill', '#469284')

// 定义坐标轴
var x_axis = d3.svg.axis().scale(scale_x),
  y_axis = d3.svg.axis().scale(scale_y).orient('left');

g.append('g')
  .call(x_axis)
  .attr('transform', 'translate(0,' + g_height + ')')

g.append('g')
  .call(y_axis)
  .append('text')
  .text('Price($)')
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'end')
  .attr('dy', '1em')