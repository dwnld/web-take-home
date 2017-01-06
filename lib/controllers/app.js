import update from 'immutability-helper'
import _ from 'lodash'

import Ω from '../omega'
import messageService from '../services/message'

function registerHandlers() {
  Ω.handler('fetch-all-messages',
    Ω.mw.after((db, event_name) => Ω.fetch(event_name, messageService.all())),
    (db, event_name) => update(db, { loading: { list: { $set: true } } }))

  Ω.handler('fetch-all-messages-ok',
    (db, event_name, messages) => update(db, { messages: { $set: messages },
                                               loading: { list: { $set: false } } }))

  Ω.handler('fetch-all-messages-err',
    (db, event_name, messages) => update(db, { messages: { $set: [] },
                                               loading: { list: { $set: false } } }))



  Ω.handler('set-selected',
    Ω.mw.after((db, event_name, id) => Ω.fetch(event_name, messageService.one(id), id)),
    (db, event_name, id) => update(db, { selected_id: { $set: id },
                                         loading: { message: { $set: true } } }))

  Ω.handler('set-selected-ok',
    (db, event_name, message, id) => {
      const { messages } = db
      const idx = _.findIndex(messages, ['id', id])
      return update(db, { messages: { [idx]: { $merge: message } },
                          loading: { message: { $set: false } } })})

  Ω.handler('set-selected-err',
    (db, event_name, messages) => update(db, { messages: { $set: [] },
                                               loading: { message: { $set: false } } }))
}

function registerTopics() {
  Ω.topic('messages', db => db.messages)

  Ω.topic('selected-message', db => {
    const { messages, selected_id } = db
    if (!selected_id) return {}

    return _.find(messages, ['id', selected_id])
  })

  Ω.topic('loading-list', db => db.loading.list)

  Ω.topic('loading-message', db => db.loading.message)
}

export default () => {
  registerHandlers()
  registerTopics()

  Ω.dispatch('fetch-all-messages')
}