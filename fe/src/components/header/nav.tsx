import { NavLink } from "react-router";
import logo from "../../assets/teachly_logo_color_gradient_bg_transparent.png";
import { useSidebarStore } from "../../store";
import { useAuth } from "react-oidc-context";

interface NavProps {
  materialsLink: string;
  myMaterialsLink: string;
}

export default function Nav({ materialsLink, myMaterialsLink }: NavProps) {
  const auth = useAuth();
  const closeOpenedMenus = () => {
    const hideSidebar = useSidebarStore.getState().hide;
    hideSidebar();
  };

  const myMaterialLinkButton = (
    <div className="font-handwriting decoration-gray-500 decoration-wavy decoration-1 underline-offset-4 hover:text-emerald-600 hover:underline">
      Meins
    </div>
  );

  return (
    <>
      <div className="z-40 flex items-center gap-x-6">
        <NavLink
          to={materialsLink}
          end
          className={({ isActive, isPending }) =>
            isPending ? "animate-pulse" : isActive ? "" : "border-none"
          }
          onClick={closeOpenedMenus}
        >
          <img
            className="transition hover:scale-105 hover:brightness-125"
            src={logo}
            alt="Teachly Logo"
            width="100"
          />
        </NavLink>

        {auth?.isAuthenticated && (
          <NavLink
            to={myMaterialsLink}
            end
            className={({ isActive, isPending }) =>
              isPending
                ? "animate-pulse"
                : isActive
                  ? "underline decoration-green-300 decoration-wavy decoration-1 underline-offset-4"
                  : "border-none"
            }
          >
            {myMaterialLinkButton}
          </NavLink>
        )}
      </div>
    </>
  );
}
