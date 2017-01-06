// import update from 'immutability-helper'
// import _ from 'lodash'

import Ω from '../omega'

function all() {
  return Ω.remote_call_handler('/api/messages')
}

function one(message_id) {
  return Ω.remote_call_handler(`/api/messages/${message_id}`)
}

export default { all, one }