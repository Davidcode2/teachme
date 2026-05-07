import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";
import { FieldError } from "../components/formHelpers";

type Props = {
  kcContext: Extract<KcContext, { pageId: "login-username.ftl" }>;
  i18n: I18n;
};

export default function LoginUsername(props: Props) {
  const { kcContext, i18n } = props;
  const { msg, msgStr } = i18n;
  const { realm, url, login, messagesPerField } = kcContext;

  const usernameLabel = !realm.loginWithEmailAllowed
    ? msgStr("username")
    : !realm.registrationEmailAsUsername
      ? msgStr("usernameOrEmail")
      : msgStr("email");

  return (
    <AuthShell title={msg("loginAccountTitle")} topRight={<LocaleSelect kcContext={kcContext} />}>
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
        <FieldError error={messagesPerField.getFirstError("username")} />

        {realm.rememberMe ? (
          <label className="auth-checkbox">
            <input type="checkbox" name="rememberMe" defaultChecked={Boolean(login.rememberMe)} />
            <span>{msg("rememberMe")}</span>
          </label>
        ) : null}

        <button className="auth-button auth-button--primary" type="submit" name="login" id="kc-login">
          {msg("doLogIn")}
        </button>
      </form>
    </AuthShell>
  );
}
