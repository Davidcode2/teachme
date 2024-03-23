import { Form, Link, useNavigation } from 'react-router-dom';
import ChevronIcon from '../../assets/icons/icons8-chevron-24.png';
import PaperPlane from '../../assets/icons/icons8-paper-plane-64.png';
import CheckMarkIcon from '../../assets/icons/icons8-checkmark-48.png';
import ArrowIcon from '../../assets/icons/icons8-logout-50.png';
import { useRef, useState } from 'react';
import PasswordValidation from './passwordValidation';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";


function SignUpForm() {
  gsap.registerPlugin(MotionPathPlugin)

  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const container = useRef();
  const tl = useRef();

  const navigation = useNavigation();
  console.log(navigation);
  console.log(navigation.state);

  const checkPasswordRequirements = (e) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.form.password.validity.valid);
  }

  const checkEmailRequirements = (e) => {
    setEmailValid(e.target.form.email.validity.valid);
  }

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true })
      .to(".paperPlane",
        {
          duration: 4,
          motionPath: {
            relative: true,
            path: [{ x: 500, y: -400, }, { x: -400, y: -100 }, { x: 400, y: 400 }, { x: 500, y: 0 }],
            autoRotate: true,
            curviness: 2,
          }
        });
  });

  const toggleTimeline = (() => {
    tl.current.play();
  });


  return (
    <>
      <Link to="/"><img className="p-4 md:px-20" src={ChevronIcon} alt="" /></Link>
      <div className="lg:h-[80vh] xl:grid grid-cols-2 justify-center items-center">
        <div>
          <h1 className="m-4 md:m-20 text-7xl md:text-9xl font-extrabold">Will<br />kom<br />men Lehrkraft</h1>
        </div>
        <div className="border border-slate-400 rounded-xl shadow-md md:m-20 m-4">
          <Form onSubmit={toggleTimeline} method="post" className="flex flex-col">
            <button className="ml-auto p-4 invisible"><img src={ArrowIcon} width="30" alt="" /></button>
            <div className="grid grid-cols-[.2fr_1fr] gap-y-1 px-4 sm:px-10 2xl:px-20 py-4">
              <label className="p-2" htmlFor="email">E-Mail</label>
              <input onChange={checkEmailRequirements} className="p-2 rounded-md border-b" id="email" type="email" name="email" maxLength="80" required />
              <div className="col-start-2 justify-self-end w-4 bottom-8 right-1 z-50 relative">
                <img src={CheckMarkIcon} className={emailValid ? "absolute" : "hidden"} width="30" alt="" />
              </div>
              <label className="p-2" htmlFor="password">Password</label>
              <input onChange={checkPasswordRequirements} className="p-2 rounded-md border-b" id="password" minLength="6" type="password" name="password" maxLength="20" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$" required />
              <div className="col-start-2 justify-self-end w-4 bottom-8 right-1 z-50 relative">
                <img src={CheckMarkIcon} className={passwordValid ? "absolute" : "hidden"} width="30" alt="" />
              </div>
              <PasswordValidation password={password} />
            </div>
            <button type="submit" className="ml-auto p-4"><img src={ArrowIcon} width="30" alt="" /></button>
          </Form>
        </div>
        <div className="flex">
          <div className={navigation.state === "submitting" ? "block" : "hidden"}>
            <img className="paperPlane" src={PaperPlane} alt="Paper Plane" />
          </div>
        </div>
      </div>
      <div className="flex justify-center my-10">
        <Link to="../login"><button>Already Signed up? Login here!</button></Link>
      </div>
    </>
  )
}

export default SignUpForm;

