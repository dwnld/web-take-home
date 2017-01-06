import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import _ from 'lodash'

import Ω from './omega'
import App from './components/app'
import AppCtrl from './controllers/app'

let db = Ω.init_db({
  messages: [],
  selected_id: null,
  loading: {
    list: false,
    message: false
  }
})

// init controllers
AppCtrl()

ReactDom.render(
  <Provider store={db}>
    <App />
  </Provider>,
document.getElementById('app') )
