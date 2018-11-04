import React, { Component } from 'react'
import SliderList from "./SliderList";
import SliderArrows from './SliderArrows';
import SliderDots from './SliderDots';

export default class Slider extends Component {
  constructor() {
    super();
    this.state = {
      index: 0 // 表示当前是第几张
    }
  }
  go = (step) => {
    let index = this.state.index + step;
    // 越界判断
    if (index > this.props.items.length) {
      // 清除动画
      this.$ul.style.transitionDuration = '';
      // 回到第一张
      this.$ul.style.left = 0;
      setTimeout(() => {
        // 等动画移除后，并且回到了 0 点，再增加动画时间
        this.$ul.style.transitionDuration = this.props.speed + 's';
        index = 1;
        this.setState({
          index
        })
      }, 30);
      return; // 因为设置了 setTimeout，所以要等到 setTimeout 之后再设置最新状态 
    }
    if (index < 0) {
      // 清除动画
      this.$ul.style.transitionDuration = '';
      // 回到第一张
      this.$ul.style.left = this.props.items.length * -500 + 'px';
      setTimeout(() => {
        // 等动画移除后，并且回到了 0 点，再增加动画时间
        this.$ul.style.transitionDuration = this.props.speed + 's';
        index = this.props.items.length - 1;
        this.setState({
          index
        })
      }, 30);
      return;
    }
    this.setState({
      index
    });
  }
  turn = () => {
    this.timer = setInterval(() => {
      this.go(1);
    }, this.props.delay * 1000);
  }
  // 页面加载完毕之后，判断是否自动播放
  componentDidMount() {
    if (this.props.autoplay) {
      this.turn();
    }
    // 获取子组件中的元素
    this.$ul = this.refs.list.refs.ul;
  }
  render() {
    return (
      <div className="slider-container"
        onMouseEnter={() => {
          clearInterval(this.timer);
        }}
        onMouseLeave={() => {
          this.turn();
        }}>
        <SliderList
          ref="list"
          index={this.state.index}
          {...this.props}>
        </SliderList>
        {this.props.arrows ? <SliderArrows go={this.go}></SliderArrows> : null}
        {this.props.dots ? <SliderDots items={this.props.items} index={this.state.index} go={this.go}></SliderDots> : null}
      </div>
    )
  }
}
