import { Form } from "react-router";
import CheckMarkIcon from "../assets/icons/icons8-checkmark-48.png";
import userIcon from "../assets/icons/icons8-user-48.png";
import ArrowIcon from "../assets/icons/icons8-logout-50.png";
import ShuffleIcon from "../assets/icons/icons8-shuffle-48.png";
import EditIcon from "../assets/icons/icons8-edit-48.png";
import { useAvatarStore, useUserStore } from "../store";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { parseIdJwt, switchUser } from "../services/authService";
import { customFetch } from "../actions/customFetch";
import CenteredModal from "./styling/centeredModal";
import ThemeToggle from "./themeToggle";

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

  let displayName = "";
  if (user!.preferredUsername) {
    displayName = user!.preferredUsername;
  } else {
    displayName = "";
  }

  const handleDisplayNameSubmit = async (e: any) => {
    setEditUserName(false);
    const res = await customFetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName: e.target.displayName.value }),
    });
    if (res.status === 200) {
      useUserStore.getState().setUser({
        ...user,
        displayName: e.target.displayName.value,
      });
    }
  };

  const changeDisplayNameForm = (
    <Form className="flex gap-1" onSubmit={handleDisplayNameSubmit}>
      <input
        className="max-w-40 min-w-0 rounded-lg border border-slate-200 p-1 text-sm text-stone-900 shadow-sm"
        type="text"
        placeholder={displayName || "Dein Name hier! Wow!"}
        name="displayName"
      />
      <button
        className="min-w-0 rounded-lg border border-slate-200 bg-green-200 p-1 shadow-sm hover:bg-green-300"
        type="submit"
      >
        <img src={CheckMarkIcon} width="20" />
      </button>
      <button
        className="font-handwriting min-w-0 rounded-lg border border-slate-200 bg-red-200 p-1 px-2 shadow-sm hover:bg-red-300"
        onClick={() => setEditUserName(false)}
      >
        X
      </button>
    </Form>
  );

  return (
    <div className="flex items-center">
      <div
        className={`mr-2 text-slate-400 ${sidebarShown ? "block" : "hidden lg:block"}`}
      >
        {editUserName ? changeDisplayNameForm : displayName}
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
          <div className="userMenu absolute rounded-md border border-slate-300 bg-white shadow-md dark:bg-neutral-800 dark:text-white">
            <div className="userMenu flex justify-center p-10">
              <ul className="userMenu flex flex-col gap-y-3 pr-4 text-2xl">
                <li
                  className="flex cursor-pointer gap-4 hover:text-purple-700"
                  onClick={() => auth.signoutRedirect()}
                >
                  <img src={ArrowIcon} width="32" />
                  <span>Logout</span>
                </li>
                <li className="flex cursor-pointer gap-4 hover:text-purple-700">
                  <img src={ShuffleIcon} width="32" />
                  <button onClick={() => switchUser(auth)}>
                    Nutzer&nbsp;wechseln
                  </button>
                </li>
                <li className="userMenu flex items-center gap-4 hover:text-purple-700">
                  <ThemeToggle />
                </li>
                <li
                  onClick={() => setEditUserName(true)}
                  className="flex cursor-pointer gap-4 hover:text-purple-700"
                >
                  <img src={EditIcon} width="32" />
                  <button>Name&nbsp;ändern</button>
                </li>
              </ul>
            </div>
          </div>
        </CenteredModal>
      </div>
    </div>
  );
}
