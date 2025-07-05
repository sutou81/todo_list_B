import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import HelloWorld from './HelloWorld'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    {/* <HelloWorld /> */}
  </React.StrictMode>,
)
