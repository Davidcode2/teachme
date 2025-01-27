import { Link, NavLink, useNavigate } from "react-router";
import plus from "../../assets/addPlusGradient.png";
import UserIcon from "../../assets/icons/icons8-user-48.png";
import { useSearchState, useUserStore, useSidebarStore } from "../../store";
import Nav from "./nav";
import UserMenu from "../userMenu";
import { useEffect, useState } from "react";
import Search from "./search/search";
import SearchService from "../../services/searchService";
import ShoppingCartIcon from "../cart/shoppingCartIcon";

function Header() {
  const user = useUserStore((state) => state.user);
  const [showSearch, setShowSearch] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);
  const searchString = useSearchState((state: any) => state.searchString);
  const sidebarShown = useSidebarStore((state) => state.isShown);
  const searchService = new SearchService();
  const [onAddPage, setOnAddPage] = useState(false);
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => {
    if (!showSearch) {
      setShowSearch(true);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 20;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  if (!eventListenerRegistered) {
    document.body.addEventListener("click", function(event: any) {
      if (event.target.closest(".searchBar")) return;
      if (event.target.closest(".searchBox")) return;
      setShowSearch(false);
      setEventListenerRegistered(true);
    });
  }

  const toggleAddMaterial = () => {
    if (onAddPage) {
      navigate("materials");
    }
    setOnAddPage(!onAddPage);
    if (sidebarShown) {
      useSidebarStore.getState().hide();
    }
  };

  const searchBox = (
    <button
      onClick={toggleSearch}
      className="searchBar relative col-start-2 flex max-h-10 max-w-60 grow overflow-hidden rounded-full border border-slate-200 px-4 py-2 shadow-sm hover:cursor-text sm:max-w-96 lg:max-w-none 2xl:col-start-3"
    >
      <div className={`mr-4 truncate ${showSearch ? "text-slate-300" : ""}`}>
        {searchString}
      </div>
      {searchString && (
        <button
          onClick={searchService.clearSearch}
          className="absolute right-4 cursor-pointer self-center p-1 font-handwriting text-xs text-stone-500 hover:text-stone-600"
        >
          X<img src="" alt="" />
        </button>
      )}
    </button>
  );

  const addButton = (
    <div className="rounded-lg border border-slate-200 shadow-sm">
      <div
        className={`px-4 py-2 transition hover:scale-125 hover:brightness-110 ${onAddPage ? "rotate-45 transition-transform" : ""}`}
      >
        <img src={plus} alt="" width="20" />
      </div>
    </div>
  );

  const addButtonContainer = (
    <div className="flex">
        <NavLink
          className={`${onAddPage ? "rounded-lg border border-blue-400 text-blue-400" : "border-none"}`}
          to={!onAddPage ? (user ? "materials/add" : "login") : "materials" }
          onClick={toggleAddMaterial}
        >{addButton}</NavLink>
    </div>
  );

  const navigation = (
    <Nav
      materialsLink="materials"
      myMaterialsLink={user ? "materials/mine/bought" : "login"}
    ></Nav>
  );

  return (
    <>
      {showSearch && (
        <div className="fixed z-50 h-screen w-screen backdrop-blur-sm">
          <Search setShowSearch={setShowSearch} />
        </div>
      )}
      <div className="relative top-0 z-50 bg-gradient-to-b from-white from-70% via-white/95 to-white/85 md:sticky">
        <div className={scroll ? "p-4 shadow-gray-100 md:shadow-sm" : "p-4"}>
          <div className="flex justify-between gap-3">
            <div className="hidden items-center gap-2 md:flex">
              {navigation}
            </div>
            <div className="z-30 grow md:absolute md:left-0 md:m-auto md:mt-1 md:w-full">
              <div className="flex grid-cols-3 gap-x-2 md:grid 2xl:grid-cols-5">
                {searchBox}
                {addButtonContainer}
              </div>
            </div>
            <div className="z-40 flex items-center gap-2">
              {!user && (
                <Link to="login" className="">
                  <img
                    className="min-w-5"
                    src={UserIcon}
                    width="30"
                    alt="User"
                  />
                </Link>
              )}
              {user && (
                <>
                  <div className="hidden md:flex">
                    <UserMenu />
                  </div>
                  <ShoppingCartIcon />
                </>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2 md:hidden">
            {!sidebarShown ? (
              navigation
            ) : (
              <div className="ml-auto">
                <UserMenu sidebarShown={sidebarShown} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
