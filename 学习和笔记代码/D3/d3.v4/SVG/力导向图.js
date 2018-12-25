var nodes = [ //节点集
  {
    name: "湖南邵阳"
  },
  {
    name: "山东莱州"
  },
  {
    name: "广东阳江"
  },
  {
    name: "山东枣庄"
  },
  {
    name: "泽"
  },
  {
    name: "恒"
  },
  {
    name: "鑫"
  },
  {
    name: "明山"
  },
  {
    name: "班长"
  }
];

var edges = [ //边集
  {
    source: 0,
    target: 4,
    relation: "籍贯",
    value: 1.3
  },
  {
    source: 4,
    target: 5,
    relation: "舍友",
    value: 1
  },
  {
    source: 4,
    target: 6,
    relation: "舍友",
    value: 1
  },
  {
    source: 4,
    target: 7,
    relation: "舍友",
    value: 1
  },
  {
    source: 1,
    target: 6,
    relation: "籍贯",
    value: 2
  },
  {
    source: 2,
    target: 5,
    relation: "籍贯",
    value: 0.9
  },
  {
    source: 3,
    target: 7,
    relation: "籍贯",
    value: 1
  },
  {
    source: 5,
    target: 6,
    relation: "同学",
    value: 1.6
  },
  {
    source: 6,
    target: 7,
    relation: "朋友",
    value: 0.7
  },
  {
    source: 6,
    target: 8,
    relation: "职责",
    value: 2
  }
];

var width = 600,
  height = 600

// 力数据转换
var force = d3.forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-200))
  .force('link', d3.forceLink(edges).distance(function (d) { //每一边的长度
    return d.value * 150;
  }).strength(1))
  .force("center", d3.forceCenter(width / 2, height / 2))
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
var chart_edges = g_edges.append('line')
  .style("stroke", "steelblue")
  .style("stroke-width", 1)
  .attr('marker-end', 'url(#arrow)')

var edge_texts = g_edges.append("text")
  .append('textPath')
  .attr('xlink:href', function (d, i) {
    return '#text_' + i
  })
  .attr('startOffset', '50%')
  .attr('text-anchor', 'middle')
  .text(function (d) {
    return d.relation;
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
  .attr("r", 20)
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
  .attr("markerUnits", "strokeWidth")
  .attr("markerWidth", 12) // 箭头大小
  .attr("markerHeight", 12)
  .attr("viewBox", "0 0 12 12") // 坐标系的区域
  .attr("refX", 30) // 相对于直线路径的坐标位置
  .attr("refY", 6) // 中心由下面箭头的路径决定
  .attr("orient", "auto") // 箭头方向
  .append("path") //绘制直线箭头路径 
  .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
  .style('fill', 'red') //箭头颜色

// 定义文字正向路径
defs.selectAll('path.text_path')
  .data(edges)
  .enter()
  .append('path')
  .attr('id', function (d, i) {
    return 'text_' + i
  })
  .attr('class', 'text_path')
  .attr('d', function (d, i) {
    return 'M' + d.source.x + ' ' + d.source.y + ' L' + d.target.x + ' ' + d.target.y
  })

// 定义反向路径
defs.selectAll('path.text_path_reverse')
  .data(edges)
  .enter()
  .append('path')
  .attr('id', function (d, i) {
    return 'text_' + i + '_reverse'
  })
  .attr('class', 'text_path_reverse')
  .attr('d', function (d, i) {
    return 'M' + d.target.x + ' ' + d.target.y + ' L' + d.source.x + ' ' + d.source.y
  })


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
  //对于每一个时间间隔
  //更新连线坐标
  chart_edges
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    })

  // 更新边文字坐标
  // edge_texts
  //   .attr("x", function (d) {
  //     return (d.source.x + d.target.x) / 2;
  //   })
  //   .attr("y", function (d) {
  //     return (d.source.y + d.target.y) / 2;
  //   })

  // 当源和目标位置被移动到交换相对（左右）位置时，将文字换到另一边。更改文字路径
  edge_texts.each(function (d, i, g) {
    // 通过旋转 label, 使文字始终处于 edge 上方
    if (d.source.x > d.target.x) {
      d3.select(g[i]).attr('xlink:href', '#text_' + i + '_reverse')
    } else {
      d3.select(g[i]).attr('xlink:href', '#text_' + i)
    }
  })


  d3.selectAll('.text_path')
  .attr('d', function (d, i) {
    return 'M' + d.source.x + ' ' + d.source.y + ' L' + d.target.x + ' ' + d.target.y
  })

  d3.selectAll('.text_path_reverse')
  .attr('d', function (d, i) {
    return 'M' + d.target.x + ' ' + d.target.y + ' L' + d.source.x + ' ' + d.source.y 
  })

  //更新顶点分组坐标
  g_nodes
    .attr("transform", function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
}