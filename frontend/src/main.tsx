import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import CreateReport from './pages/CreateReport'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Navigate to='/reports' replace />} />
          <Route path='/createreport' element={<CreateReport />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/reports/:id' element={<ReportDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
