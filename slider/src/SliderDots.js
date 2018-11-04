import React, { Component } from 'react'

export default class SliderDots extends Component {
  render() {
    return (
      <div className="slider-dots">
        {this.props.items.map((item, index) => (
          <span key={index} className={(this.props.index === index) || (this.props.index === this.props.items.length && index===0) ? 'active' : ''} onClick={() => {
            this.props.go(index - this.props.index)
          }}></span>
        ))}
      </div>
    )
  }
}
