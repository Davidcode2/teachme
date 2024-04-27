import { NavLink } from "react-router-dom";
import logo from "../../assets/teachly_logo_color_gradient_bg_transparent.png"

interface NavProps {
  materialsLink: string;
  myMaterialsLink: string;
}

export default function Nav({ materialsLink, myMaterialsLink }: NavProps) {
  return (
    <>
      <div className="flex gap-x-6 items-center">
        <NavLink to={materialsLink} end
          className={({ isActive, isPending }) =>
            isPending ? "animate-pulse" : isActive ? "" : "border-none"
          }
        ><img className="hover:brightness-125" src={logo} alt="" width="100" /></NavLink>
        <NavLink to={myMaterialsLink} end
          className={({ isActive, isPending }) =>
            isPending ? "animate-pulse" : isActive ? "decoration-wavy underline decoration-green-300 underline-offset-4 decoration-1" : "border-none"
          }
        ><div className="font-handwriting decoration-wavy hover:underline decoration-gray-500 hover:text-emerald-600 underline-offset-4 decoration-1">Meins</div></NavLink>
      </div>
    </>

  )
}
