// 要制作垂直的柱状图标，需要进行转换
// 将宽高进行互换
// 将比例尺的 range 最大最小值进行互换
// 将 y 轴平移变成 x 轴的平移

let data = [20, 50, 10, 30, 40],
  bar_width = 50,
  bar_padding = 10,
  svg_width = (bar_width + bar_padding) * data.length,
  svg_height = 500

// 定义线性比例尺

let scale = d3.scale.linear()
  .domain([0, d3.max(data)])
  .range([svg_height, 0]) // 最大最小的互换，来将浏览器的 y 轴变成数学中的 y 轴

// 创建 svg
let svg = d3.select('#container').append('svg')
  .attr('width', svg_width)
  .attr('height', svg_height)
  .style('background', 'grey')
// 使用 g 元素来包裹每一个柱形，与数据进行绑定
let bar = svg.selectAll('g')
  .data(data)
  .enter()
  .append('g')
  .attr('transform', function (d, i) {
    return 'translate(' + i * (bar_width + bar_padding) + ', 0)'
  })

// 添加实际的矩形，来表示每一个柱形
bar.append('rect')
  .attr({
    'width': bar_width,
    'height': function (d, i) {
      return svg_height - scale(d)
    },
    'y': function (d, i) {
      return scale(d)
    }
  }) // 同时添加多个属性的写法
  .style('fill', 'steelblue')

// 添加文字
bar.append('text')
  .text(function (d, i) {
    return d
  })
  .attr({
    'x': bar_width / 2,
    'y': function (d,i) {
      return scale(d)
    },
    'text-anchor': 'middle',
    'dominant-baseline': 'hanging'
  })