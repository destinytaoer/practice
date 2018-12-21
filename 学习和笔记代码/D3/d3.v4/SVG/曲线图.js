let data = [1, 5, 6, 9, 4, 2, 8, 3, 7],
  width = 600,
  height = 600,
  padding = {
    top: 50,
    left: 50,
    bottom: 50,
    right: 50
  },
  svg_w = width + padding.left + padding.right,
  svg_h = height + padding.top + padding.bottom;

let svg = d3.select('#container')
  .append('svg')
  .attr('width', svg_w)
  .attr('height', svg_h)

let g = svg.append('g')
  .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')

let scale_y = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([height, 0])

let scale_x = d3.scaleLinear()
  .domain([0, data.length-1])
  .range([0, width])

// 折线路径生成器
let line_generator = d3.line()
  .x(function (d, i) {
    return scale_x(i)
  })
  .y(function (d,i) {
    return scale_y(d)
  })
  .curve(d3.curveCardinal) // 曲线拟合，参数是拟合方式

g.selectAll('path')
  .data(data).enter().append('path')
  .attr('d', line_generator(data))

let x_axis = d3.axisBottom().scale(scale_x)
let y_axis = d3.axisLeft().scale(scale_y)

g.append('g').call(x_axis)
  .attr('transform', 'translate(0,'+ height +')')
g.append('g').call(y_axis)