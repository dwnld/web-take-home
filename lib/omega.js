import { createStore } from 'redux'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import _ from 'lodash'
import 'whatwg-fetch'

// ===== BASE =====
let MINIMUM_FETCH_WAIT = 1000
let handlers = {}
let topics = {}
let db = {}

function store_handler(db, action) {
  const { type: id, data = [] } = action
  const handler = handlers[id]

  if (!handler) return db

  return update(db, { $set: _.partial(handler, db, id).apply(null, data) })
}

function init_db(initial_state, min_fetch_wait) {
  if (min_fetch_wait) MINIMUM_FETCH_WAIT = min_fetch_wait

  db = createStore(
    store_handler,
    initial_state,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  return db
}

function handler(id, ...fns) {
  if (_.has(handlers, id)) {
    throw `Can't register a duplicate handler "${id}"`
  }

  const handler_fn = _.last(fns)
  const mw_fns = _.take(fns, fns.length - 1)
  let middleware

  if (_.isEmpty(mw_fns)) {
    middleware = _.identity
  } else if (mw_fns.length === 1) {
    middleware = _.first(mw_fns)
  } else {
    middleware = _.flow(mw_fns)
  }

  handlers[id] = middleware(handler_fn)
}

function topic(id, fn) {
  if (_.has(topics, id)) {
    throw `Attempted to register a duplicate subscription "${id}"`
  }
  topics[id] = fn
}

function subscribe(component, subscriptions) {
  const mapStateToProps = (db) => {
    let subs = {}
    for (let k in subscriptions) {
      if (!_.has(topics, subscriptions[k])) {
        throw `subscription failure: no such topic found (${subscriptions[k]})`
      }
      subs[k] = topics[subscriptions[k]](db)
    }
    return subs
  }

  return connect(mapStateToProps)(component)
}

function dispatch(id, ...data) {
  // Ω wraps Redux... you're probably looking for `store_handler` above
  db.dispatch({
    type: id,
    data
  })
}

// ===== SERVICES =====
function remote_call_handler(url, build_result_fn = _.identity, data = null) {
  const options = _.isNil(data) ? {} : {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "same-origin"
  }

  return fetch(url, options)
    .then(
      resp => {
        // http response
        if (resp.ok) {
          return resp.json()
        } else {
          throw resp.statusText
        }
      },
      resp => {
        // network error
        console.log(resp)
        throw "-- NETWORK ERROR --"
      }
    )
    .then(
      data => ({ ok: true, data: build_result_fn(data) }),
      error => ({ ok: false, data: error })
    )
}

function service_fetch(event_name, promise, ...args) {
  const fetch_start = Date.now()
  promise.then(
    resp => {
      const fetch_duration = Date.now() - fetch_start
      const { ok, data } = resp
      const new_event = ok ? `${event_name}-ok` : `${event_name}-err`
      const next = _.partial(dispatch, new_event, data)
      const wait = fetch_duration > MINIMUM_FETCH_WAIT ?
        next.apply(null, args) :
        setTimeout(
          () => next.apply(null, args),
          MINIMUM_FETCH_WAIT - fetch_duration
        )
    }
  )
}


// ===== MIDDLEWARE =====
const after = fn => handler => (db, id, ...v) => {
  const new_db = handler(db, id, ...v)
  fn(new_db, id, ...v)
  return new_db
}

export default {
  init_db,
  handler,
  topic,
  subscribe,
  dispatch,
  remote_call_handler,
  fetch: service_fetch,
  mw: { after }
}
