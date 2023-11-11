import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PractitionerLogin from './pages/practitioner-login/practitioner-login.jsx'
import PractitionerRegister from './pages/practitioner-register/practitioner-register.jsx'
import PractitionerDashboard from './pages/practitioner-dashboard/practitioner-dashboard.jsx'
import PatientLogin from './pages/patient-login/patient-login.jsx'
import PatientRegister from './pages/patient-register/patient-register.jsx'

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import PatientDashboard from './pages/patient-dashboard/patient-dashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/patient-login',
    element: <PatientLogin/>
  },
  {
    path: '/patient-register',
    element: <PatientRegister/>
  },
  {
    path: '/practitioner-login',
    element: <PractitionerLogin/>
  },
  {
    path: '/practitioner-register',
    element: <PractitionerRegister/>
  },
  {
    path: '/patient-dashboard',
    element: <PatientDashboard/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
