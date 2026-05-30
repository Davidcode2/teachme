import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";

type Props = {
  kcContext: Extract<KcContext, { pageId: "logout-confirm.ftl" }>;
  i18n: I18n;
};

export default function LogoutConfirmPage(props: Props) {
  const { kcContext, i18n } = props;
  const { msg } = i18n;
  const { url, client, logoutConfirm } = kcContext;

  return (
    <AuthShell
      title={msg("logoutConfirmTitle")}
      topRight={<LocaleSelect kcContext={kcContext} />}
      footer={
        !logoutConfirm.skipLink && client.baseUrl ? (
          <a className="auth-button auth-button--secondary" href={client.baseUrl}>
            {msg("backToApplication")}
          </a>
        ) : undefined
      }
    >
      <div className="auth-stack">
        <div className="auth-copy">{msg("logoutConfirmHeader")}</div>

        <form className="auth-form" action={url.logoutConfirmAction} method="post">
          <input type="hidden" name="session_code" value={logoutConfirm.code} />
          <button className="auth-button auth-button--primary" name="confirmLogout" id="kc-logout" type="submit">
            {msg("doLogout")}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
