import userIcon from "../../assets/icons/icons8-user-48.png";
import ArrowIcon from "../../assets/icons/icons8-logout-50.png";
import ShuffleIcon from "../../assets/icons/icons8-shuffle-48.png";
import EditIcon from "../../assets/icons/icons8-edit-48.png";
import { useAvatarStore } from "../../store";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { parseIdJwt, switchUser } from "../../services/authService";
import CenteredModal from "../styling/centeredModal";
import ThemeToggle from "./themeToggle";
import EditUserName from "./editUserName";

export default function UserMenu({
  sidebarShown = false,
}: {
  sidebarShown?: boolean;
}) {
  const auth = useAuth();
  const user = parseIdJwt(auth.user?.id_token!);
  const [showMenu, setShowMenu] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const editNameRef = useRef<HTMLInputElement>(null);

  const keyCodeEnter = 13;
  const keycodeEscape = 27;

  useEffect(() => {
    const contextMenu = userMenuRef.current;
    showMenu
      ? contextMenu?.classList.add("open")
      : contextMenu?.classList.remove("open");
  }, [showMenu]);

  useEffect(() => {
    setAvatar(
      useAvatarStore.getState().avatar
        ? URL.createObjectURL(useAvatarStore.getState().avatar)
        : null,
    );
  }, []);

  const toggleMenu = () => (showMenu ? setShowMenu(false) : setShowMenu(true));

  document.body.addEventListener("click", (e: any) => {
    const contextMenu = userMenuRef.current;
    if (e.target.classList.contains("userMenu")) return;
    if (showMenu) {
      setShowMenu(false);
      contextMenu?.classList.remove("open");
    }
  });

  const onCloseButton = (e: any) => {
    if (
      e.key === "Enter" ||
      e.keyCode == keyCodeEnter ||
      e.keyCode == keycodeEscape
    ) {
      setShowMenu(false);
    }
  };

  document.body.addEventListener("keydown", onCloseButton);

  let displayName = "";
  if (user!.preferredUsername) {
    displayName = user!.preferredUsername;
  } else {
    displayName = "";
  }

  const handleEditUserName = () => {
    setEditUserName(true);
    setTimeout(() => {
      if (editNameRef.current) {
        editNameRef.current.focus();
      }
    }, 50);
  };

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
      <div ref={userMenuRef} className="context-menu userMenu">
        <CenteredModal>
          <div className="userMenu absolute rounded-md border border-slate-300 bg-white shadow-md dark:bg-slate-900 dark:text-white">
            <div className="userMenu flex justify-center p-10">
              <ul className="userMenu flex flex-col gap-y-3 pr-4 text-2xl">
                <li
                  className="flex cursor-pointer gap-4 hover:text-purple-700"
                  onClick={() => auth.signoutRedirect()}
                >
                  <img src={ArrowIcon} width="32" />
                  <button>Logout</button>
                </li>
                <li className="flex cursor-pointer gap-4 hover:text-purple-700">
                  <img src={ShuffleIcon} width="32" />
                  <button onClick={() => switchUser(auth)}>
                    Nutzer&nbsp;wechseln
                  </button>
                </li>
                <li
                  onClick={handleEditUserName}
                  className="userMenu flex cursor-pointer gap-4 hover:text-purple-700"
                >
                  <img src={EditIcon} width="32" />
                  <button className="userMenu">Name&nbsp;ändern</button>
                </li>
                <li
                  className="userMenu mr-2 text-slate-400"
                >
                  {editUserName && <EditUserName setEditUserName={setEditUserName} displayName={displayName} editNameRef={editNameRef} user={user} />}
                </li>
                <hr className="text-slate-200" />
                <div className="userMenu flex items-center gap-4 hover:text-purple-700">
                  <ThemeToggle showMenu={showMenu} />
                </div>
              </ul>
            </div>
          </div>
        </CenteredModal>
      </div>
    </div>
  );
}
