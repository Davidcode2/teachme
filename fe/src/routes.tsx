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
import AuthCallback from "./components/auth/callback.tsx";
import ProtectedRoute from "./components/protectedRoute.tsx";

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
        element: <ProtectedRoute><EditMaterial /></ProtectedRoute>,
        action: editMaterialAction,
      },
      {
        path: "/search",
        element: <SearchResults />,
        errorElement: <NoData />,
      },
      {
        path: "/materials/mine",
        element: <ProtectedRoute><Mine /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <MyMaterials />,
          },
          {
            path: "bought/",
            element: <ProtectedRoute><MyMaterials /></ProtectedRoute>,
          },
          {
            path: "workspace/",
            element: <ProtectedRoute><Workspace /></ProtectedRoute>,
          },
        ],
      },
      {
        path: "/materials/add",
        element: <ProtectedRoute><AddMaterial /></ProtectedRoute>,
        action: addMaterialAction,
      },
      {
        path: "/materials/add/success",
        element: <ProtectedRoute><AddMaterialSuccess /></ProtectedRoute>,
        action: addUsernameAction,
      },
      {
        path: "/materials/id/:id",
        element: <SharedPreview />,
        loader: ({ params }: any) => sharedPreviewLoader(params.id),
      },
      {
        path: "/success",
        element: <ProtectedRoute><SuccessPage /></ProtectedRoute>,
      },
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      },
    ],
  },
];

export default routes;
