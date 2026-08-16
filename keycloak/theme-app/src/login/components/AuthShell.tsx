import type { PropsWithChildren, ReactNode } from "react";
import { useRealmName } from "./realmContext";

type Props = PropsWithChildren<{
  title?: ReactNode;
  subtitle?: ReactNode;
  topRight?: ReactNode;
  message?: ReactNode;
  footer?: ReactNode;
}>;

type RealmBranding = {
  mark: string;
  title: string;
  subtitle: string;
};

const REALM_BRANDING: Record<string, RealmBranding> = {
  schreinerei: { mark: "S", title: "Schreinerei", subtitle: "Baustellenverwaltung" },
  personal: { mark: "JL", title: "Jakob Lingel", subtitle: "Personal" }
};

export function AuthShell(props: Props) {
  const { title, subtitle, topRight, message, footer, children } = props;
  const realmName = useRealmName();
  const branding = REALM_BRANDING[realmName] ?? REALM_BRANDING.schreinerei;

  return (
    <div className="auth-page" data-realm={realmName}>
      <div className="auth-page__panel">
        <div className="auth-brand">
          <div className="auth-brand__mark" aria-hidden="true">
            {branding.mark}
          </div>
          <div className="auth-brand__title">{branding.title}</div>
          <div className="auth-brand__subtitle">{branding.subtitle}</div>
        </div>

        {(title || topRight) && (
          <div className="auth-page__header">
            <div>
              {title ? <h1 className="auth-page__title">{title}</h1> : null}
              {subtitle ? <p className="auth-page__subtitle">{subtitle}</p> : null}
            </div>
            {topRight ? <div className="auth-page__top-right">{topRight}</div> : null}
          </div>
        )}

        {message ? <div className="auth-alert">{message}</div> : null}

        {children}

        {footer ? <div className="auth-page__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
