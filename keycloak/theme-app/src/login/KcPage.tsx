import "./styles.css";

import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "keycloakify/login/Template";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import { RealmContext } from "./components/realmContext";
import Login from "./pages/Login";
import LoginPassword from "./pages/LoginPassword";
import LoginResetPassword from "./pages/LoginResetPassword";
import LoginUsername from "./pages/LoginUsername";
import LoginUpdatePassword from "./pages/LoginUpdatePassword";
import LoginUpdateProfile from "./pages/LoginUpdateProfile";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import InfoPage from "./pages/InfoPage";
import LogoutConfirmPage from "./pages/LogoutConfirmPage";
import FrontchannelLogoutPage from "./pages/FrontchannelLogoutPage";

const UserProfileFormFields = lazy(() => import("keycloakify/login/UserProfileFormFields"));

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;
  const { i18n } = useI18n({ kcContext });

  return (
    <RealmContext.Provider value={kcContext.realm.name}>
      <Suspense>
        {(() => {
          switch (kcContext.pageId) {
            case "login.ftl":
              return <Login kcContext={kcContext} i18n={i18n} />;
            case "login-username.ftl":
              return <LoginUsername kcContext={kcContext} i18n={i18n} />;
            case "login-password.ftl":
              return <LoginPassword kcContext={kcContext} i18n={i18n} />;
            case "login-reset-password.ftl":
              return <LoginResetPassword kcContext={kcContext} i18n={i18n} />;
            case "login-update-password.ftl":
              return <LoginUpdatePassword kcContext={kcContext} i18n={i18n} />;
            case "login-update-profile.ftl":
              return <LoginUpdateProfile kcContext={kcContext} i18n={i18n} />;
            case "register.ftl":
              return <Register kcContext={kcContext} i18n={i18n} />;
            case "info.ftl":
              return <InfoPage kcContext={kcContext} i18n={i18n} />;
            case "error.ftl":
              return <ErrorPage kcContext={kcContext} i18n={i18n} />;
            case "logout-confirm.ftl":
              return <LogoutConfirmPage kcContext={kcContext} i18n={i18n} />;
            case "frontchannel-logout.ftl":
              return <FrontchannelLogoutPage kcContext={kcContext} i18n={i18n} />;
            default:
              return (
                <DefaultPage
                  kcContext={kcContext}
                  i18n={i18n}
                  classes={classes}
                  Template={Template}
                  doUseDefaultCss={true}
                  UserProfileFormFields={UserProfileFormFields}
                  doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
              );
          }
        })()}
      </Suspense>
    </RealmContext.Provider>
  );
}

const classes = {} satisfies { [key in ClassKey]?: string };
