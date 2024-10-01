import { NavLink, Outlet } from "react-router-dom";
import Materials from "../materials/materials";

export default function Mine() {

  return (
    <><nav className="px-10 pb-4 gap-x-10 flex text-lg text-black ">
      <NavLink className="font-handwriting decoration-wavy hover:underline decoration-gray-500 hover:text-emerald-600 underline-offset-4 decoration-1"
        to={"/materials/mine"}>Gekauft</NavLink>
      <NavLink to={"/materials/mine/workspace"} className="font-handwriting decoration-wavy hover:underline decoration-gray-500 hover:text-emerald-600 underline-offset-4 decoration-1">Erstellt</NavLink>
    </nav >
      <Outlet />
    </>
  )

}

