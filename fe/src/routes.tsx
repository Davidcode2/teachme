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
import SuccessPage from "./components/successPage/successPage.tsx";
import SharedPreview from "./components/sharedPreview.tsx";
import sharedPreviewLoader from "./loaders/sharedPreviewLoader.ts";
import Workspace from "./components/workspace/workspace.tsx";
import Mine from "./components/workspace/mine.tsx";
import MyMaterials from "./components/materials/myMaterials.tsx";
import SearchResults from "./components/materials/searchResults.tsx";
import addUsernameAction from "./actions/addUsernameAction.ts";
import EditMaterial from "./components/card/edit_card.tsx";
import editMaterialAction from "./actions/editMaterialAction.ts";
import App from "./App.tsx";

const routes = [
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
        path: "/materials/:id/edit",
        element: <EditMaterial />,
        action: editMaterialAction,
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
        loader: ({ params }: any) => sharedPreviewLoader(params.id),
      },
      {
        path: "/success",
        element: <SuccessPage />,
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
];

export default routes;
