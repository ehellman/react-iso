import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Loadable from 'react-loadable'

import App from './App'

Loadable.preloadReady().then(() => {
  ReactDOM.hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root'),
  )
})

if (module.hot) {
  module.hot.accept()
}
