import { NavLink } from "react-router";
import { ChevronRight } from "lucide-react";

export default function IconLink({
  linkText: linkText,
  link: link,
}: {
  linkText: string;
  link: string;
}) {
  return (
    <div className="group flex items-center">
      <ChevronRight
        className="h-4 w-0 scale-0 opacity-0 transition-all duration-200 ease-in-out group-hover:block group-hover:w-4 group-hover:scale-100 group-hover:opacity-100"
      />
      <NavLink
        to={link}
        className="text-accent hover:text-accent-emphasis duration-200 ease-in-out hover:translate-x-[1px] hover:transition-transform"
      >
        {linkText}
      </NavLink>
    </div>
  );
}
