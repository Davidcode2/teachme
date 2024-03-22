import { Form, Link } from 'react-router-dom';
import ChevronIcon from '../../assets/icons/icons8-chevron-24.png';
import CheckMarkIcon from '../../assets/icons/icons8-checkmark-48.png';
import ArrowIcon from '../../assets/icons/icons8-logout-50.png';
import { useState } from 'react';
import PasswordValidation from './passwordValidation';

function SignUpForm() {
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  const checkPasswordRequirements = (e) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.form.password.validity.valid);
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
              <input onChange={checkPasswordRequirements} className="p-2 rounded-md border-b" id="password" minLength="6" type="password" name="password" maxLength="20" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$" required />
              <div className="relative">
                <img src={CheckMarkIcon} className={passwordValid ? "absolute" : "hidden"} width="15" alt="" />
              </div>
              <PasswordValidation password={password} />
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

