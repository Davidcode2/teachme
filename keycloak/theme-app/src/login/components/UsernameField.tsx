import type { ReactNode } from "react";
import { FieldError } from "./formHelpers";

// Mirrors Keycloak's UsernameProhibitedCharactersValidator so the live
// checkmark agrees with what the server accepts on submit: no whitespace,
// no control characters, none of the forbidden specials.
const USERNAME_INVALID_CHARS = /[\s<>&"'$%!#?§,;:*~/\\|^=[\]{}()`\p{Cc}]/u;

export function isUsernameValid(value: string): boolean {
  return value.length > 0 && !USERNAME_INVALID_CHARS.test(value);
}

type Props = {
  id: string;
  name: string;
  label: ReactNode;
  value: string;
  error?: React.ReactNode;
  onChange: (value: string) => void;
  onBlur: () => void;
};

export function UsernameField(props: Props) {
  const { id, name, label, value, error, onChange, onBlur } = props;
  const isValid = isUsernameValid(value);

  return (
    <label className="auth-field">
      <span className="auth-field__label">{label}</span>
      <span className="auth-input-wrap">
        <input
          className="auth-input auth-input--with-status"
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={event => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete="username"
          aria-describedby={`${id}-hint`}
        />
        {isValid && (
          <svg className="auth-input__status" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
              d="M13.5 4.5 L6.5 11.5 L2.5 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="auth-field__hint" id={`${id}-hint`}>
        Keine Leerzeichen oder Sonderzeichen. Erlaubt: Buchstaben, Zahlen, . - _ @ +
      </span>
      <FieldError error={error} />
    </label>
  );
}
