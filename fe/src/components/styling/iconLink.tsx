import { NavLink } from "react-router";
import ChevronIcon from "../../assets/icons/icons8-chevron-24.png";

export default function IconLink({linkText: linkText, link: link}: {linkText: string, link: string}) {
  return (
  <div className="group flex items-center">
    <img
      className="transition:opacity h-4 w-0 rotate-180 scale-0 opacity-0 duration-200 ease-in-out group-hover:block group-hover:w-4 group-hover:scale-100 group-hover:opacity-100"
      src={ChevronIcon}
      alt=""
    />
    <NavLink
      to={link}
      className="text-blue-600 duration-200 ease-in-out hover:translate-x-[1px] hover:text-blue-800 hover:transition-transform"
    >
      {linkText}
    </NavLink>
  </div>
  );
}
