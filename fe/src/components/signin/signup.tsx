import { Form, Link, useNavigation } from "react-router";
import { ChevronLeft, Send, Check, ArrowRight } from "lucide-react";
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
  const tl: any = useRef(undefined);
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
        <ChevronLeft className="p-4 md:px-20" />
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
        <div className="border-border m-4 rounded-xl border shadow-md md:m-20">
          <Form
            onSubmit={toggleTimeline}
            method="post"
            className="flex flex-col"
          >
            <button className="invisible ml-auto p-4">
              <ArrowRight className="h-8 w-8" />
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
              <div className="relative right-1 bottom-8 z-50 col-start-2 w-4 justify-self-end">
                <Check
                  className={`absolute h-8 w-8 ${emailValid ? "block" : "hidden"}`}
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
              <div className="relative right-1 bottom-8 z-50 col-start-2 w-4 justify-self-end">
                <Check
                  className={`absolute h-8 w-8 ${passwordValid ? "block" : "hidden"}`}
                />
              </div>
              <PasswordValidation password={password} />
            </div>
            <button type="submit" className="ml-auto p-4">
              <ArrowRight className="h-8 w-8" />
            </button>
          </Form>
        </div>
        <div className="flex">
          <div
            className={navigation.state === "submitting" ? "block" : "hidden"}
          >
            <Send className="paperPlane h-16 w-16" />
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
