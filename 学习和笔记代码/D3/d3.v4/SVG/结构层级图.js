var treeData = {
  "name": "中国",
  "children": [{
      "name": "浙江",
      "children": [{
          "name": "杭州"
        },
        {
          "name": "宁波"
        },
        {
          "name": "温州"
        },
        {
          "name": "绍兴"
        }
      ]
    },

    {
      "name": "广西",
      "children": [{
          "name": "桂林",
          "children": [{
              "name": "秀峰区"
            },
            {
              "name": "叠彩区"
            },
            {
              "name": "象山区"
            },
            {
              "name": "七星区"
            }
          ]
        },
        {
          "name": "南宁"
        },
        {
          "name": "柳州"
        },
        {
          "name": "防城港"
        }
      ]
    },

    {
      "name": "黑龙江",
      "children": [{
          "name": "哈尔滨"
        },
        {
          "name": "齐齐哈尔"
        },
        {
          "name": "牡丹江"
        },
        {
          "name": "大庆"
        }
      ]
    },

    {
      "name": "新疆",
      "children": [{
          "name": "乌鲁木齐"
        },
        {
          "name": "克拉玛依"
        },
        {
          "name": "吐鲁番"
        },
        {
          "name": "哈密"
        }
      ]
    }
  ]
}

var _default = {
  width: 900,
  height: 500,
  boxWidth: 50,
  boxHeight: 30
}

function structureGraph(data, options) {
  options = options || _default
  this.data = data
  this.width = options.width
  this.height = options.height
  this.boxWidth = options.boxWidth
  this.boxHeight = options.boxHeight
}

structureGraph.prototype.initLayout = function () {
  this.svg = d3.select('#container')
    .append('svg')
    .attr('class', 'structure-graph')
    .attr('width', this.width)
    .attr('height', this.height)

  this.chart = this.svg.append('g')
    .attr('class', 'chart-layer')
    .attr('transform', 'translate(50,30)')

  this.chart.append('g')
    .attr('class', 'links')

  this.chart.append('g')
    .attr('class', 'nodes')

  return this
}

structureGraph.prototype.preprocessData = function () {
  this.data = d3.hierarchy(this.data, function (d) {
    return d.children
  })
  var structureGenerator = d3.tree()
    .size([this.width - 100, this.height - 100]) // 树布局的尺寸
    // .nodeSize([1,1]) // 节点的尺寸
    .separation(function (a, b) {
      return a.parent == b.parent ? 1 : 1
    }) // 间隔访问器用来设置相邻的两个节点之间的间隔。指定的间隔访问器会传递两个节点 a 和 b，并且必须返回一个期望的间隔值。

  structureGenerator(this.data)
  // 增加坐标值
  // x: 0.5
  // y: 0

  this.nodes = this.data.descendants() // 获取所有的节点数组
  this.links = this.data.links() // 获取所有的相连边
  // 每条边包含 target 和 source 属性

  return this
}

structureGraph.prototype.renderGraph = function () {
  var _this = this
  // 先画曲线，防止曲线覆盖节点
  d3.select('.links')
    .selectAll(".link")
    .data(this.links)
    .enter()
    .append("path")
    .attr('class', 'link')
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-width", 1)
    .attr("d", linkGenerator)

  
  function linkGenerator(d) {
    let sourceX = d.source.x,
      sourceY = d.source.y,
      targetX = d.target.x,
      targetY = d.target.y;

    return "M" + sourceX + "," + sourceY +
      "V" + ((targetY - sourceY) / 2 + sourceY) +
      "H" + targetX +
      "V" + targetY;

  }

  // 画节点
  d3.select('.nodes')
    .selectAll('.node')
    .data(this.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    .append('rect')
    .attr('width', this.boxWidth)
    .attr('height', this.boxHeight)
    .attr('transform', 'translate('+ (-this.boxWidth/2) +','+ (-this.boxHeight/2) +')') // 矩形左上角与标准位置对齐，所以要移到中心
    .style('stroke-width', '1')
    .style('stroke', 'steelblue')
    .style('fill', 'white') // 要有颜色，否则会把线条显示出来

  d3.selectAll('.node')
    .append('text')
    .text(d => d.data.name)
    // .attr("dy", "0.31em")
    // .attr("x", d => d.children ? -6 : 6)
    .style('text-anchor', 'middle') // 文字的水平居中
    .style('dominant-baseline', 'middle') // 文字的垂直居中
    .attr("fill", "black")
}

structureGraph.prototype.init = function () {
  this.initLayout()
    .preprocessData()
    .renderGraph()
}

var struct = new structureGraph(treeData)

struct.init()