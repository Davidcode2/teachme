import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";
import { PasswordField } from "../components/PasswordField";
import { FieldError } from "../components/formHelpers";

type Props = {
  kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
  i18n: I18n;
};

export default function Login(props: Props) {
  const { kcContext, i18n } = props;
  const { msg, msgStr } = i18n;
  const { realm, url, login, messagesPerField, auth } = kcContext;

  const usernameError = messagesPerField.getFirstError("username", "password");
  const usernameLabel = !realm.loginWithEmailAllowed
    ? msgStr("username")
    : !realm.registrationEmailAsUsername
      ? msgStr("usernameOrEmail")
      : msgStr("email");

  return (
    <AuthShell topRight={<LocaleSelect kcContext={kcContext} />}>
      <form className="auth-form" action={url.loginAction} method="post">
        <label className="auth-field">
          <span className="auth-field__label">{usernameLabel}</span>
          <input
            className="auth-input"
            id="username"
            name="username"
            type="text"
            defaultValue={login.username ?? ""}
            autoFocus
            autoComplete="username"
          />
        </label>
        <FieldError error={usernameError} />

        <div className="auth-field">
          <div className="auth-field__meta">
            <span className="auth-field__label">{msg("password")}</span>
            {realm.resetPasswordAllowed ? (
              <a className="auth-link" href={url.loginResetCredentialsUrl}>
                {msg("doForgotPassword")}
              </a>
            ) : null}
          </div>
          <PasswordField id="password" name="password" label={msgStr("password")} showLabel={false} autoComplete="current-password" />
        </div>

        {realm.rememberMe ? (
          <label className="auth-checkbox">
            <input type="checkbox" name="rememberMe" defaultChecked={Boolean(login.rememberMe)} />
            <span>{msg("rememberMe")}</span>
          </label>
        ) : null}

        <input type="hidden" id="id-hidden-input" name="credentialId" value={auth?.selectedCredential ?? ""} />

        <button className="auth-button auth-button--primary" type="submit" name="login" id="kc-login">
          {msg("doLogIn")}
        </button>
      </form>
    </AuthShell>
  );
}
