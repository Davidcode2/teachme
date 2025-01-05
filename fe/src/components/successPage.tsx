import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChevronIcon from "../assets/icons/icons8-chevron-24.png";

export default function SuccessPage() {
  const [_, setSessionStatus] = useState("idle");

  const getSessionStatus = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");
    const response = await fetch(
      `api/stripe/session-status?session_id=${sessionId}`,
    );
    const json = await response.json();
    setSessionStatus(json.status);
  };

  useEffect(() => {
    getSessionStatus();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="relative mx-4 my-8 mb-16 min-w-0 md:my-20">
          <div className="animate-gradient absolute inset-0 block min-w-0 bg-gradient-to-r from-purple-200 via-green-200 to-pink-300 blur-lg lg:blur-2xl" />
          <div className="relative flex min-w-0 flex-col gap-y-4 rounded-lg border border-slate-200 bg-white p-10 shadow-2xl">
            <div className="text-center text-5xl font-extrabold">Yay!</div>
            <div className="text-3xl">
              Das Material wurde erfolgreich zu
              <br />
              deiner Sammlung hinzugefügt.
            </div>
            <div className="flex gap-4">
              <div className="flex items-center">
                <img className="h-4 rotate-180"src={ChevronIcon} alt=""/>
                  <Link
                    to="/materials"
                    className="text-blue-600 hover:translate-x-1 hover:text-blue-800 hover:transition-transform"
                  >
                    Weiter shoppen
                  </Link>
              </div>
              <div className="flex items-center">
                <img className="h-4 rotate-180"src={ChevronIcon} alt=""/>
                  <Link
                    to="/materials/mine"
                    className="text-blue-600 hover:translate-x-1 hover:text-blue-800 hover:transition-transform"
                  >
                    Meine Materialien ansehen
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
