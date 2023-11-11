import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PractitionerLogin from './pages/practitioner-login/practitioner-login.jsx'
import PractitionerRegister from './pages/practitioner-register/practitioner-register.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/practitioner-login',
    element: <PractitionerLogin/>
  },
  {
    path: '/practitioner-register',
    element: <PractitionerRegister/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
