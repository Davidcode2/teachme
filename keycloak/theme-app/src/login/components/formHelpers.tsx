import type { ReactNode } from "react";

export function FieldError(props: { error?: string }) {
  if (!props.error) {
    return null;
  }

  return <div className="auth-field__error">{props.error}</div>;
}

export function InfoBand(props: { children: ReactNode }) {
  return <div className="auth-info-band">{props.children}</div>;
}
