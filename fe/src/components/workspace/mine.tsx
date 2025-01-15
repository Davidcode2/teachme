import { useEffect } from "react";
import { NavLink, Outlet } from "react-router";

export default function Mine() {
  useEffect(() => {
    setTimeout(() => {
      const rootElement = document.getElementById("fade_in_element");
      rootElement?.classList.add("opacity-100");
    }, 200);
  }, []);

  return (
    <>
      <div
        id="fade_in_element"
        className="sm:mx-4 min-h-screen rounded-md border border-gray-200 bg-slate-100 pt-8 opacity-0 shadow-xl transition-opacity duration-700 md:mx-0 md:ml-8 md:rounded-none md:rounded-l-md"
      >
        <nav className="flex gap-x-10 px-10 pb-4 text-lg text-black ">
          <NavLink
            className="font-handwriting decoration-gray-500 decoration-wavy decoration-1 underline-offset-4 hover:text-emerald-600 hover:underline"
            to={"/materials/mine"}
          >
            Gekauft
          </NavLink>
          <NavLink
            to={"/materials/mine/workspace"}
            className="font-handwriting decoration-gray-500 decoration-wavy decoration-1 underline-offset-4 hover:text-emerald-600 hover:underline"
          >
            Erstellt
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </>
  );
}
