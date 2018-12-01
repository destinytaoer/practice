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
  height = 600

// 力数据转换
let force = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(edges).distance(200))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))


let svg = d3.select('#container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

let chart = svg.append('g')

let chart_edges = chart.append('g').selectAll('line')
  .data(edges)
  .enter()
  .append('line')
  .style("stroke", "steelblue")
  .style("stroke-width", 1)

let color = d3.schemeCategory10

let chart_nodes = chart.append('g').selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 20)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))
  .style("fill", function (d, i) {
    return color[i]
  })

function dragstarted(d) {
  // if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragended(d) {
  // if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

//添加描述节点的文字
let chart_texts = chart.append('g').selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .text(function (d) {
    return d.name;
  })
  .style("fill", "black")
  .style('text-anchor', 'middle')
  .style('dominant-baseline', 'middle')


force.on("tick", function () { //对于每一个时间间隔
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

  //更新节点坐标
  chart_nodes
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });

  //更新文字坐标
  chart_texts
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    });
});