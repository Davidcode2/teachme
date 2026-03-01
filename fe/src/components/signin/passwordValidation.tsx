import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export default function PasswordValidation({ password }: { password: string }) {
  const [passwordLengthRequirementMet, setPasswordLengthRequirementMet] =
    useState(false);
  const [passwordUppercaseRequirementMet, setPasswordUppercaseRequirementMet] =
    useState(false);
  const [passwordLowercaseRequirementMet, setPasswordLowercaseRequirementMet] =
    useState(false);
  const [passwordNumberRequirementMet, setPasswordNumberRequirementMet] =
    useState(false);

  useEffect(() => {
    checkPasswordRequirements();
  }, [password]);

  const checkPasswordRequirements = () => {
    let current = password;
    checkPasswordLengthRequirement(current);
    checkPasswordUpperCaseRequirement(current);
    checkPasswordLowerCaseRequirement(current);
    checkPasswordNumberRequirement(current);
  };

  const checkPasswordNumberRequirement = (password: string) => {
    if (password.match(/.*[\d].*/)) {
      setPasswordNumberRequirementMet(true);
    } else {
      setPasswordNumberRequirementMet(false);
    }
  };

  const checkPasswordLowerCaseRequirement = (password: string) => {
    if (password.match(/.*[a-z].*/)) {
      setPasswordLowercaseRequirementMet(true);
    } else {
      setPasswordLowercaseRequirementMet(false);
    }
  };

  const checkPasswordUpperCaseRequirement = (password: string) => {
    if (password.match(/.*[A-Z].*/)) {
      setPasswordUppercaseRequirementMet(true);
    } else {
      setPasswordUppercaseRequirementMet(false);
    }
  };

  const checkPasswordLengthRequirement = (password: string) => {
    if (password.length >= 6) {
      setPasswordLengthRequirementMet(true);
    } else {
      setPasswordLengthRequirementMet(false);
    }
  };

  return (
    <div className="col-start-2 mt-2">
      <ul className="flex flex-col gap-x-2 text-xs sm:flex-row">
        <li
          className={
            passwordNumberRequirementMet
              ? "text-success"
              : "text-text-muted grayscale"
          }
        >
          <div className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            Zahl
          </div>
        </li>
        <li
          className={
            passwordUppercaseRequirementMet
              ? "text-success"
              : "text-text-muted grayscale"
          }
        >
          <div className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            Großbuchstabe
          </div>
        </li>
        <li
          className={
            passwordLowercaseRequirementMet
              ? "text-success"
              : "text-text-muted grayscale"
          }
        >
          <div className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            Kleinbuchstabe
          </div>
        </li>
        <li
          className={
            passwordLengthRequirementMet
              ? "text-success"
              : "text-text-muted grayscale"
          }
        >
          <div className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            &ge; 6 Zeichen
          </div>
        </li>
      </ul>
    </div>
  );
}
