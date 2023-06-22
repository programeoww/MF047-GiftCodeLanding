import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import InitialData from './interfaces/initialData.ts'

const initialData: InitialData = (window as any).initialData

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App initialData={initialData}/>
  </React.StrictMode>,
)