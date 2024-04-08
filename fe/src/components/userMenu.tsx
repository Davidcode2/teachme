import { Link } from 'react-router-dom';
import { useAccessTokenStore, useUserStore } from '../store';
import UserIconWhale from '../assets/userIconWhale.png';
import { useState } from 'react';

export default function UserMenu() {
  const user = useUserStore((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    const res = fetch('/api/auth/logout', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      }
    });
  }

  const toggleMenu = () => showMenu ? setShowMenu(false) : setShowMenu(true);

  document.body.addEventListener('click', (e) => {
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
      <div className="text-slate-400 hidden sm:block mr-2">{email}</div>
      <div className="hidden sm:block userMenu" onClick={toggleMenu} ><img className="userMenu min-w-5 rounded-full" src={UserIconWhale} width="30" alt="User" /></div>
      {showMenu ?
        <div className="userMenu relative">
          <div className="userMenu absolute bg-white border rounded-md shadow-md top-6 right-0">
            <div className="userMenu flex justify-center p-5">
              <ul className="userMenu flex flex-col gap-y-2">
                <li className="hover:text-sky-800 cursor-pointer" onClick={logout}>Logout</li>
                <li className="hover:text-sky-800 cursor-pointer"><Link to="login">Nutzer&nbsp;wechseln</Link></li>
                <li className="hover:text-sky-800 cursor-pointer">Dark Mode</li>
              </ul>
            </div>
          </div>
        </div>
        : <></>
      }
    </div>
  )
}
