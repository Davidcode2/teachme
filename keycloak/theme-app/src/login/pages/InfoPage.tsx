import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";

type Props = {
  kcContext: Extract<KcContext, { pageId: "info.ftl" }>;
  i18n: I18n;
};

export default function InfoPage(props: Props) {
  const { kcContext } = props;
  const context = kcContext as Extract<KcContext, { pageId: "info.ftl" }> & {
    message?: { summary?: string };
    messageHeader?: string;
    requiredActions?: string[];
    pageRedirectUri?: string;
    actionUri?: string;
    client?: { baseUrl?: string };
    skipLink?: boolean;
  };

  const actions = context.requiredActions ?? [];
  const continueHref = context.pageRedirectUri ?? context.actionUri ?? context.client?.baseUrl;

  return (
    <AuthShell
      title={context.messageHeader ?? "Information"}
      topRight={<LocaleSelect kcContext={kcContext} />}
      footer={
        <div className="auth-stack auth-stack--sm">
          {actions.length > 0 ? (
            <ul className="auth-list">
              {actions.map(action => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          ) : null}
          {continueHref ? (
            <a className="auth-button auth-button--primary" href={continueHref}>
              Weiter
            </a>
          ) : null}
        </div>
      }
    >
      <div className="auth-copy">{context.message?.summary}</div>
    </AuthShell>
  );
}
