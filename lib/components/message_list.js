import React from 'react'
import { connect } from 'react-redux'

import Ω from '../omega'

const ListItem = React.createClass({
  setSelected() {
    const { id } = this.props.message

    Ω.dispatch('set-selected', id)
  },

  render() {
    const { message } = this.props
    const { subject } = message
    return (
      <div className="message-list-item" onClick={this.setSelected}>
        {subject}
      </div>
    )
  }
})

const MessageList = React.createClass({
  render() {
    const { messages, is_loading } = this.props

    return (
      <div id="message-list">
        {
          is_loading ?
            "Loading..." :
            messages.map(message => <ListItem key={message.id} message={message} />)
        }
      </div>
    )
  }
})

export default Ω.subscribe(MessageList, {
  messages: 'messages',
  is_loading: 'loading-list'
})
