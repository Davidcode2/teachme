import type { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  title?: ReactNode;
  subtitle?: ReactNode;
  topRight?: ReactNode;
  message?: ReactNode;
  footer?: ReactNode;
}>;

export function AuthShell(props: Props) {
  const { title, subtitle, topRight, message, footer, children } = props;

  return (
    <div className="auth-page">
      <div className="auth-page__panel">
        <div className="auth-brand">
          <div className="auth-brand__mark" aria-hidden="true">
            S
          </div>
          <div className="auth-brand__title">Schreinerei</div>
          <div className="auth-brand__subtitle">Baustellenverwaltung</div>
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
