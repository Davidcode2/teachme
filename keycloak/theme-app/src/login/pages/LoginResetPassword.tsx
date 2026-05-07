import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";
import { FieldError, InfoBand } from "../components/formHelpers";

type Props = {
  kcContext: Extract<KcContext, { pageId: "login-reset-password.ftl" }>;
  i18n: I18n;
};

export default function LoginResetPassword(props: Props) {
  const { kcContext, i18n } = props;
  const { msg, msgStr } = i18n;
  const { realm, url, auth, messagesPerField } = kcContext;

  const usernameLabel = !realm.loginWithEmailAllowed
    ? msgStr("username")
    : !realm.registrationEmailAsUsername
      ? msgStr("usernameOrEmail")
      : msgStr("email");

  return (
    <AuthShell
      title={msg("emailForgotTitle")}
      subtitle="Wir senden dir einen Link zum Zurucksetzen deines Passworts."
      topRight={<LocaleSelect kcContext={kcContext} />}
      footer={
        <InfoBand>
          {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
        </InfoBand>
      }
    >
      <form className="auth-form" action={url.loginAction} method="post">
        <label className="auth-field">
          <span className="auth-field__label">{usernameLabel}</span>
          <input
            className="auth-input"
            id="username"
            name="username"
            type="text"
            defaultValue={auth.attemptedUsername ?? ""}
            autoFocus
          />
        </label>
        <FieldError error={messagesPerField.getFirstError("username")} />

        <div className="auth-actions">
          <button className="auth-button auth-button--primary" type="submit">
            {msg("doSubmit")}
          </button>
          <a className="auth-button auth-button--secondary" href={url.loginUrl}>
            {msg("backToLogin")}
          </a>
        </div>
      </form>
    </AuthShell>
  );
}
