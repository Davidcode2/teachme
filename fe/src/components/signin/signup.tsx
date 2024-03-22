import { Form, Link } from 'react-router-dom';
import ChevronIcon from '../../assets/icons/icons8-chevron-24.png';
import ArrowIcon from '../../assets/icons/icons8-logout-50.png';
import CheckMarkIcon from '../../assets/icons/icons8-checkmark-48.png';
import { useState } from 'react';

function SignUpForm() {
  const [passwordLengthRequirementMet, setPasswordLengthRequirementMet] = useState(false);
  const [passwordUppercaseRequirementMet, setPasswordUppercaseRequirementMet] = useState(false);
  const [passwordLowercaseRequirementMet, setPasswordLowercaseRequirementMet] = useState(false);
  const [passwordNumberRequirementMet, setPasswordNumberRequirementMet] = useState(false);

  const checkPasswordRequirements = (e) => {
    console.log(e.target.value);
    let current = e.target.value;
    checkPasswordLengthRequirement(current);
    checkPasswordUpperCaseRequirement(current);
    checkPasswordLowerCaseRequirement(current);
    checkPasswordNumberRequirement(current);
  }

  const checkPasswordNumberRequirement = (password: string) => {
    console.log(password.match(/.*[\d].*/));
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
    if (password.length >= 8) {
      setPasswordLengthRequirementMet(true);
    } else {
      setPasswordLengthRequirementMet(false);
    }
  }

  return (
    <>
      <Link to="/"><img className="p-4 md:px-20" src={ChevronIcon} alt="" /></Link>
      <div className="lg:h-[80vh] xl:grid grid-cols-2 justify-center items-center">
        <div>
          <h1 className="m-4 md:m-20 text-7xl md:text-9xl font-extrabold">Will<br />kom<br />men Lehrkraft</h1>
        </div>
        <div className="border border-slate-400 rounded-xl shadow-md md:m-20 m-4">
          <Form method="post" className="flex flex-col">
            <button className="ml-auto p-4 invisible"><img src={ArrowIcon} width="30" alt="" /></button>
            <div className="grid grid-cols-[.2fr_1fr] gap-y-1 px-4 sm:px-10 2xl:px-20 py-4">
              <label className="p-2" htmlFor="email">E-Mail</label>
              <input className="p-2 rounded-md border-b" id="email" type="email" name="email" maxLength="80" required />
              <label className="p-2" htmlFor="password">Password</label>
              <input onChange={checkPasswordRequirements} className="p-2 rounded-md border-b" id="password" minLength="6" type="password" name="password" maxLength="20" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" required />
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
                      &gt; 8 Zeichen
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <button type="submit" className="ml-auto p-4"><img src={ArrowIcon} width="30" alt="" /></button>
          </Form>
        </div>
      </div>
      <div className="flex justify-center my-10">
        <Link to="../login"><button>Already Signed up? Login here!</button></Link>
      </div>
    </>
  )
}

export default SignUpForm;

