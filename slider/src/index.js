import React from 'react';
import { render } from 'react-dom';

// 组件
import Slider from './Slider'

// 样式
import './index.less'

import a from './img/wallhaven1.jpg';
import b from './img/wallhaven2.jpg';
import c from './img/wallhaven3.jpg';
import d from './img/wallhaven4.jpg';
import e from './img/wallhaven5.jpg';

let items = [
  { src: a },
  { src: b },
  { src: c },
  { src: d },
  { src: e }
]

// 在渲染 slider 时，提供一些必要的参数
// delay、speed、autoplay、dots、arrows
render(<Slider
  delay={2}
  speed={0.5}
  autoplay={true}
  dots={true}
  arrows={true}
  items={items}
/>, document.getElementById('root'));
