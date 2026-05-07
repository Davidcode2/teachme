import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";
import { PasswordField } from "../components/PasswordField";
import { FieldError } from "../components/formHelpers";

type Props = {
  kcContext: Extract<KcContext, { pageId: "login-password.ftl" }>;
  i18n: I18n;
};

export default function LoginPassword(props: Props) {
  const { kcContext, i18n } = props;
  const { msg, msgStr } = i18n;
  const { url, realm, auth, messagesPerField } = kcContext;

  return (
    <AuthShell title={msg("doLogIn")} topRight={<LocaleSelect kcContext={kcContext} />}>
      <div className="auth-user-pill">
        <span className="auth-user-pill__label">{auth?.attemptedUsername ?? ""}</span>
        <button type="button" className="auth-user-pill__action" onClick={() => (window.location.href = url.loginRestartFlowUrl)}>
          Anderes Konto
        </button>
      </div>

      <form className="auth-form" action={url.loginAction} method="post">
        <div className="auth-field__meta">
          <span className="auth-field__label">{msg("password")}</span>
          {realm.resetPasswordAllowed ? (
            <a className="auth-link" href={url.loginResetCredentialsUrl}>
              {msg("doForgotPassword")}
            </a>
          ) : null}
        </div>
        <PasswordField id="password" name="password" label={msgStr("password")} showLabel={false} autoFocus autoComplete="current-password" />
        <FieldError error={messagesPerField.getFirstError("password")} />

        <button className="auth-button auth-button--primary" type="submit" name="login" id="kc-login">
          {msg("doLogIn")}
        </button>
      </form>
    </AuthShell>
  );
}
