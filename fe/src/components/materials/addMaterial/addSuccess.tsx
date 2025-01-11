import { Form, NavLink } from "react-router";
import { useUserStore } from "../../../store";
import ChevronIcon from "../../../assets/icons/icons8-chevron-24.png";

export default function AddMaterialSuccess() {
  const userStore = useUserStore();
  const hasDisplayName = userStore.user?.displayName;

  const getUsername = (
    <div className="flex min-w-0 flex-col justify-center">
      <p className="text-center">
        Damit dein Material von anderen Nutzern gefunden werden kann, füge bitte
        einen Nutzernamen hinzu.
      </p>
      <Form method="patch">
        <input
          className="mx-auto my-8 min-w-0 rounded-md border border-slate-200 px-4 py-2 shadow-sm"
          type="text"
          placeholder="Nutzername"
          name="displayName"
        />
      </Form>
    </div>
  );

  return (
    <div className="flex min-w-0 justify-center">
      <div className="relative mx-4 my-8 mb-16 min-w-0 md:my-20">
        <div className="animate-gradient absolute inset-0 block min-w-0 bg-gradient-to-r from-purple-200 via-green-200 to-pink-300 blur-lg lg:blur-2xl" />
        <div className="relative flex min-w-0 flex-col gap-y-4 rounded-lg border border-slate-200 bg-white p-10 shadow-2xl">
          <h4 className="pb-4 text-center text-2xl font-bold">
            Herzlichen Glückwunsch!
          </h4>
          <p>Dein Material wurde erfolgreich hinzugefügt.</p>
          {!hasDisplayName && getUsername}
          <div className="flex flex-col">
            <div className="group flex items-center">
              <img
                className="transition:opacity scale-0 w-0 h-4 rotate-180 opacity-0 duration-200 ease-in-out group-hover:block group-hover:opacity-100 group-hover:w-4 group-hover:scale-100"
                src={ChevronIcon}
                alt=""
              />
              <NavLink
                to="/materials/add"
                className="text-blue-600 duration-200 ease-in-out hover:translate-x-[1px] hover:text-blue-800 hover:transition-transform"
              >
                Weiteres Material hinzufügen
              </NavLink>
            </div>
            <div className="group flex items-center">
              <img
                className="transition:opacity scale-0 w-0 h-4 rotate-180 opacity-0 duration-200 ease-in-out group-hover:block group-hover:opacity-100 group-hover:w-4 group-hover:scale-100"
                src={ChevronIcon}
                alt=""
              />
              <NavLink
                to="/materials/mine/workspace"
                className="text-blue-600 duration-200 ease-in-out hover:translate-x-[1px] hover:text-blue-800 hover:transition-transform"
              >
                Dein Werk bewundern
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
