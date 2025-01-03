import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import SignUpForm from "./components/signin/signup.tsx";
import signUpAction from "./actions/signUpAction.ts";
import loginAction from "./actions/loginAction.ts";
import LoginForm from "./components/signin/login.tsx";
import Materials from "./components/materials/materials.tsx";
import AddMaterial from "./components/materials/addMaterial/addMaterial.tsx";
import AddMaterialSuccess from "./components/materials/addMaterial/addSuccess.tsx";
import addMaterialAction from "./actions/addMaterialAction.ts";
import ErrorPage from "./error-page.tsx";
import NoData from "./components/materials/noData.tsx";
import SuccessPage from "./components/successPage.tsx";
import SharedPreview from "./components/sharedPreview.tsx";
import sharedPreviewLoader from "./loaders/sharedPreviewLoader.ts";
import Workspace from "./components/workspace/workspace.tsx";
import Mine from "./components/workspace/mine.tsx";
import MyMaterials from "./components/materials/myMaterials.tsx";
import SearchResults from "./components/materials/searchResults.tsx";
import addUsernameAction from "./actions/addUsernameAction.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Materials /> },
      {
        path: "/materials",
        element: <Materials />,
        errorElement: <NoData />,
      },
      {
        path: "/search",
        element: <SearchResults />,
        errorElement: <NoData />,
      },
      {
        path: "/materials/mine",
        element: <Mine />,
        children: [
          { index: true, element: <MyMaterials /> },
          {
            path: "workspace/",
            element: <Workspace />,
          },
        ],
      },
      {
        path: "/materials/add",
        element: <AddMaterial />,
        action: addMaterialAction,
      },
      {
        path: "/materials/add/success",
        element: <AddMaterialSuccess />,
        action: addUsernameAction,
      },
      {
        path: "/materials/id/:id",
        element: <SharedPreview />,
        loader: ({ params }) => sharedPreviewLoader(params.id),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
    action: loginAction,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
    action: signUpAction,
  },
  {
    path: "/success",
    element: <SuccessPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
);
