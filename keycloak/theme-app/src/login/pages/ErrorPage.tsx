import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";

type Props = {
  kcContext: Extract<KcContext, { pageId: "error.ftl" }>;
  i18n: I18n;
};

export default function ErrorPage(props: Props) {
  const { kcContext } = props;
  const context = kcContext as Extract<KcContext, { pageId: "error.ftl" }> & {
    message?: { summary?: string };
    client?: { baseUrl?: string };
    skipLink?: boolean;
  };

  return (
    <AuthShell
      title="Etwas ist schiefgelaufen"
      topRight={<LocaleSelect kcContext={kcContext} />}
      footer={
        !context.skipLink && context.client?.baseUrl ? (
          <a className="auth-button auth-button--secondary" href={context.client.baseUrl}>
            Zuruck zur Anwendung
          </a>
        ) : undefined
      }
    >
      <div className="auth-copy auth-copy--danger">{context.message?.summary}</div>
    </AuthShell>
  );
}
