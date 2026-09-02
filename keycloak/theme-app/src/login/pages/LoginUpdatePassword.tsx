import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";
import { PasswordField } from "../components/PasswordField";
import { FieldError } from "../components/formHelpers";

type Props = {
  kcContext: Extract<KcContext, { pageId: "login-update-password.ftl" }>;
  i18n: I18n;
};

export default function LoginUpdatePassword(props: Props) {
  const { kcContext, i18n } = props;
  const { msg, msgStr } = i18n;
  const { url, messagesPerField, isAppInitiatedAction } = kcContext;

  return (
    <AuthShell title={msg("updatePasswordTitle")} topRight={<LocaleSelect kcContext={kcContext} />}>
      <form className="auth-form" action={url.loginAction} method="post">
        <div className="auth-field">
          <span className="auth-field__label">{msg("passwordNew")}</span>
          <PasswordField id="password-new" name="password-new" label={msgStr("passwordNew")} showLabel={false} autoFocus autoComplete="new-password" />
        </div>
        <FieldError error={messagesPerField.getFirstError("password")} />

        <div className="auth-field">
          <span className="auth-field__label">{msg("passwordConfirm")}</span>
          <PasswordField id="password-confirm" name="password-confirm" label={msgStr("passwordConfirm")} showLabel={false} autoComplete="new-password" />
        </div>
        <FieldError error={messagesPerField.getFirstError("password-confirm")} />

        <label className="auth-checkbox">
          <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked />
          <span>{msg("logoutOtherSessions")}</span>
        </label>

        <div className="auth-actions">
          <button className="auth-button auth-button--primary" type="submit">
            {msg("doSubmit")}
          </button>
          {isAppInitiatedAction ? (
            <button className="auth-button auth-button--secondary" type="submit" name="cancel-aia" value="true">
              {msg("doCancel")}
            </button>
          ) : null}
        </div>
      </form>
    </AuthShell>
  );
}
