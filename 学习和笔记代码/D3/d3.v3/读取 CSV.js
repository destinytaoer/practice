// 三个参数，文件路径，中间处理函数和回调函数
// 中间处理函数的返回值，将作为回调函数中的参数
d3.csv('data.csv', type, function (data) {
  var width = 600,
    height = 300,
    margin = { left: 30, right: 30, top: 30, bottom: 30 },
    svg_width = width + margin.left + margin.right,
    svg_height = height + margin.top + margin.bottom;

  // y 轴缩放为线性比例尺
  var scale_y = d3.scale.linear()
    .domain([0, d3.max(data, function (d) { return d.population; })])
    .range([height, 0]);

  // x 轴缩放为序数比例尺
  // rangeBands 方法接受一个大的范围参数、一个inner padding，一个outer padding
  var scale_x = d3.scale.ordinal()
    .domain(data.map((d) => {
      return d.year
    }))
    .rangeBands([0, width], 0.1)
  // 最后返回的 scale_x 中，有是三个值：
  // scale_x.rangeBand() => 每一个值对应的范围
  // scale_x.range() => 定义域中的值对应的开始位置
  // scale_x.rangeExtent() => 大范围参数的值

  var svg = d3.select('#container')
    .append('svg')
    .attr({
      'width': svg_width,
      'height': svg_width
    });

  var chart = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // 定义坐标轴
  var x_axis = d3.svg.axis().scale(scale_x)
  var y_axis = d3.svg.axis().scale(scale_y).orient('left')

  // 生成 x y 坐标轴
  chart.append('g')
    .call(x_axis)
    .attr('transform', 'translate(0,'+ height + ')')

  chart.append('g')
    .call(y_axis)
    

  var bar = chart.selectAll('g.bar')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar')
    .attr('transform', function (d) {
      console.log(scale_x(d.year));
      return 'translate(' + scale_x(d.year) + ',0)'
    })

  bar.append('rect')
    .attr({
      'y': function (d) {
        return scale_y(d.population)
      },
      'width': scale_x.rangeBand(),
      'height': function (d) {
        return height - scale_y(d.population)
      }
    })
    .style('fill', 'steelblue')

  bar.append('text')
    .text(function (d) {
      return d.year
    })
    .attr({
      'x': scale_x.rangeBand()/2,
      'y': function (d) {
        return scale_y(d.population)
      },
      'text-anchor': 'middle',
      'dominant-baseline': 'hanging'
    })
});

function type(data) {
  data.population = +data.population
  return data
}