import { useState, type ReactNode } from "react";
import type { Attribute } from "keycloakify/login/KcContext";
import { useUserProfileForm } from "keycloakify/login/lib/useUserProfileForm";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthShell } from "../components/AuthShell";
import { LocaleSelect } from "../components/LocaleSelect";
import { PasswordField } from "../components/PasswordField";
import { UsernameField } from "../components/UsernameField";
import { FieldError } from "../components/formHelpers";

type Props = {
  kcContext: Extract<KcContext, { pageId: "login-update-profile.ftl" }>;
  i18n: I18n;
};

const doMakeUserConfirmPassword = true;

export default function LoginUpdateProfile(props: Props) {
  const { kcContext, i18n } = props;
  const { msg, advancedMsg } = i18n;
  const { url, isAppInitiatedAction } = kcContext;

  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction
  } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword
  });

  return (
    <AuthShell
      title={msg("loginProfileTitle")}
      topRight={<LocaleSelect kcContext={kcContext} />}
    >
      <form className="auth-form" action={url.loginAction} method="post">
        {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
          if (attribute.annotations.inputType === "hidden") {
            return <input key={attribute.name} type="hidden" name={attribute.name} value={typeof valueOrValues === "string" ? valueOrValues : ""} />;
          }

          if (attribute.name === "password-confirm" && !doMakeUserConfirmPassword) {
            return null;
          }

          if (Array.isArray(valueOrValues)) {
            return null;
          }

          return (
            <UpdateProfileField
              key={attribute.name}
              attribute={attribute}
              error={displayableErrors[0]?.errorMessage}
              value={valueOrValues}
              label={advancedMsg(attribute.displayName ?? attribute.name)}
              onChange={value => dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: value })}
              onBlur={() => dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex: undefined })}
            />
          );
        })}

        <div className="auth-actions">
          <button className="auth-button auth-button--primary" type="submit" disabled={!isFormSubmittable}>
            {msg("doSubmit")}
          </button>
          {isAppInitiatedAction ? (
            <button className="auth-button auth-button--secondary" type="submit" name="cancel-aia" value="true" formNoValidate>
              {msg("doCancel")}
            </button>
          ) : null}
        </div>
      </form>
    </AuthShell>
  );
}

type UpdateProfileFieldProps = {
  attribute: Attribute;
  label: ReactNode;
  value: string;
  error?: React.ReactNode;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function UpdateProfileField(props: UpdateProfileFieldProps) {
  const { attribute, label, value, error, onChange, onBlur } = props;

  if (attribute.name === "password" || attribute.name === "password-confirm") {
    return (
      <div className="auth-field">
        <PasswordField
          id={attribute.name}
          name={attribute.name}
          label={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={getAutoComplete(attribute)}
        />
        <FieldError error={error} />
      </div>
    );
  }

  if (attribute.name === "username") {
    return (
      <UsernameField
        id={attribute.name}
        name={attribute.name}
        label={label}
        value={value}
        error={error}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  }

  if (attribute.annotations.inputType === "textarea") {
    return (
      <label className="auth-field">
        <span className="auth-field__label">{label}</span>
        <textarea className="auth-input auth-textarea" id={attribute.name} name={attribute.name} value={value} onChange={event => onChange(event.target.value)} onBlur={onBlur} />
        <FieldError error={error} />
      </label>
    );
  }

  return (
    <label className="auth-field">
      <span className="auth-field__label">{label}</span>
      <input
        className="auth-input"
        id={attribute.name}
        name={attribute.name}
        type={getInputType(attribute)}
        value={value}
        onChange={event => onChange(event.target.value)}
        onBlur={onBlur}
        autoComplete={getAutoComplete(attribute)}
      />
      <FieldError error={error} />
    </label>
  );
}

function getInputType(attribute: Attribute) {
  switch (attribute.annotations.inputType) {
    case "email":
    case "tel":
    case "text":
      return attribute.annotations.inputType;
    default:
      return "text";
  }
}

function getAutoComplete(attribute: Attribute) {
  if (attribute.autocomplete) {
    return attribute.autocomplete;
  }

  switch (attribute.name) {
    case "email":
      return "email";
    case "username":
      return "username";
    case "firstName":
      return "given-name";
    case "lastName":
      return "family-name";
    case "password":
      return "new-password";
    case "password-confirm":
      return "new-password";
    default:
      return undefined;
  }
}
