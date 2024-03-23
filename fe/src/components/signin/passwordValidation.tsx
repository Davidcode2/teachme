import { useEffect, useState } from "react";
import CheckMarkIcon from '../../assets/icons/icons8-checkmark-48.png';

export default function PasswordValidation({ password }) {
  const [passwordLengthRequirementMet, setPasswordLengthRequirementMet] = useState(false);
  const [passwordUppercaseRequirementMet, setPasswordUppercaseRequirementMet] = useState(false);
  const [passwordLowercaseRequirementMet, setPasswordLowercaseRequirementMet] = useState(false);
  const [passwordNumberRequirementMet, setPasswordNumberRequirementMet] = useState(false);

  useEffect(() => {
    checkPasswordRequirements();
  }, [password]);

  const checkPasswordRequirements = () => {
    let current = password;
    checkPasswordLengthRequirement(current);
    checkPasswordUpperCaseRequirement(current);
    checkPasswordLowerCaseRequirement(current);
    checkPasswordNumberRequirement(current);
  }

  const checkPasswordNumberRequirement = (password: string) => {
    if (password.match(/.*[\d].*/)) {
      setPasswordNumberRequirementMet(true);
    } else {
      setPasswordNumberRequirementMet(false);
    }
  }

  const checkPasswordLowerCaseRequirement = (password: string) => {
    if (password.match(/.*[a-z].*/)) {
      setPasswordLowercaseRequirementMet(true);
    } else {
      setPasswordLowercaseRequirementMet(false);
    }
  }

  const checkPasswordUpperCaseRequirement = (password: string) => {
    if (password.match(/.*[A-Z].*/)) {
      setPasswordUppercaseRequirementMet(true);
    } else {
      setPasswordUppercaseRequirementMet(false);
    }
  }

  const checkPasswordLengthRequirement = (password: string) => {
    if (password.length >= 6) {
      setPasswordLengthRequirementMet(true);
    } else {
      setPasswordLengthRequirementMet(false);
    }
  }

  return (
    <div className="col-start-2 mt-2">
      <ul className="flex sm:flex-row flex-col text-xs gap-x-2">
        <li className={passwordNumberRequirementMet ? "text-green-600" : "text-gray-400 grayscale"}>
          <div className="flex items-center gap-1">
            <img src={CheckMarkIcon} width="15" alt="" />
            Zahl
          </div>
        </li>
        <li className={passwordUppercaseRequirementMet ? "text-green-600" : "text-gray-400 grayscale"}>
          <div className="flex items-center gap-1">
            <img src={CheckMarkIcon} width="15" alt="" />
            Großbuchstabe
          </div>
        </li>
        <li className={passwordLowercaseRequirementMet ? "text-green-600" : "text-gray-400 grayscale"}>
          <div className="flex items-center gap-1">
            <img src={CheckMarkIcon} width="15" alt="" />
            Kleinbuchstabe
          </div>
        </li>
        <li className={passwordLengthRequirementMet ? "text-green-600" : "text-gray-400 grayscale"}>
          <div className="flex items-center gap-1">
            <img src={CheckMarkIcon} width="15" alt="" />
            &ge; 6 Zeichen
          </div>
        </li>
      </ul>
    </div>
  )
}
