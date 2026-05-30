import { useEffect, useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";

type Props = {
  kcContext: Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>;
  i18n: I18n;
};

export default function FrontchannelLogoutPage(props: Props) {
  const { kcContext, i18n } = props;
  const { msg } = i18n;
  const { logout } = kcContext;
  const [iframeLoadCount, setIframeLoadCount] = useState(0);

  useEffect(() => {
    if (!logout.logoutRedirectUri) {
      return;
    }

    if (iframeLoadCount !== logout.clients.length) {
      return;
    }

    window.location.replace(logout.logoutRedirectUri);
  }, [iframeLoadCount, logout.clients.length, logout.logoutRedirectUri]);

  return (
    <AuthShell
      title={msg("frontchannel-logout.title")}
      subtitle={msg("frontchannel-logout.message")}
      topRight={<LocaleSelect kcContext={kcContext} />}
      footer={
        logout.logoutRedirectUri ? (
          <a id="continue" className="auth-button auth-button--primary" href={logout.logoutRedirectUri}>
            {msg("doContinue")}
          </a>
        ) : undefined
      }
    >
      <ul className="auth-client-list">
        {logout.clients.map(client => (
          <li key={client.name} className="auth-client-list__item">
            <span>{client.name}</span>
            <span className="auth-client-list__status">Wird abgemeldet...</span>
            <iframe
              src={client.frontChannelLogoutUrl}
              title={`logout-${client.name}`}
              className="auth-hidden-frame"
              onLoad={() => {
                setIframeLoadCount(count => count + 1);
              }}
            />
          </li>
        ))}
      </ul>
    </AuthShell>
  );
}
