import { NavLink, useNavigate } from "react-router";
import { User } from "lucide-react";
import plus from "../../assets/addPlusGradient.png";
import { useSearchState, useSidebarStore } from "../../store";
import Nav from "./nav";
import UserMenu from "../userMenu/userMenu";
import { useEffect, useState } from "react";
import Search from "./search/search";
import SearchService from "../../services/searchService";
import ShoppingCartIcon from "../cart/shoppingCartIcon";
import { useAuth } from "react-oidc-context";

function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [eventListenerRegistered, setEventListenerRegistered] = useState(false);
  const searchString = useSearchState((state: any) => state.searchString);
  const sidebarShown = useSidebarStore((state) => state.isShown);
  const searchService = new SearchService();
  const [onAddPage, setOnAddPage] = useState(false);
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

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
    document.body.addEventListener("click", function (event: any) {
      if (event.target.closest(".searchBar")) return;
      if (event.target.closest(".searchBox")) return;
      setShowSearch(false);
      setEventListenerRegistered(true);
    });
  }

  const toggleAddMaterial = () => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect();
    }
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
      className="searchBar border-border relative col-start-2 flex max-h-10 max-w-60 grow overflow-hidden rounded-full border px-4 py-2 shadow-sm hover:cursor-text sm:max-w-96 lg:max-w-none 2xl:col-start-3"
    >
      <div className={`mr-4 truncate ${showSearch ? "text-text-muted" : ""}`}>
        {searchString}
      </div>
      {searchString && (
        <div
          role="button"
          onClick={searchService.clearSearch}
          className="font-handwriting text-text-muted hover:text-text-secondary absolute right-4 cursor-pointer self-center p-1 text-xs"
        >
          X
        </div>
      )}
    </button>
  );

  const addButton = (
    <div className="border-border rounded-lg border shadow-sm">
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
        className={`${onAddPage ? "border-accent text-accent rounded-lg border" : "border-none"}`}
        to={
          !onAddPage
            ? auth.isAuthenticated
              ? "materials/add"
              : ""
            : "materials"
        }
        onClick={toggleAddMaterial}
      >
        {addButton}
      </NavLink>
    </div>
  );

  const navigation = (
    <Nav
      materialsLink="materials"
      myMaterialsLink="materials/mine/bought"
    ></Nav>
  );

  const signIn = async () => {
    auth.signinRedirect();
  };

  return (
    <>
      {showSearch && (
        <div className="fixed z-50 h-screen w-screen backdrop-blur-sm">
          <Search setShowSearch={setShowSearch} />
        </div>
      )}
      <div className="from-surface-base via-surface-base/95 to-surface-base/85 dark:from-surface-base dark:via-surface-base/98 dark:to-surface-base/95 relative top-0 z-50 bg-gradient-to-b from-70% md:sticky">
        <div
          className={
            scroll
              ? "shadow-border dark:shadow-surface-overlay p-4 md:shadow-sm"
              : "p-4"
          }
        >
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
              {!auth?.isAuthenticated && (
                <button onClick={signIn} className="">
                  <User className="min-w-5 h-8 w-8" />
                </button>
              )}
              {auth?.isAuthenticated && (
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
