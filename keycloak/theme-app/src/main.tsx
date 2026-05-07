import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KcPage } from "./kc.gen";
import { createGetKcContextMock } from "keycloakify/login/KcContext";

import type { KcContextExtension, KcContextExtensionPerPage } from "./login/KcContext";

const { getKcContextMock } = createGetKcContextMock<KcContextExtension, KcContextExtensionPerPage>({
  kcContextExtension: {
    themeName: "schreinerei",
    properties: {}
  },
  kcContextExtensionPerPage: {}
});

if (import.meta.env.DEV && !window.kcContext) {
  window.kcContext = getKcContextMock({
    pageId: "login-password.ftl",
    overrides: {
      auth: {
        attemptedUsername: "max@schreinerei.de"
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>{window.kcContext ? <KcPage kcContext={window.kcContext} /> : <h1>No Keycloak Context</h1>}</StrictMode>
);
