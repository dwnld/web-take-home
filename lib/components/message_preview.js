import React from 'react'
import { connect } from 'react-redux'

import Ω from '../omega'

const MessagePreview = React.createClass({
  render() {
    const { message, is_loading } = this.props
    const { body } = message
    const style = {
      marginTop: '1em',
      borderTop: '1px solid black',
      paddingTop: '1em'
    }

    return (
      <div id="message-preview" style={style}>
        {is_loading? "Loading..." : body}
      </div>
    )
  }
})

export default Ω.subscribe(MessagePreview, {
  message: 'selected-message',
  is_loading: 'loading-message'
})
