import { Link, NavLink } from 'react-router-dom';
import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png";
import plus from "../../assets/addPlusGradient.png";
import UserIcon from '../../assets/icons/icons8-user-32.png';
import { useSearchState, useSidebarStore, useUserStore } from '../../store';
import Nav from './nav';
import UserMenu from '../userMenu';
import { useState } from 'react';
import Search from './search/search';

function Header() {
  const user = useUserStore((state) => state.user);
  const setSidebarShown = useSidebarStore((state) => state.toggleSidebar);
  const [showSearch, setShowSearch] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);
  let searchString = useSearchState((state: any) => state.searchString);

  const toggleSearch = () => {
    if (!showSearch) {
      setShowSearch(true);
    }
  }

  if (!eventListenerRegistered) {
    document.body.addEventListener('click', function(event: any) {
      if (event.target.closest('.searchBar')) return;
      if (event.target.closest('.searchBox')) return;
      setShowSearch(false);
      setEventListenerRegistered(true);
    });
  }

  const navigation = <Nav materialsLink="materials" myMaterialsLink={user ? "materials/mine" : "login"}></Nav>;

  return (
    <>
      {showSearch && <div className="fixed w-screen h-screen backdrop-blur-sm"><Search /></div>}
      <div className="p-4">
        <div className="flex justify-between gap-1">
          <div className="hidden md:flex items-center gap-2">
            {navigation}
          </div>
          <div className="flex gap-2 items-center">
            <input readOnly value={searchString} onClick={toggleSearch} className="focus:outline-none hover:scale-y-125 transition searchBar min-w-0 rounded-full border border-slate-200 shadow-sm py-2 px-4" type="text" />
            <NavLink
              className={({ isActive }) => isActive ? "text-blue-400 border-blue-400 border rounded-lg" : "border-none"}
              to={user ? "materials/add" : "login"}>
              <button className="border border-slate-200 shadow-sm rounded-lg flex"><div className="hover:scale-125 hover:brightness-110 transition px-4 py-2"><img  src={plus} alt="" width="20"/></div></button>
            </NavLink>
          </div>
          <div className="flex items-center gap-2">
            {!user && <Link to="login" className="" ><img className="min-w-5" src={UserIcon} width="30" alt="User" /></Link>}
            {user &&
              <>
                <UserMenu />
                <button className="" onClick={setSidebarShown}><img src={hamburgerIcon} width="30" alt="" /></button>
              </>
            }
          </div>
        </div>
        <div className="flex md:hidden mt-4 gap-2">
          {navigation}
        </div>
      </div>
    </>
  )
}

export default Header;
