import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Mine() {

  useEffect(() => {
    setTimeout(() => {
      const rootElement = document.getElementById("fade_in_element");
      rootElement?.classList.add("opacity-100");
    }, 200);
  }, []);

  return (
    <>
      <div id="fade_in_element" className="border border-gray-200 ml-8 pt-8 bg-slate-100 rounded-md shadow-xl min-h-screen transition-opacity duration-700 opacity-0">
        <nav className="px-10 pb-4 gap-x-10 flex text-lg text-black ">
          <NavLink className="font-handwriting decoration-wavy hover:underline decoration-gray-500 hover:text-emerald-600 underline-offset-4 decoration-1"
            to={"/materials/mine"}>Gekauft</NavLink>
          <NavLink to={"/materials/mine/workspace"} className="font-handwriting decoration-wavy hover:underline decoration-gray-500 hover:text-emerald-600 underline-offset-4 decoration-1">Erstellt</NavLink>
        </nav >
        <Outlet />
      </div >
    </>
  )

}

