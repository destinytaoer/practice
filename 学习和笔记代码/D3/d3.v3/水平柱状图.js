let data = [20, 50, 10, 30, 40],
  bar_height = 50,
  bar_padding = 10,
  svg_height = (bar_height + bar_padding) * data.length,
  svg_width = 500

// 定义线性比例尺

let scale = d3.scale.linear()
  .domain([0, d3.max(data)])
  .range([0, svg_width])

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
    return 'translate(0,' + i * (bar_height + bar_padding) + ')'
  })

// 添加实际的矩形，来表示每一个柱形
bar.append('rect')
  .attr({
    'width': function (d, i) {
      return scale(d)
    },
    'height': bar_height
  }) // 同时添加多个属性的写法
  .style('fill', 'steelblue')

// 添加文字
bar.append('text')
  .text(function (d, i) {
    return d
  })
  .attr({
    'x': function (d) {
      return scale(d)
    },
    // 'y': bar_height / 2, // 让文字在柱形中间，实际上应该是再加上文字高度的一半
    'text-anchor': 'end', // 文字对齐属性，使得文字出现在基线的左边
   'dominant-baseline': 'middle' // 文本垂直居中
  })
// text-anchor: start（右） middle end（左）
// dominant-baseline: baseline（上） middle hanging（下）
// 三种状态相对应，都是相当于文本的水平或垂直基线来定位
