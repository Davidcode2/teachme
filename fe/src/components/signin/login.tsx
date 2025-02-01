import PaperPlane from "../../assets/icons/icons8-paper-plane-64.png";
import ChevronIcon from "../../assets/icons/icons8-chevron-24.png";
import { Link, useActionData, useNavigate, useNavigation } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef, useState } from "react";

function LoginForm() {
  const [showPlane, setShowPlane] = useState(false);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const loginSuccess = useActionData();
  const loopTween: any = useRef(undefined);
  const failTween: any = useRef(undefined);
  gsap.registerPlugin(TextPlugin);
  gsap.registerPlugin(MotionPathPlugin);

  if (navigation.state === "submitting" || navigation.state === "loading") {
    gsap.to(".textReplace", {
      duration: 1,
      text: {
        value: "Lädt...",
        newClass: "text-black",
      },
      ease: "none",
    });
  } else if (showPlane && navigation.state === "idle") {
    setTimeout(() => {
      gsap.to(".textReplace", {
        duration: 1,
        text: "Versuchs nochmal",
        ease: "none",
      });
    }, 3000);
  }

  useGSAP(() => {
    loopTween.current = gsap.to("#paperPlane", {
      paused: true,
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
    failTween.current = gsap.to("#paperPlane", {
      paused: true,
      duration: 1,
      motionPath: {
        path: [{ x: 100, y: 100 }],
        relative: true,
        autoRotate: true,
        curviness: 2,
      },
    });
  });

  const toggleTimeline = () => {
    setShowPlane(true);
    loopTween.current.play();
  };

  if (loginSuccess === false) {
    console.log("login failed");
    loopTween.current.pause();
    failTween.current.play();
    setTimeout(() => {
      failTween.current.pause();
    }, 900);
  }

  return (
    <>
      <Link to="/materials">
        <img className="p-4 md:px-20" src={ChevronIcon} alt="" />
      </Link>
      <div className="grid-cols-2 items-center justify-center lg:h-[80vh] xl:grid">
        <div>
          <h1
            id="heroText"
            className="m-4 text-7xl font-extrabold md:m-20 md:text-9xl"
          >
            Schön, dass du wieder da bist
          </h1>
        </div>
        <div className="flex">
          <div className={showPlane ? "block" : "hidden"}>
            <img
              id="paperPlane"
              className={loginSuccess === false ? "" : ""}
              src={PaperPlane}
              alt="Paper Plane"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
