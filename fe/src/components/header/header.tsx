import { Link, NavLink } from 'react-router-dom';
import plus from "../../assets/addPlusGradient.png";
import UserIcon from '../../assets/icons/icons8-user-48.png';
import { useSearchState, useUserStore } from '../../store';
import Nav from './nav';
import UserMenu from '../userMenu';
import { useEffect, useState } from 'react';
import Search from './search/search';
import SearchService from '../../services/searchService';
import ShoppingCartIcon from '../cart/shoppingCartIcon';

function Header() {
  const user = useUserStore((state) => state.user);
  const [showSearch, setShowSearch] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);
  const searchString = useSearchState((state: any) => state.searchString);
  const searchService = new SearchService();
  const [scroll, setScroll] = useState(false)

  const toggleSearch = () => {
    if (!showSearch) {
      setShowSearch(true);
    }
  }

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 20
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck)
      }
    })
  })

  if (!eventListenerRegistered) {
    document.body.addEventListener('click', function(event: any) {
      if (event.target.closest('.searchBar')) return;
      if (event.target.closest('.searchBox')) return;
      setShowSearch(false);
      setEventListenerRegistered(true);
    });
  }
  const searchBox = (
    <div onClick={toggleSearch} className="grow col-start-2 2xl:col-start-3 searchBar flex rounded-full border border-slate-200 shadow-sm py-2 px-4 h-10 hover:cursor-text" >
      <div className={showSearch ? "text-slate-300" : ""}>{searchString}</div>
      {searchString && <div onClick={searchService.clearSearch} className="ml-auto cursor-pointer font-handwriting text-stone-500 text-xs self-center p-1 hover:text-stone-600">X<img src="" alt="" /></div>}
    </div>
  );

  const addButton = (
    <NavLink
      className={({ isActive }) => isActive ? "text-blue-400 border-blue-400 border rounded-lg pl-2" : "border-none pl-2"}
      to={user ? "materials/add" : "login"}>
      <button className="border border-slate-200 shadow-sm rounded-lg flex"><div className="hover:scale-125 hover:brightness-110 transition px-4 py-2"><img src={plus} alt="" width="20" /></div></button>
    </NavLink>
  )

  const navigation = <Nav materialsLink="materials" myMaterialsLink={user ? "materials/mine" : "login"}></Nav>;

  return (
    <>
      {showSearch && <div className="fixed w-screen h-screen backdrop-blur-sm"><Search setShowSearch={setShowSearch} /></div>}
      <div className="sticky z-50 top-0 bg-gradient-to-b from-white from-70% via-white/95 to-white/85">
        <div className={scroll ? "shadow-sm shadow-gray-100 p-4" : "p-4"}>
          <div className="flex justify-between gap-1">
            <div className="hidden md:flex items-center gap-2">
              {navigation}
            </div>
            <div className="grow md:left-0 md:absolute md:w-full md:m-auto md:mt-1">
              <div className="md:grid flex grid-cols-3 2xl:grid-cols-5">
                {searchBox}
                {addButton}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!user && <Link to="login" className="" ><img className="min-w-5" src={UserIcon} width="30" alt="User" /></Link>}
              {user &&
                <>
                  <UserMenu />
                  <ShoppingCartIcon />
                </>
              }
            </div>
          </div>
          <div className="flex md:hidden mt-4 gap-2">
            {navigation}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header;
