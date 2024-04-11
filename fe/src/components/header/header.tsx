import { Link, NavLink } from 'react-router-dom';
import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png"
import UserIcon from '../../assets/icons/icons8-user-32.png';
import { useSidebarStore, useUserStore } from '../../store';
import Nav from './nav';
import UserMenu from '../userMenu';
import { useState } from 'react';
import Search from './search';
import { gsap } from 'gsap';

function Header() {
  const user = useUserStore((state) => state.user);
  const setSidebarShown = useSidebarStore((state) => state.toggleSidebar);
  const [showSearch, setShowSearch] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);

  const toggleSearch = () => {
    if (!showSearch) {
      console.log("show serach")
      setShowSearch(true);
    }
  }

  if (!eventListenerRegistered) {
    document.body.addEventListener('click', function(event) {
      if (event.target.closest('.searchBar')) return;
      if (event.target.closest('.searchBox')) return;
      let tl = gsap.timeline({
        onComplete: () => {
          setShowSearch(false);
          gsap.set('.searchScreenContainer', { opacity: 100, y: 0, delay: 0.1 });
        }
      });
      tl.to('.searchScreenContainer', { opacity: 0, duration: 0.5 });
    });
    setEventListenerRegistered(true);
  }

  if (!user) return (
    <>
      <div className="fixed searchScreenContainer">
        {showSearch ? <div className="fixed w-screen h-screen"><Search /></div> : <></>}
      </div>
      <div className="p-4">
        <div className="flex justify-between gap-1">
          <div className="hidden md:flex items-center gap-2">
            <Nav materialsLink="materials" myMaterialsLink="login"></Nav>
          </div>
          <div className="flex gap-2">
            <input onClick={toggleSearch} className="searchBar min-w-0 rounded-full border border-slate-200 shadow-sm py-2 px-4" type="text" />
            <NavLink
              to="login"><button className="border border-slate-200 shadow-sm rounded-lg px-4 py-2">Add</button></NavLink>
          </div>
          <div className="flex items-center gap-2">
            <Link to="login" className="" ><img className="min-w-5" src={UserIcon} width="30" alt="User" /></Link>
          </div>
        </div>
        <div className="flex md:hidden mt-4 gap-2">
          <Nav materialsLink="materials" myMaterialsLink="login"></Nav>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed searchScreenContainer">
        {showSearch ? <div className="fixed w-screen h-screen backdrop-blur-sm"><Search /></div> : <></>}
      </div>
      <div className="p-4">
        <div className="flex justify-between gap-1">
          <div className="hidden md:flex items-center gap-2">
            <Nav materialsLink="materials" myMaterialsLink="materials/mine"></Nav>
          </div>
          <div className="flex gap-2">
            <input onClick={toggleSearch} className="searchBar min-w-0 rounded-full border border-slate-200 shadow-sm py-2 px-4" type="text" />
            <NavLink className={({ isActive }) => isActive ? "text-blue-400 border-blue-400 border rounded-lg" : "border-none"}
              to="materials/add"><button className="border border-slate-200 shadow-sm rounded-lg px-4 py-2">Add</button></NavLink>
          </div>
          <div className="flex items-center gap-2">
            <UserMenu />
            <button className="" onClick={setSidebarShown}><img src={hamburgerIcon} width="30" alt="" /></button>
          </div>
        </div>
        <div className="flex md:hidden mt-4 gap-2">
          <Nav materialsLink="materials" myMaterialsLink="materials/mine"></Nav>
        </div>
      </div>
    </>
  )
}

export default Header;
