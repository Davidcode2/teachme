import { useState } from "react";

type Props = {
  id: string;
  name: string;
  label: string;
  showLabel?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  defaultValue?: string;
};

export function PasswordField(props: Props) {
  const { id, name, label, showLabel = true, autoFocus, autoComplete, defaultValue } = props;
  const [visible, setVisible] = useState(false);

  return (
    <label className="auth-field">
      {showLabel ? <span className="auth-field__label">{label}</span> : null}
      <div className="auth-password-field">
        <input
          id={id}
          name={name}
          className="auth-input auth-password-field__input"
          type={visible ? "text" : "password"}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
        />
        <button
          type="button"
          className="auth-password-field__toggle"
          onClick={() => setVisible(current => !current)}
          aria-label={visible ? "Passwort verbergen" : "Passwort anzeigen"}
        >
          {visible ? "Verbergen" : "Anzeigen"}
        </button>
      </div>
    </label>
  );
}
