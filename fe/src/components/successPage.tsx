import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

export default function SuccessPage() {
  const [_, setSessionStatus] = useState('idle');

  const getSessionStatus = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const response = await fetch(`api/stripe/session-status?session_id=${sessionId}`);
    const json = await response.json();
    setSessionStatus(json.status);
  };

  useEffect(() => {
    getSessionStatus();
  }, []);

  return (
    <>
      <div className="flex gap-10 justify-center items-center h-screen">
        <Link to="/materials">Weiter shoppen</Link>
        <div className="text-5xl">
          Yay! Du hast es geschafft!
        </div>
      </div>
    </>
  )
}
