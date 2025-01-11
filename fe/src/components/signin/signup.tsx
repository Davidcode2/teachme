import { Form, Link, useNavigation } from "react-router";
import ChevronIcon from "../../assets/icons/icons8-chevron-24.png";
import PaperPlane from "../../assets/icons/icons8-paper-plane-64.png";
import CheckMarkIcon from "../../assets/icons/icons8-checkmark-48.png";
import ArrowIcon from "../../assets/icons/icons8-logout-50.png";
import { useRef, useState } from "react";
import PasswordValidation from "./passwordValidation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

function SignUpForm() {
  gsap.registerPlugin(MotionPathPlugin);

  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const tl: any = useRef();
  const navigation = useNavigation();

  const checkPasswordRequirements = (e: any) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.form.password.validity.valid);
  };

  const checkEmailRequirements = (e: any) => {
    setEmailValid(e.target.form.email.validity.valid);
  };

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true }).to(".paperPlane", {
      duration: 4,
      motionPath: {
        relative: true,
        path: [
          { x: 500, y: -400 },
          { x: -400, y: -100 },
          { x: 400, y: 400 },
          { x: 500, y: 0 },
        ],
        autoRotate: true,
        curviness: 2,
      },
    });
  });

  const toggleTimeline = () => {
    tl.current.play();
  };

  const pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,150}$";

  return (
    <>
      <Link to="/">
        <img className="p-4 md:px-20" src={ChevronIcon} alt="" />
      </Link>
      <div className="grid-cols-2 items-center justify-center lg:h-[80vh] xl:grid">
        <div>
          <h1 className="m-4 text-7xl font-extrabold md:m-20 md:text-9xl">
            Will
            <br />
            kom
            <br />
            men Lehrkraft
          </h1>
        </div>
        <div className="m-4 rounded-xl border border-slate-400 shadow-md md:m-20">
          <Form
            onSubmit={toggleTimeline}
            method="post"
            className="flex flex-col"
          >
            <button className="invisible ml-auto p-4">
              <img src={ArrowIcon} width="30" alt="" />
            </button>
            <div className="grid grid-cols-[.2fr_1fr] gap-y-1 px-4 py-4 sm:px-10 2xl:px-20">
              <label className="p-2" htmlFor="email">
                E-Mail
              </label>
              <input
                onChange={checkEmailRequirements}
                className="min-w-0 rounded-md border-b p-2"
                id="email"
                type="email"
                name="email"
                maxLength={80}
                required
              />
              <div className="relative bottom-8 right-1 z-50 col-start-2 w-4 justify-self-end">
                <img
                  src={CheckMarkIcon}
                  className={emailValid ? "absolute" : "hidden"}
                  width="30"
                  alt=""
                />
              </div>
              <label className="p-2" htmlFor="password">
                Passwort
              </label>
              <input
                onChange={checkPasswordRequirements}
                className="min-w-0 rounded-md border-b p-2"
                id="password"
                minLength={6}
                type="password"
                name="password"
                maxLength={150}
                pattern={pattern}
                required
              />
              <div className="relative bottom-8 right-1 z-50 col-start-2 w-4 justify-self-end">
                <img
                  src={CheckMarkIcon}
                  className={passwordValid ? "absolute" : "hidden"}
                  width="30"
                  alt=""
                />
              </div>
              <PasswordValidation password={password} />
            </div>
            <button type="submit" className="ml-auto p-4">
              <img src={ArrowIcon} width="30" alt="" />
            </button>
          </Form>
        </div>
        <div className="flex">
          <div
            className={navigation.state === "submitting" ? "block" : "hidden"}
          >
            <img className="paperPlane" src={PaperPlane} alt="Paper Plane" />
          </div>
        </div>
      </div>
      <div className="my-10 flex justify-center">
        <Link to="../login">
          <button>Bereits angemeldet? Hier einloggen!</button>
        </Link>
      </div>
    </>
  );
}

export default SignUpForm;
