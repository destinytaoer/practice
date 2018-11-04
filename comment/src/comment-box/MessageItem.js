import React, { Component } from 'react'

export default class MessageItem extends Component {
  render() {
    let { index, id, author, content, createAt } = this.props;
    return (
      <li className="list-group-item"
      key={index} >
        留言人：{author}
        内容：{content}
        <button
          className="btn btn-danger pull-right btn-xs"
          onClick={() => {
            this.props.delMessage(id)
          }}>&times;</button>
        <span className="pull-right" > 时间： {new Date(createAt).toLocaleString()} </span>
      </li>
    )
  }
}
