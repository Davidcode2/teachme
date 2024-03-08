import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import SignUpForm, { handleSubmit as signUpAction } from './components/signin/signup.tsx'
import LoginForm, { handleSubmit as loginAction } from './components/signin/login.tsx'
import Materials from './components/materials/materials.tsx'
import materialLoader from './loaders/materialLoader.ts'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
      path: "/materials",
      element: <Materials/>,
      loader: materialLoader
      }
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
    action: loginAction
  },
  {
    path: "/signup",
    element: <SignUpForm/>,
    action: signUpAction
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
