var data = [30, 10, 43, 55, 13],
  width = 600,
  height = 600

let svg = d3.select('#container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

let chart = svg.append('g')
  .attr('transform', 'translate(' + width/2 + ','+ height/2 +')')

// 扇形生成器
let arc_generator = d3.arc()
  .innerRadius(100)
  .outerRadius(200)

// 转换为 pie 适用的数据
let _pie = d3.pie()
data = _pie(data)

let color = d3.schemeCategory10

chart.selectAll('path')
  .data(data)
  .enter()
  .append('path')
  .attr('d', arc_generator)
  .style('fill', function (d, i) {
    return color[i]
  })
  .style('stroke', 'none')