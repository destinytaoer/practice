; // 基于 d3.v4 实现的 JQ 插件
(function ($) {
  // 定义默认值
  var _default = {
    r: 20,
    width: 716,
    height: 418,
    distance: 250
  }

  // 封装成一个类，方便复用即维护
  var Force = function (ele, options) {
    // 将传入的 svg 容器、相关配置 挂载到实例上
    this.options = options;
    this.ele = ele;
    this.$svg = $(ele); // 转换为 JQ 元素，方便以后使用 JQ 中的方法

    // 移除 svg 容器中可能存在的 svg 元素？
    d3.select(ele).selectAll('svg').remove();

    this.svg = d3.select(ele); // 转换为 d3 的 selection

    // 获取 svg 元素的宽高，并挂载到实例上
    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");

    // 建立一个分组，基于这个分组元素画图
    this.chart = this.svg.append('g')
      .attr('width', this.width)
      .attr('height', this.height)
      .classed('force', true); // 增加类名

    // 挂载所需数据
    this.vertexes = options.data.vertexes;
    this.edges = options.data.edges;
    // 定义边类型
    this.edgeTypes = ['invest', 'officer', 'guarantee', 'guarantee_circle'];
  }

  // 初始化图表结构
  // { g: { g.chart-layer: [ g.links, g.nodes ] } }
  Force.prototype.initChartLayers = function () {
    this.chart.append('g')
      .attr('class', 'chart-layer')
      .append('g')
      .attr('class', 'links')
    this.chart.select('.chart-layer')
      .append('g')
      .attr('class', 'nodes')
    this.chart.append('defs')

    return this
  }

  // 预处理数据，将数据转化为 d3.forceSimulation 可以处理的数据
  Force.prototype.preprocessData = function () {
    this.edges.forEach(function (e) {
      // e.source = e._from
      // e.target = e._to

      // 边需要 target 和 source 两个必须的字段
      e.source = e._to
      e.target = e._from

      // 其他数据的处理
      e._type = e._type || (e._id.indexOf('/') > -1 && e._id.split('/')[0].toLowerCase())
    })

    // 顶点数据的处理
    this.vertexes.forEach(function (v) {
      v._type = v._type || (v._id.indexOf('/') > -1 && v._id.split('/')[0].toLowerCase())
    })

    this.setIndex()

    return this // 实现链式调用
  }

  /**
   * 计算起点和终点相同边的条数，并加到 link 属性里
   * 计算每个点的度，并加到 vertex 的 degree 属性中
   * @return {Object} this this
   */
  Force.prototype.setIndex = function () {
    var linkNumMap = {}
    var nodeNumMap = {}
    var linkDirection = {}

    this.edges.forEach(function (edge) {
      if (linkNumMap[edge._from + edge._to] === undefined) {
        linkNumMap[edge._from + edge._to] = linkNumMap[edge._to + edge._from] = 1
        // 记录边的起点，方便后面得到文字的方向
        linkDirection[edge._from + edge._to] = linkDirection[edge._to + edge._from] = edge._from
      } else {
        linkNumMap[edge._from + edge._to]++
        linkNumMap[edge._to + edge._from]++
      }

      // 每个顶点的出现次数
      nodeNumMap[edge._from] = nodeNumMap[edge._from] ? nodeNumMap[edge._from] + 1 : 1
      nodeNumMap[edge._to] = nodeNumMap[edge._to] ? nodeNumMap[edge._to] + 1 : 1

      // 在相同终点和起点的边中的索引，从 1 开始
      // 所以放到这里
      edge.linkIndex = linkNumMap[edge._from + edge._to]
    })
    this.edges.forEach(function (edge) {
      // 在每条边上记录与其相同终点和起点的边的数量
      edge.linkNum = linkNumMap[edge._from + edge._to]
      // 边上文字的方向
      edge.labelDirection = linkDirection[edge._from + edge._to] === edge._from ? 1 : 0
    })
    this.vertexes.forEach(function (vertex) {
      // 记录顶点在边中出现的次数，专业称呼叫度，包含入度和出度
      vertex.degree = nodeNumMap[vertex._id]
    })

    return this
  }

  // 画图
  Force.prototype.render = function () {
    /**
     * 定义箭头
     * @param {Object} chart 要添加进的 chart
     * @param {String} id 箭头 id
     * @param {Number} refX refX 位置
     * @param {String} pathDescr path d 元素
     * @param {String} className 箭头 class
     */
    function defineArrow(chart, id, refX, pathDescr, className) {
      className = className || '';
      chart.select('defs')
        .append('marker')
        .attr('id', id)
        .attr('class', 'arrow-marker ' + className)
        .attr('refX', -refX + 10)
        .attr('refY', 5)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('orient', 'auto')
        .style('fill', function (d) {
          return id == 'arrow' ? '' : d3GraphUtil.graphColorConfig[id.split('arrow_')[1]]
        })
        .append('path')
        .attr('d', pathDescr)
        .attr("fill", '#e3e3e3')
    }

    // define arrow
    this.edgeTypes.forEach(function (e) {
      //M0,0 L10,5 L0,10 L2,5 z
      // M10,0 L2,5 L10,10 L8,5 z
      defineArrow(_this.chart, 'arrow_' + e, _this.options.r + 9, 'M10,0 L2,5 L10,10 L8,5 z', e)
    })
    defineArrow(this.chart, 'arrow', this.options.r + 9, 'M10,0 L2,5 L10,10 L8,5 z')

    /** 动态调整位置 */
    function tickActions() {
      // 移动 vertex 位置
      _this.chart.selectAll('g.node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

      // 调整label和边的距离，为啥要调整？
      _this.chart.selectAll('g .link-name').each(function (d, i, g) {
        // 勾股定理计算出线长度
        var r = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2))

        // 垂直距离小于长度的一半时，拉开 5 px？以 45 度基准来理解
        if (Math.abs(d.source.y - d.target.y) < r / 2) {
          d3.select(g[i]).attr('transform', 'translate(0, -5)')
        }
        // 源在右下，目标在左上，往源方向移动 5 px
        else if ((d.source.x > d.target.x && d.source.y > d.target.y) ||
          (d.source.x < d.target.x && d.source.y < d.target.y)) {
          d3.select(g[i]).attr('transform', 'translate(5, 0)')
        }
        // 源在右上，目标在左下，往目标方向移动 5 px
        else if ((d.source.x > d.target.x && d.source.y < d.target.y) ||
          (d.source.x < d.target.x && d.source.y > d.target.y)) {
          d3.select(g[i]).attr('transform', 'translate(-5, 0)')
        }
      })

      // 当源和目标位置被移动到交换相对（左右）位置时，将文字换到另一边。更改文字路径
      _this.chart.selectAll('g .link-name textPath').each(function (d, i, g) {
        // 通过旋转 label, 使文字始终处于 edge 上方
        if (d.source.x > d.target.x) {
          d3.select(g[i]).attr('xlink:href', function (d) {
            return '#' + d._id.replace('/', '_') + _this.ele.id + '_reverse'
          })
        } else {
          d3.select(g[i]).attr('xlink:href', function (d) {
            return '#' + d._id + _this.ele.id
          })
        }
      })

      // IE bug, marker-start 不能动态更新, 所以每次更新位置时都去除 path 再增加上 (note: 会有性能问题)
      if (window.ActiveXObject || /Trident\/7\./.test(navigator.userAgent)) {
        linkEnter.selectAll('path').remove()
        edge = linkEnter.append('path')
          .attr('class', 'link edge-path')
          .attr('linkIndex', function (d) {
            return d.linkIndex
          })
          .attr('linkMap', function (d) {
            return d.linkNum
          })
          .attr('marker-start', function (d) {
            return _this.edgeTypes.indexOf(d._type) > -1 ? 'url(#arrow_' + d._type + ')' : 'url(#arrow)'
          })
      }

      // 计算 edge 的 path, 多条路径时计算弧度
      _this.chart.selectAll('.edge-path').each(function (d, i, g) {
        var dx = d.target.x - d.source.x
        var dy = d.target.y - d.source.y

        var dr = d.linkNum > 1 ? Math.sqrt((dx * dx) + (dy * dy)) : 0
        var middleIdx = (d.linkNum + 1) / 2

        if (d.linkNum > 1) {
          dr = d.linkIndex === middleIdx ? 0 :
            dr / (Math.log((Math.abs(d.linkIndex - middleIdx) * 0.6) + 1) +
              (1 / (10 * Math.pow(d.linkNum, 2)))) // 秘制调参
        }
        var sweepFlag = d.linkIndex > middleIdx ? 1 : 0
        if (d.labelDirection) sweepFlag = 1 - sweepFlag
        var path = 'M' + d.source.x + ',' + d.source.y +
          'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + d.target.x + ',' + d.target.y

        // 自己指向自己
        if (d._from === d._to) {
          path = 'M' + d.source.x + ' ' + d.source.y + ' C ' + d.source.x + ' ' + (d.source.y - 150) + ', ' +
            (d.source.x + 150) + ' ' + d.source.y + ', ' + d.source.x + ' ' + d.source.y;
        }

        d3.select(g[i])
          .attr('d', path)
          .attr('id', d._id + _this.ele.id)
        // 增加一条反向的路径, 用于旋转 label
        d3.select('#' + d._id.replace('/', '_') + _this.ele.id + '_reverse')
          .attr('d', 'M' + d.target.x + ',' + d.target.y +
            'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + d.source.x + ',' + d.source.y)
      })
    }

    /**
     * 对节点名称进行格式化
     * @param {Object} text text selection object
     */
    function textWrap(text) {
      text.each(function (d, idx, g) {
        var thisText = d3.select(g[idx])
        var len = 16
        var textStack = []
        var name = d.name || d.case_id || ''
        if (d._type === 'Family_id') {
          name = '互为亲属'
        }
        var y = parseFloat(thisText.attr('y'))
        var lineHeight = 20
        var i = 0

        // 16 个字为一组进行换行
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            dx: 0,
            dy: (i++ * lineHeight) + y
          })
          name = name.slice(len)
        }
        textStack.push({
          name: name.slice(0),
          dx: 0,
          dy: (i++ * lineHeight) + y
        })

        // 为 text 元素添加 tspan 元素，一行一个 tspan
        textStack.forEach(function (v) {
          thisText.append('tspan').text(v.name).attr('y', v.dy)
            .attr('x', v.dx)
            .attr('class', v.risk ? 'risk-status' : '')
        })
      })
    }

    /**
     * 设置节点 icon
     * @param {Object} d vertex
     * @return {Object} svg image file
     */
    function setNodeIcon(d) {
      var type = d._type || d.entity_type || (d._id.includes('/') && d._id.split('/')[0]) || 'Company'

      return '/static/imgs/static/' + type + '.svg'
    }

    var _this = this

    // setup
    var linkForce = d3.forceLink(this.edges)
      .distance(this.options.distance)
      .id(function (d) {
        return d._id
      })

    this.simulation = d3.forceSimulation()
      .alphaDecay(0.07)
      .nodes(this.vertexes)
      .force('links', linkForce)
      .force('charge_force', d3.forceManyBody().strength(-2500))
      .force('center_force', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force('collision', d3.forceCollide(1.5 * this.options.r))
      .on('tick', tickActions)

    // add vertexes
    var nodeEnter = this.chart.select('.nodes').selectAll('g')
      .data(this.vertexes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('node-type', function (d) {
        return d._type
      })

    nodeEnter.append('circle')
      .attr('r', this.options.r)
      .attr('class', 'circle')
      .attr('data-id', function (d) {
        return d._id;
      })

    nodeEnter.append('text')
      .attr('class', 'node-name')
      .attr('y', '35')
      .style('text-anchor', 'middle')

    nodeEnter.selectAll('.node-name')
      .call(textWrap)

    nodeEnter.append('g')
      .attr('class', 'tags')
      .each(function (d, i, g) {
        var g = d3.select(g[i]);
        var node = d3.select(g.node().parentNode);
        var text = node.select('.node-name');
        var w = 10; // 标签宽度
        var tagCnt = 0;
        var is_abnormal = ['吊销', '注销', '清算', '停业', '撤销'].some(function (tag) {
          return d.business_status && d.business_status.indexOf(tag) > -1;
        })
        if (d.is_belong === true || d.is_belong === 'true') {
          tagCnt++;
          appendTag('belong', '#98CB6A', tagCnt);
        }
        if (d.is_listed === true || d.is_listed === 'true') {
          tagCnt++;
          appendTag('listed', '#5f8def', tagCnt);
        }
        if (is_abnormal) {
          tagCnt++;
          appendTag('abnormal', '#f00', tagCnt);
        }
        if (d.is_blacklist === true || d.is_blacklist === 'true') {
          tagCnt++;
          appendTag('blacklist', '#000', tagCnt);
        }
        if (d.is_greylist === true || d.is_greylist === 'true') {
          tagCnt++;
          appendTag('greylist', '#bdbdbd', tagCnt);
        }

        g.selectAll('rect')
          .attr('width', w)
          .attr('height', w)
        g.selectAll('.blacklist').append('title').append('tspan').text(function (d) {
          if (d.blacklist_cause) {
            return d.blacklist_cause
          } else {
            return ''
          }
        })

        var nodeBBox = node.node().getBBox();
        var xShift = nodeBBox.width / 2 + g.node().getBBox().width + 5
        var yShift = nodeBBox.height - _this.options.r - text.node().getBBox().height + 2
        g.attr('transform', 'translate(' + (-xShift) + ',' + yShift + ')')

        function appendTag(type, color, tagCnt) {
          g.append('rect').classed(type, true).attr('fill', color)
            .attr('transform', 'translate(' + (tagCnt - 1) * w + ',0)');
        }
      })

    // add edges
    var linkEnter = this.chart.select('.links').selectAll('g')
      .data(this.edges)
      .enter()
      .append('g')
      .attr('class', function (d) {
        return d._type
      })

    var edge = linkEnter.append('path')
      .attr('class', function (d) {
        return 'link ' + d._type
      })
      .classed('edge-path', true)
      .attr('linkIndex', function (d) {
        return d.linkIndex
      })
      .attr('linkMap', function (d) {
        return d.linkNum
      })
      .attr('marker-start', function (d) {
        if (d.path_type === 'guarantee_circle') {
          return 'url(#arrow_guarantee_circle)'
        } else {
          return _this.edgeTypes.indexOf(d._type) > -1 ? 'url(#arrow_' + d._type + ')' : 'url(#arrow)'
        }
      })
      .attr("style", function (d) {
        if (d.path_type === 'guarantee_circle') {
          return 'stroke: ' + d3GraphUtil.graphColorConfig['guarantee_circle']
        } else {
          return 'stroke: ' + d3GraphUtil.graphColorConfig[d._id.split('/')[0]] || ''
        }
      })

    // 增加反向路径, 用于旋转 label
    this.chart.select('defs').selectAll('.reverse-path')
      .data(this.edges)
      .enter()
      .append('path')
      .attr('id', function (d) {
        return d._id.replace('/', '_') + _this.ele.id + '_reverse'
      })

    // add edge text
    linkEnter.append('text')
      .attr('class', function (d) {
        return 'link-name ' + (d._id.split('/') && d._id.split('/')[0].toLowerCase())
      })
      .attr("style", function (d) {
        if (d.path_type === 'guarantee_circle') {
          return 'fill: ' + d3GraphUtil.graphColorConfig['guarantee_circle']
        } else {
          return 'fill: ' + d3GraphUtil.graphColorConfig[d._id.split('/')[0]] || ''
        }
      })
      .append('textPath')
      .attr('xlink:href', function (d) {
        return '#' + d._id + _this.ele.id
      })
      .attr('startOffset', '50%')
      .text(function (d) {
        return d.label
      })

    return this
  }

  // 绑定事件：拖拽、缩放
  Force.prototype.bind = function () {
    var _this = this

    /**
     * dragStart 开始拖拽
     * @param  {Object} d vertex
     */
    function dragStart(d) {
      if (!d3.event.active) _this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    /**
     * 拖动
     * @param {Object} d vertex
     */
    function drag(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    /**
     * 结束拖动
     * @param {Object} d vertex
     */
    function dragEnd(d) {
      if (!d3.event.active) _this.simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // 拖拽配置
    var dragHandler = d3.drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd)

    dragHandler(this.chart.selectAll('.node'))

    /** 缩放 */
    function zoom() {
      d3.select('g.chart-layer').attr('transform', d3GraphUtil.transform2Str(d3.event.transform))
    }

    // 注册缩放事件
    this.zoomListener = d3.zoom().scaleExtent([0.1, 5]).on('zoom', zoom)
    // 缩放配置
    this.svg.call(this.zoomListener)

    // 初始不平移也不缩放
    var t = d3.zoomIdentity.translate(0, 0).scale(1)
    // 为选择器指定其 transform
    this.svg.call(this.zoomListener.transform, t)

    // 绑定 JQ 自定义事件来改变位置
    this.$svg.on('init-graph-position', function (e, config) {
      _this.initPosition(config);
    })

    return this
  }

  // 初始化位置
  Force.prototype.initPosition = function (config) {
    config = $.extend({}, {
      x: 0,
      y: 0,
      scale: 1
    }, config)
    var t = d3.zoomIdentity.translate(config.x, config.y).scale(config.scale);
    this.svg.call(this.zoomListener.transform, t);

    return this;
  }

  // 整个图的初始化，整理方法的执行逻辑顺序
  Force.prototype.init = function () {
    this.preprocessData()
      .initChartLayers()
      .render()
      .bind()
  }

  // 挂载到 JQ 的 prototype 中
  $.fn.forceGraph = function (options) {
    // 合并默认配置与传入的配置
    options = $.extend({}, _default, options)
    if (!options.data || !(options.data.vertexes || options.data.edges)) return
    var force = new Force(this[0], options)
    force.init();
  }
})(jQuery)