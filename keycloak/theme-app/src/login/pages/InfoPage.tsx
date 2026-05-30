import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

type Props = {
  kcContext: Extract<KcContext, { pageId: "info.ftl" }>;
  i18n: I18n;
};

export default function InfoPage(props: Props) {
  const { kcContext, i18n } = props;
  const { advancedMsgStr, msgStr } = i18n;
  const context = kcContext as Extract<KcContext, { pageId: "info.ftl" }> & {
    message?: { summary?: string };
    messageHeader?: string;
    requiredActions?: string[];
    pageRedirectUri?: string;
    actionUri?: string;
    client?: { baseUrl?: string };
    skipLink?: boolean;
  };

  const actions = (context.requiredActions ?? []).map(action => advancedMsgStr(`requiredAction.${action}`));
  const continueHref = context.pageRedirectUri ?? context.actionUri ?? context.client?.baseUrl;
  const headerHtml = kcSanitize(
    context.messageHeader ? advancedMsgStr(context.messageHeader) : context.message?.summary ?? "Information"
  );
  const messageHtml = kcSanitize(
    [context.message?.summary?.trim(), actions.length > 0 ? `<strong>${actions.join(", ")}</strong>` : undefined]
      .filter(Boolean)
      .join(" ")
  );
  const logoutCopy = msgStr("successLogout");
  const normalizedHeader = headerHtml.replace(/<[^>]+>/g, " ").trim().toLowerCase();
  const normalizedMessage = (context.message?.summary ?? "").trim().toLowerCase();
  const isLogoutSuccess =
    context.messageHeader === "successLogout" ||
    normalizedHeader === logoutCopy.toLowerCase() ||
    normalizedMessage === logoutCopy.toLowerCase();
  const continueLabel = isLogoutSuccess && context.client?.baseUrl ? "Zur Anmeldung" : "Weiter";

  return (
    <AuthShell
      title={<span dangerouslySetInnerHTML={{ __html: headerHtml }} />}
      topRight={<LocaleSelect kcContext={kcContext} />}
      footer={
        <div className="auth-stack auth-stack--sm">
          {continueHref ? (
            <a className="auth-button auth-button--primary" href={continueHref}>
              {continueLabel}
            </a>
          ) : null}
        </div>
      }
    >
      <div className={isLogoutSuccess ? "auth-copy auth-copy--success" : "auth-copy"} dangerouslySetInnerHTML={{ __html: messageHtml }} />
    </AuthShell>
  );
}
