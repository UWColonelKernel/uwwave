import React from 'react'
import { render } from 'react-dom'

import { store } from 'src/store'
import { Provider } from 'react-redux'
import { App } from './App'

const rootElement = document.getElementById('root')

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  rootElement,
)
