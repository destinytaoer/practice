import React, { Component } from 'react'

export default class SliderArrows extends Component {
  render() {
    return (
      <div className="slider-arrows">
        <span onClick={() => {
          this.props.go(-1)
        }}>&lt;</span>
        <span onClick={() => {
          this.props.go(1)
        }}>&gt;</span>
      </div>
    )
  }
}
