d3.csv('./data1.csv', type, function (data) {
  var width = 600,
    height = 600
  
  var svg = d3.select('#container')
    .append('svg')
    .attr({
      'width': width,
      'height': height
    })
  
  var g = svg.append('g')
    .attr('transform', 'translate(300,300)')
  
  // 通过 d3.svg.arc() 来生成扇形
  var arc_generator = d3.svg.arc()
    .innerRadius(100) // 内半径
    .outerRadius(200) // 外半径
    // .startAngle(0) // 起始角度
    // .endAngle(120 * Math.PI / 180) // 结束角度
  
  // 生成角度数据的函数，来代替arc_generator 中的 startendAngle 和 endAngle
  var angle_data = d3.layout.pie()
    .value(function (d) {
      return d.population
    })
  data = angle_data(data)
  // 生成的数据为一个数组
  // 每一项都是一个对象，包含
  // data: 原生数据
  // startAngle: 起始角度
  // endAngle: 结束角度
  // padAngle: 中间的过渡角度
  // value: value 函数返回的值
  
  // 生成颜色函数
  var color = d3.scale.category10()

  g.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', arc_generator)
    .style({
      'fill': function (d, i) {
        return color(i)
      },
      'stroke': 'none'
    })

  g.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(function (d) {
      return d.data.education
    })
    .attr('transform', function (d, i) {
      return 'translate(' + arc_generator.centroid(d) + ')'
    })
    .attr('text-anchor', 'middle')
})

function type(data) {
  data.populaton = + data.populaton
  return data
}