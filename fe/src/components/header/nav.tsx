import { NavLink } from "react-router-dom";

export default function Nav({materialsLink, myMaterialsLink}) {
  return (
    <>
      <NavLink to={materialsLink} end
        className={({ isActive, isPending }) =>
          isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
        }
      >Browse</NavLink>
      <NavLink to={myMaterialsLink} end
        className={({ isActive, isPending }) =>
          isPending ? "border-b border-slate-200" : isActive ? "border-b border-blue-800" : "border-none"
        }
      >Mine</NavLink>
    </>

  )
}
