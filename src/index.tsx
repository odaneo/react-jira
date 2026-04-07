import './wdyr'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DevTools, loadServer } from 'jira-dev-tool'
import 'antd/dist/antd.less'
import { AppProviders } from 'context/index'
import { Profiler } from 'components/profiler'
// import reportWebVitals from './reportWebVitals'

loadServer(() =>
  ReactDOM.render(
    <Profiler id={'Root App'} phases={['mount']}>
      <AppProviders>
        <DevTools />
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root')
  )
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
