var nodes = [{
    name: 'destiny'
  },
  {
    name: 'haizhi'
  }
]

var edges = [{
    source: 'haizhi',
    target: 'destiny',
    label: "员工"
},
{
  source: 'haizhi',
  target: 'destiny',
  label: "员工"
  },
  {
    source: 'haizhi',
    target: 'destiny',
    label: "员工"
  },
  {
    source: 'haizhi',
    target: 'destiny',
    label: '工资：4200'
  },
  {
    source: 'destiny',
    target: 'haizhi',
    label: '前端工程师'
  },
  {
    source: 'destiny',
    target: 'destiny',
    label: '前端工程师'
  }
]

var width = 600,
  height = 600,
  r = 20,
  distance = 200

var setIndex = function () {
  var linkNumMap = {}
  var nodeNumMap = {}
  var linkDirection = {}

  edges.forEach(function (edge) {
    if (linkNumMap[edge.source + edge.target] === undefined) {
      linkNumMap[edge.source + edge.target] = linkNumMap[edge.target + edge.source] = 1
      // 记录边的起点，方便后面得到文字的方向
      linkDirection[edge.source + edge.target] = linkDirection[edge.target + edge.source] = edge.source
    } else {
      linkNumMap[edge.source + edge.target]++
      linkNumMap[edge.target + edge.source]++
    }

    // 每个顶点的出现次数
    nodeNumMap[edge.source] = nodeNumMap[edge.source] ? nodeNumMap[edge.source] + 1 : 1
    nodeNumMap[edge.target] = nodeNumMap[edge.target] ? nodeNumMap[edge.target] + 1 : 1

    // 在相同终点和起点的边中的索引，从 1 开始
    // 所以放到这里
    edge.linkIndex = linkNumMap[edge.source + edge.target]
  })
  edges.forEach(function (edge) {
    // 在每条边上记录与其相同终点和起点的边的数量
    edge.linkNum = linkNumMap[edge.source + edge.target]
    // 边上文字的方向
    edge.labelDirection = linkDirection[edge.source + edge.target] === edge.source ? 1 : 0
  })
  nodes.forEach(function (node) {
    // 记录顶点在边中出现的次数，专业称呼叫度，包含入度和出度
    node.degree = nodeNumMap[node.name]
  })
}
setIndex()

// 力数据转换
var force = d3.forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-2500))
  .force('link', d3.forceLink(edges).distance(distance).strength(1).id(function (d) {
    return d.name
  }))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide(1.5 * r))
  .force('x', d3.forceX())
  .force('y', d3.forceY())
  .on('tick', ticked)

var svg = d3.select('#container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

var chart = svg.append('g').attr('class', 'chart')

// 添加边
var g_edges = chart.selectAll('g.edges')
  .data(edges)
  .enter()
  .append('g')
  .attr('class', 'edges')

// 添加边
var chart_edges = g_edges.append('path')
  .attr('id', function (d, i) {
    return 'text_' + i
  })
  .attr('class', 'text_path')
  .attr('marker-end', 'url(#arrow)')
  .attr('fill', 'none')
  .style("stroke", "steelblue")
  .style("stroke-width", 1)
  

var edge_texts = g_edges.append("text")
  .append('textPath')
  .attr('xlink:href', function (d, i) {
    return '#text_' + i
  })
  .attr('startOffset', '50%')
  .attr('text-anchor', 'middle')
  // .attr('transform', 'translate(0, 5)')
  .text(function (d) {
    return d.label;
  })
  .style("fill", "#eee")

var color = d3.schemeCategory10

// 添加顶点分组，包含顶点和文字，在这里添加拖拽
var g_nodes = chart.selectAll('g.nodes')
  .data(nodes)
  .enter()
  .append('g')
  .attr('class', 'nodes')
  .attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')'
  }) // 让分组元素跟随顶点移动
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))

// 添加顶点
var chart_nodes = g_nodes.append("circle")
  .attr("r", r)
  .style("fill", function (d, i) {
    return color[i]
  })

//添加描述节点的文字
var node_texts = g_nodes.append("text")
  .text(function (d) {
    return d.name;
  })
  .style("fill", "black")
  .style('text-anchor', 'middle')
  .style('dominant-baseline', 'middle')


