import React, { Component } from 'react'
import MessageList from './MessageList';
import MessageForm from './MessageForm';

export default class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      messages: [{id:1, content: 'adsf', author: 'aa', createAt: Date.now()}]
    }
  }
  // 子组件调用
  addMessage = (message) => {
    let messageItem = {
      ...message,
      id: Math.random(),
      createAt: Date.now()
    };
    // 使用这种形式不会更新页面（官方不提倡的修改方式），所以后面需要进行 setState，而且不会改变原有数组的地址，在 PureComponent 中就完全不会更新
    // this.state.messages.push(messageItem);

    // 一般使用这种方式来修改，使用
    let messages = [...this.state.messages, messageItem];
    this.setState({
      messages
    });
    localStorage.setItem('messages', JSON.stringify(messages));
  }
  delMessage = (id) => {
    let messages = this.state.messages.filter(item => item.id !== id);
    this.setState({
      messages
    });
    localStorage.setItem('messages', JSON.stringify(messages));
  }
  componentWillMount() {
    // 取 localStorage 的值时，取到后放到状态中，再进行 render 执行一次，与初始的 state 合并，此时 setState 是同步的操作
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    this.setState({ messages });
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="panel panel-danger">
              <div className="panel-heading">
                <h1 className="text-center h2">留言板</h1>
              </div>
              <div className="panel-body">
                {this.state.messages.length === 0 ? (<span className="text-center" style={{display: 'block', width: '100%'}}>暂无留言</span>) :(<MessageList
                  messages={this.state.messages}
                  delMessage={this.delMessage}
                ></MessageList>)}
              </div>
              <div className="panel-footer">
                <MessageForm addMessage={this.addMessage}></MessageForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
