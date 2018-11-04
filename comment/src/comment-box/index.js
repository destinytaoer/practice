// 这个文件用于整合文件，只需要进行渲染
import React from 'react'
import { render } from 'react-dom'
import MessageBox from './MessageBox'

// 引入样式
// import 'bootstrap/dist/css/bootstrap.css'

// 根组件，包含所有子组件，我们只需要将它渲染即可
render(<MessageBox></MessageBox>, window.root);