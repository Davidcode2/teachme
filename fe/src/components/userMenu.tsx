import { Link } from 'react-router-dom';
import userIcon from '../assets/icons/icons8-user-48.png';
import ArrowIcon from '../assets/icons/icons8-logout-50.png';
import ShuffleIcon from '../assets/icons/icons8-shuffle-48.png';
import DarkModeIcon from '../assets/icons/icons8-dark-mode-48.png';
import { useAccessTokenStore, useAvatarStore, useGlobalLoadingStore, useUserStore } from '../store';
import { useState } from 'react';

export default function UserMenu({sidebarShown=false}: {sidebarShown?: boolean}) {
  const user = useUserStore((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    useGlobalLoadingStore.setState({ loading: true });
    const res = fetch('/api/auth/logout', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      }
    });
    res.then((response) => {
      useGlobalLoadingStore.setState({ loading: false });
      if (response.status === 200) {
        useAccessTokenStore.getState().setAccessToken('');
        useUserStore.getState().setUser(null);
      }
    });
  }

  const avatar = useAvatarStore.getState().avatar
    ? URL.createObjectURL(useAvatarStore.getState().avatar)
    : null

  const toggleMenu = () => showMenu ? setShowMenu(false) : setShowMenu(true);

  document.body.addEventListener('click', (e: any) => {
    if (e.target.classList.contains('userMenu')) return;
    if (showMenu) {
      setShowMenu(false);
    }
  });

  let email = '';
  if (user.email) {
    email = user.email;
  } else {
    email = '';
  }

  return (
    <div className="flex items-center">
      <div className={`text-slate-400 mr-2 ${sidebarShown ? "block" : "hidden lg:block"}`}>{email}</div>
      <button className="userMenu hover:cursor-pointer" onClick={toggleMenu} >
        <img className="userMenu min-w-5 rounded-full" src={avatar ? avatar : userIcon} width="30" alt="User" />
      </button>
      {showMenu ?
        <div className="userMenu relative">
          <div className="userMenu absolute bg-white border rounded-md shadow-md top-6 right-0">
            <div className="userMenu flex justify-center p-5">
              <ul className="userMenu flex flex-col gap-y-2 pr-4">
                <li className="hover:text-sky-800 cursor-pointer flex gap-4" onClick={logout}>
                  <img src={ArrowIcon} width="24" />
                  <span>Logout</span>
                </li>
                <li className="hover:text-sky-800 cursor-pointer flex gap-4">
                  <img src={ShuffleIcon} width="25" />
                  <Link to="login">Nutzer&nbsp;wechseln</Link></li>
                <li className="hover:text-sky-800 cursor-pointer flex gap-4">
                  <img src={DarkModeIcon} width="25" />
                  <span>Dark Mode</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        : <></>
      }
    </div>
  )
}
