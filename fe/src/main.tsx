import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import SignUpForm  from './components/signin/signup.tsx'
import signUpAction from './actions/signUpAction.ts'
import loginAction from './actions/loginAction.ts'
import LoginForm from './components/signin/login.tsx'
import Materials from './components/materials/materials.tsx'
import materialLoader from './loaders/materialLoader.ts'
import AddMaterial from './components/materials/addMaterial.tsx'
import addMaterialAction from './actions/addMaterialAction.ts'
import myMaterialLoader from './loaders/myMaterialLoader.ts'
import ErrorPage from './error-page.tsx'
import NoData from './components/materials/noData.tsx'
import SuccessPage from './components/successPage.tsx'
import SharedPreview from './components/sharedPreview.tsx'
import sharedPreviewLoader from './loaders/sharedPreviewLoader.ts'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Materials />, loader: materialLoader },
      {
        path: "/materials",
        element: <Materials />,
        errorElement: <NoData />,
      },
      {
        path: "/materials/mine",
        element: <Materials />,
      },
      {
        path: "/materials/add",
        element: <AddMaterial />,
        action: addMaterialAction,
      },
      {
        path: "/materials/id/:id",
        element: <SharedPreview />,
        loader: ({params}) => sharedPreviewLoader(params.id),
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
  {
  path: "/success",
  element: <SuccessPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
