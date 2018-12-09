;
var d3GraphUtil = {
  transform2Str: function(transform) {
    return 'translate(' + transform.x + ',' + transform.y + ') ' + 'scale(' + transform.k + ')'
  },
  measureText: function(text, fontSize) {
    if (!text || text.length === 0) return { height: 0, width: 0 };
    var container = d3.select('body').append('svg').attr('class', 'dummy');
    container.append('text')
      .attr('x', -1000)
      .attr('y', -1000)
      .attr('font-size', fontSize)
      .text(text);
    var bbox = container.node().getBBox();
    container.remove();
    return { height: bbox.height, width: bbox.width };
  }
}