import React, {
  Component
} from 'react'

export default class MessageForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    let message = {
      author: this.author.value,
      content: this.content.value
    }
    this.props.addMessage(message);
    this.author.value = '';
    this.content.value = '';
  }
  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit} >
        <div className="form-group">
          <label htmlFor="auth" className="form-label">留言人</label>
          <input
            type="text"
            required={true}
            id="auth"
            className="form-control"
            ref={x => this.author = x} />
        </div>
        <div className = "form-group" >
          <label
            htmlFor="content"
            className="control-label" >内容
          </label>
          <textarea
            type="text"
            required={true}
            id="content"
            cols="30"
            rows="10"
            ref={x => this.content = x}
            className="form-control" >
          </textarea>
        </div>
        <div className = "form-group" >
          <button className="btn btn-info" > 留言板 </button> 
        </div> 
      </form>
    )
  }
}