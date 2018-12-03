let data = [1, 5, 6, 9, 4, 2, 8, 3, 7],
  padding = {
    top: 50,
    left: 50,
    bottom: 50,
    right: 50
  },
  width = 600,
  height = 600,
  svg_w = width + padding.left + padding.right,
  svg_h = height + padding.top + padding.bottom;

// v4/v5 版本 attr/style 不支持对象的写法
let svg = d3.select('#container')
  .append('svg')
  .attr('width', svg_w)
  .attr('height', svg_h)

let g = svg.append('g')
  .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')

// 比例尺
let scale_y = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([height, 0])

let scale_x = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([0, width])
  .padding(0.2)

console.log(scale_x.paddingInner());

let bar = g.selectAll('g')
  .data(data).enter().append('g')
  .attr('transform', function (d, i) {
    return 'translate(' + scale_x(i) + ',' +  height +')'
  })
  
bar.transition() // 过渡动画，其前面定义的状态为初始状态，后面的状态为结束状态，其他不变化的状态应该定义在其前面
  .duration(1000) // 持续时间
  .ease(d3.easeBounce) // 过渡函数
  .delay(function(d,i) {
    return 200 * i
  }) // 延迟时间
  .attr('transform', function (d, i) {
    return 'translate(' + scale_x(i) + ',' +  scale_y(d) +')'
  })

bar.append('rect')
  .attr('width', scale_x.bandwidth())
  .attr('height', 0)
  .style('fill', 'steelblue')
  .transition()
  .duration(1000)
  .ease(d3.easeBounce)
  .delay(function(d,i) {
    return 200 * i
  })
  .attr('height', function (d, i) { return height - scale_y(d) })

bar.append('text')
  .text(function (d) { return d })
  .attr('x', scale_x.bandwidth() / 2)
  .style('text-anchor', 'middle')
  .style('dominant-baseline', 'hanging')

// 坐标轴

let y_axis = d3.axisLeft(scale_y)
let x_axis = d3.axisBottom(scale_x)

g.append('g').call(y_axis)
g.append('g').call(x_axis)
  .attr('transform', 'translate(0,' + height + ')')

console.log(d3.range(49));
