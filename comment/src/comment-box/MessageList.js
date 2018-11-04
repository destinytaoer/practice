import React, {
  Component
} from 'react'
import MessageItem from './MessageItem';

export default class MessageList extends Component {
  render() {
    return (
      <ul className = "list-group" >
        {this.props.messages.map((item, index) => (
            <MessageItem key={index} {...item} delMessage={this.props.delMessage}></MessageItem>
        ))}
      </ul>
    )
  }
}