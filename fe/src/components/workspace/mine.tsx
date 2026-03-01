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
        className="border-border dark:bg-surface-raised bg-surface-subtle min-h-screen rounded-md border pt-8 opacity-0 shadow-xl transition-opacity duration-700 sm:mx-4 md:mx-0 md:ml-8 md:rounded-none md:rounded-l-md"
      >
        <nav className="text-text-primary flex gap-x-10 px-10 pb-4 text-lg">
          <NavLink
            className={({ isActive }) => {
              return isActive
                ? "font-handwriting text-success decoration-border hover:text-success underline decoration-wavy decoration-1 underline-offset-4 hover:underline"
                : "font-handwriting decoration-border hover:text-success decoration-wavy decoration-1 underline-offset-4 hover:underline";
            }}
            to={"/materials/mine/bought"}
          >
            Gekauft
          </NavLink>
          <NavLink
            to={"/materials/mine/workspace"}
            className={({ isActive }) => {
              return isActive
                ? "font-handwriting text-success decoration-border hover:text-success underline decoration-wavy decoration-1 underline-offset-4 hover:underline"
                : "font-handwriting decoration-border hover:text-success decoration-wavy decoration-1 underline-offset-4 hover:underline";
            }}
          >
            Erstellt
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </>
  );
}