var defs = chart.append("defs")

// 定义箭头
//添加 marker 标签及其属性  
var arrowMarker = defs.append("marker")
  .attr("id", "arrow") // 供后面使用的 id 标识
  .attr("refX", r+10)
  .attr("refY", 6) // 指定 marker 中的哪个坐标与路径的开始坐标对齐
  .attr("markerUnits", "userSpaceOnUse")
  .attr("markerWidth", 12) // 箭头大小
  .attr("markerHeight", 12)
  .attr("orient", "auto") // 箭头方向
  .append("path") //绘制直线箭头路径 
  .attr("d", 'M2,2 L10,6 L2,10 L6,6 L2,2')
  .style('fill', 'steelblue') //箭头颜色

// 定义反向路径
defs.selectAll('path.text_path_reverse')
  .data(edges)
  .enter()
  .append('path')
  .attr('id', function (d, i) {
    return 'text_' + i + '_reverse'
  })
  .attr('class', 'text_path_reverse')


// d.fx 和 d.fy 表示固定坐标
// 拖拽开始的时候，让节点固定位置为当前节点位置
// 在拖动节点的时候，鼠标位置在哪里，节点的固定位置就在哪里，
// 结束拖动的时候触发，固定坐标都为空，也就是不固定，让其跟着仿真做衰减

function dragstarted(d) {
  if (!d3.event.active) force.alphaTarget(0.3).restart();
  // 设置衰减系数，重启仿真。数值越大，移动的越快
  d.fx = d.x;
  d.fy = d.y;
}


function dragended(d) {
  if (!d3.event.active) force.alphaTarget(0);
  // 阻止仿真继续计算位置
  d.fx = null;
  d.fy = null;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

// 缩放
svg.call(d3.zoom()
    .scaleExtent([0.05, 8]) // 缩放范围
    .on('zoom', () => {
      // 保存当前缩放的属性值
      chart.attr('transform', d3.event.transform);
    }))
  .on('dblclick.zoom', null); // 解除双击放大的事件

function ticked() {
  // 当源和目标位置被移动到交换相对（左右）位置时，将文字换到另一边。更改文字路径
  edge_texts.each(function (d, i, g) {
    // 通过旋转 label, 使文字始终处于 edge 上方
    if (d.source.x > d.target.x) {
      d3.select(g[i]).attr('xlink:href', '#text_' + i + '_reverse')
    } else {
      d3.select(g[i]).attr('xlink:href', '#text_' + i)
    }
  })

  chart.selectAll('.text_path').each(function (d, i, g) {
    var dx = d.target.x - d.source.x
    var dy = d.target.y - d.source.y

    var dr = d.linkNum > 1 ? Math.sqrt((dx * dx) + (dy * dy)) : 0
    var middleIdx = (d.linkNum + 1) / 2

    if (d.linkNum > 1) {
      dr = d.linkIndex === middleIdx ? 0 :
        dr / (Math.log((Math.abs(d.linkIndex - middleIdx) * 0.9) + 1) +
          (1 / (10 * Math.pow(d.linkNum, 2)))) // 秘制调参
    }
    var sweepFlag = d.linkIndex > middleIdx ? 1 : 0
    if (d.labelDirection) sweepFlag = 1 - sweepFlag
    var path = 'M' + d.source.x + ',' + d.source.y +
      'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + d.target.x + ',' + d.target.y

    // 自己指向自己
    if (d.source.name === d.target.name) {
      path = 'M' + d.source.x + ' ' + d.source.y + ' C ' + d.source.x + ' ' + (d.source.y - 150) + ', ' +
        (d.source.x + 150) + ' ' + d.source.y + ', ' + d.source.x + ' ' + d.source.y;
    }

    d3.select(g[i])
      .attr('d', path)

    // 增加一条反向的路径, 用于旋转 label
    d3.select('#text_' + i + '_reverse')
      .attr('d', 'M' + d.target.x + ',' + d.target.y +
        'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + d.source.x + ',' + d.source.y)
  })

  //更新顶点分组坐标
  g_nodes
    .attr("transform", function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
}