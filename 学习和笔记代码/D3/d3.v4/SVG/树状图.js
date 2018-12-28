var treeData = {
  "name": "中国",
  "children": [
    {
      "name": "浙江",
      "children": [
        {
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
      "children": [
        {
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
      "children": [
        {
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
      "children": [
        {
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
  width: 650,
  height: 600,
  r: 5
}

function treeGraph(data, options) {
  options = options || _default
  this.treeData = data;
  this.width = options.width;
  this.height = options.height;
  this.r = options.r
}

treeGraph.prototype.initLayout = function () {
  this.svg = d3.select('#container')
    .append('svg')
    .attr('class', 'tree-graph')
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

treeGraph.prototype.preprocessData = function () {
  this.treeData = d3.hierarchy(this.treeData, function (d) { return d.children })
  // 转换为：
  // children: (4) [vo, vo, vo, vo] 节点的子节点
  // data: {name: "中国", children: Array(4)} 节点的原始数据
  // depth: 0 // 节点深度，根节点为 0
  // height: 3 // 节点的高度，叶子节点为 0
  // parent: null // 节点的父节点，根节点为 null
  var treeGenerator = d3.tree()
    .size([this.width-100, this.height-100]) // 树布局的尺寸
    // .nodeSize([1,1]) // 节点的尺寸
    .separation(function (a, b) {
      return a.parent == b.parent ? 1 : 2
    }) // 间隔访问器用来设置相邻的两个节点之间的间隔。指定的间隔访问器会传递两个节点 a 和 b，并且必须返回一个期望的间隔值。
  
  treeGenerator(this.treeData)
  // 增加坐标值
  // x: 0.5
  // y: 0

  this.nodes = this.treeData.descendants() // 获取所有的节点数组
  this.links = this.treeData.links() // 获取所有的相连边
  // 每条边包含 target 和 source 属性
  
  return this
}

treeGraph.prototype.renderGraph = function () {
  console.log(this.nodes);
  // 先画曲线，防止曲线覆盖节点
  d3.select('.links')
    .selectAll(".link")
    .data(this.links)
    .enter()
    .append("path")
    .attr('class', 'link')
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x))
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    // .attr("stroke-width", 1.5)
  
  // 画节点
  d3.select('.nodes')
    .selectAll('.node')
    .data(this.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')' 
    })
    .append('circle')
    .attr('r', this.r)
    .style('stroke-width', '1')
    .style('stroke', 'steelblue')
    .style('fill', 'white') // 要有颜色，否则会把线条显示出来
  
  d3.selectAll('.node')
    .append('text')
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .text(d => d.data.name)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .attr("fill", "white")
}

treeGraph.prototype.init = function () {
  this.initLayout()
  .preprocessData()
  .renderGraph()
}

var tree = new treeGraph(treeData, _default)

tree.init()