import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import SignUpForm, { handleSubmit as signUpAction } from './components/signin/signup.tsx'
import loginAction from './actions/loginAction.ts'
import LoginForm from './components/signin/login.tsx'
import Materials from './components/materials/materials.tsx'
import materialLoader from './loaders/materialLoader.ts'
import AddMaterial from './components/materials/addMaterial.tsx'
import addMaterialAction from './actions/addMaterialAction.ts'
import myMaterialLoader from './loaders/myMaterialLoader.ts'
import ErrorPage from './error-page.tsx'
import NoData from './components/materials/noData.tsx'
import Sidebar from './components/sidebar/sidebar.tsx'
import cartLoader from './loaders/cartLoader.ts'
import Cart from './components/cart/cart.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Materials />, loader: materialLoader },
      { element: <Sidebar/>,
      children: [
        { path: "cart", element: <Cart />, loader: cartLoader }
      ],
      },
      {
        path: "/materials",
        element: <Materials />,
        loader: materialLoader,
        errorElement: <NoData />,
      },
      {
        path: "/materials/add",
        element: <AddMaterial />,
        action: addMaterialAction,
      },
      {
        path: "/materials/mine",
        element: <Materials />,
        loader: myMaterialLoader,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
    action: loginAction
  },
  {
    path: "/signup",
    element: <SignUpForm />,
    action: signUpAction
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
