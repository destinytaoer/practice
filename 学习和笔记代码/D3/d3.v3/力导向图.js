var nodes = [{
    name: "桂林"
  }, {
    name: "广州"
  },
  {
    name: "厦门"
  }, {
    name: "杭州"
  },
  {
    name: "上海"
  }, {
    name: "青岛"
  },
  {
    name: "天津"
  }
];

var edges = [{
    source: 0,
    target: 1
  }, {
    source: 0,
    target: 2
  },
  {
    source: 0,
    target: 3
  }, {
    source: 1,
    target: 4
  },
  {
    source: 1,
    target: 5
  }, {
    source: 1,
    target: 6
  }
];
var width = 600,
  height = 600;

var svg = d3.select('#container')
  .append('svg')
  .attr({
    'width': width,
    'height': height
  })

// layout
var force = d3.layout.force()
  .nodes(nodes) // 顶点数组
  .links(edges) // 边数组
  .size([width, height]) // 作用域范围
  .linkDistance(150) // 连线的长度
  .charge([-400]); // 相互之间的作用力

  console.log(nodes, edges);
  

// 使力学生效
force.start()

// nodes 转换后
//  index：节点的索引号
//  px, py：节点的上一时刻的坐标
//  x, y：节点的当前坐标
//  weight：节点的权重

// edges 转换后
//  source: nodes
//  target: nodes

// 开始作图

// 添加节点
var color = d3.scale.category20()
var svg_nodes = svg.selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('r', 20)
  .style('fill', function (d, i) {
    return color(i)
  })
  .call(force.drag) // 添加拖拽

// 添加连线
var svg_edges = svg.selectAll('line')
  .data(edges)
  .enter()
  .append('line')
  .style({
    'stroke': '#ccc',
    'stroke-width': 1
  })

var svg_text = svg.selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  .text(function (d) {
    return d.name
  })
  .attr({
    'dx': 20,
    'dy': 8
  })
  .style('fill', 'black')

force.on('tick', function () {
  svg_nodes.attr({
    'cx': function (d) {
      return d.x
    },
    'cy': function (d) {
      return d.y
    }
  })
  svg_edges.attr({
    'x1': function (d) {
      return d.source.x
    },
    'y1': function (d) {
      return d.source.y
    },
    'x2': function (d) {
      return d.target.x
    },
    'y2': function (d) {
      return d.target.y
    }
  })
  svg_text.attr({
    'x': function (d) {
      return d.x
    },
    'y': function (d) {
      return d.y
    }
  })
})
