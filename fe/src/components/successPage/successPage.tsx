import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChevronIcon from "../../assets/icons/icons8-chevron-24.png";
import StatsCard from "./statsCard";

type Stats = {
  numberOfBoughtMaterials: number;
  numberOfCreatedMaterials: number;
};

export default function SuccessPage() {
  const [_, setSessionStatus] = useState("idle");
  const [stats, setStats] = useState<Stats>({} as Stats);

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

  const fetchStats = async () => {
    const response = await fetch("api/users/stats");
    const json: Stats = await response.json();
    setStats(json);
    console.log(json);
  };

  useEffect(() => {
    getSessionStatus();
    fetchStats();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="relative mx-4 my-8 mb-16 min-w-0 md:my-20">
          <div className="animate-gradient absolute inset-0 block min-w-0 bg-gradient-to-r from-purple-200 via-green-200 to-pink-300 blur-lg lg:blur-2xl" />
          <div className="relative flex min-w-0 flex-col gap-y-4 rounded-lg border border-slate-200 bg-white p-10 shadow-2xl">
            <div className="text-center text-5xl font-extrabold">Yay!</div>
            <div className="text-center">
              Das Material wurde erfolgreich zu
              <br />
              deiner Sammlung hinzugefügt.
            </div>
            <div className="flex justify-center gap-4">
              <StatsCard
                name="gekauft"
                amount={stats!.numberOfBoughtMaterials}
              />
              <StatsCard
                name="erstellt"
                amount={stats!.numberOfCreatedMaterials}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="group flex items-center">
                <img
                  className="transition:opacity w-0 h-4 rotate-180 scale-0 opacity-0 duration-200 ease-in-out group-hover:block group-hover:scale-100 group-hover:opacity-100 group-hover:w-4"
                  src={ChevronIcon}
                  alt=""
                />
                <Link
                  to="/materials"
                  className="text-blue-600 duration-200 ease-in-out hover:translate-x-[1px] hover:text-blue-800 hover:transition-transform"
                >
                  Weiter shoppen
                </Link>
              </div>
              <div className="group flex items-center">
                <img
                  className="transition:opacity w-0 h-4 rotate-180 scale-0 opacity-0 duration-200 ease-in-out group-hover:block group-hover:scale-100 group-hover:opacity-100 group-hover:w-4"
                  src={ChevronIcon}
                  alt=""
                />
                <Link
                  to="/materials/mine"
                  className="text-blue-600 duration-200 ease-in-out hover:translate-x-[1px] hover:text-blue-800 hover:transition-transform"
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
