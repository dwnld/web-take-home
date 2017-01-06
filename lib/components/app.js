import React from 'react'
import { connect } from 'react-redux'

import Ω from '../omega'

import MessageList from './message_list'
import MessagePreview from './message_preview'

const App = React.createClass({
  render() {
    const { messages } = this.props

    return (
      <div id="messages-app">
        <MessageList />
        <MessagePreview />
      </div>
    )
  }
})

export default App
