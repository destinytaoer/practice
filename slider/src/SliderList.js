import React, { Component } from 'react'

export default class SliderList extends Component {
  render() {
    let style = {
      width: (this.props.items.length+1) * 500 + 'px', // 根据图片数量设置 ul 宽度
      left: this.props.index * -500 + 'px', // 根据 index 设置 left 值
      transition: `left ${this.props.speed}s linear`
    }

    return (
      <ul style={style} ref="ul">
        {this.props.items.map((item, index) => (
          <li key={index}>
            <img src={item.src} alt="" />
          </li>
        ))}
        {/* 实现无缝轮播，需要增加一张图 */}
        <li><img src={this.props.items[0].src} alt=""/></li>
      </ul>
    )
  }
}
