import { NavLink } from "react-router-dom";
import { useUserStore } from "../../../store";

export default function AddMaterialSuccess() {
  const userStore = useUserStore();
  const hasDisplayName = userStore.user?.displayName;

  const getUsername = (
    <div className="flex flex-col justify-center min-w-0">
      <p className="text-center">
        Damit dein Material von anderen Nutzern gefunden werden kann, füge bitte
        einen Nutzernamen hinzu.
      </p>
      <input
        className="mx-auto rounded-md border border-slate-200 px-4 py-2 my-8 shadow-sm min-w-0"
        type="text"
        placeholder="Nutzername"
      />
    </div>
  );

  return (
    <div className="flex min-w-0 justify-center">
      <div className="relative mx-4 my-8 mb-16 min-w-0 md:my-20">
        <div className="animate-gradient absolute inset-0 block min-w-0 bg-gradient-to-r from-purple-200 via-green-200 to-pink-300 blur-lg lg:blur-2xl" />
        <div className="relative min-w-0 flex gap-y-4 flex-col rounded-lg border border-slate-200 bg-white p-10 shadow-2xl">
          <h4 className="pb-4 text-center text-2xl font-bold">
            Herzlichen Glückwunsch!
          </h4>
          <p>Dein Material wurde erfolgreich hinzugefügt.</p>
          {!hasDisplayName && getUsername}
          <div className="flex flex-col">
            <NavLink to="/materials/add" className="text-blue-800">
              Weiteres Material hinzufügen
            </NavLink>
            <NavLink to="/materials/mine/workspace" className="text-blue-800">
              Dein Werk bewundern
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
