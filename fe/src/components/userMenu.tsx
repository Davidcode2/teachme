import { Link } from "react-router-dom";
import userIcon from "../assets/icons/icons8-user-48.png";
import ArrowIcon from "../assets/icons/icons8-logout-50.png";
import ShuffleIcon from "../assets/icons/icons8-shuffle-48.png";
import DarkModeIcon from "../assets/icons/icons8-dark-mode-48.png";
import {
  useAccessTokenStore,
  useAvatarStore,
  useGlobalLoadingStore,
  useUserStore,
} from "../store";
import { useEffect, useState } from "react";

export default function UserMenu({
  sidebarShown = false,
}: {
  sidebarShown?: boolean;
}) {
  const user = useUserStore((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    useGlobalLoadingStore.setState({ loading: true });
    const res = fetch("/api/auth/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      },
    });
    res.then((response) => {
      useGlobalLoadingStore.setState({ loading: false });
      if (response.status === 200) {
        useAccessTokenStore.getState().setAccessToken("");
        useUserStore.getState().setUser(null);
      }
    });
  };

  useEffect(() => {
    const contextMenu = document.getElementById("context-menu");
    showMenu ? contextMenu?.classList.add("open") : contextMenu?.classList.remove("open");
  }, [showMenu]);

  const avatar = useAvatarStore.getState().avatar
    ? URL.createObjectURL(useAvatarStore.getState().avatar)
    : null;

  const toggleMenu = () => (showMenu ? setShowMenu(false) : setShowMenu(true));

  document.body.addEventListener("click", (e: any) => {
    const contextMenu = document.getElementById("context-menu");
    if (e.target.classList.contains("userMenu")) return;
    if (showMenu) {
      setShowMenu(false);
      contextMenu?.classList.remove("open");
    }
  });

  let displayName = "";
  if (user!.displayName) {
    displayName = user!.displayName;
  } else {
    displayName = "";
  }

  return (
    <div className="flex items-center">
      <div
        className={`mr-2 text-slate-400 ${sidebarShown ? "block" : "hidden lg:block"}`}
      >
        {displayName}
      </div>
      <button className="userMenu hover:cursor-pointer" onClick={toggleMenu}>
        <img
          className="userMenu min-w-5 rounded-full"
          src={avatar ? avatar : userIcon}
          width="30"
          alt="User"
        />
      </button>
        <div id="context-menu"  className="context-menu userMenu relative">
          <div className="userMenu absolute right-0 top-6 rounded-md border bg-white shadow-md">
            <div className="userMenu flex justify-center p-5">
              <ul className="userMenu flex flex-col gap-y-2 pr-4">
                <li
                  className="flex cursor-pointer gap-4 hover:text-sky-800"
                  onClick={logout}
                >
                  <img src={ArrowIcon} width="24" />
                  <span>Logout</span>
                </li>
                <li className="flex cursor-pointer gap-4 hover:text-sky-800">
                  <img src={ShuffleIcon} width="25" />
                  <Link to="login">Nutzer&nbsp;wechseln</Link>
                </li>
                <li className="flex cursor-pointer gap-4 hover:text-sky-800">
                  <img src={DarkModeIcon} width="25" />
                  <span>Dark Mode</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
}
