import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png"
import { useSidebarStore } from "../../store";
import Cart from "../cart/cart";
import UserMenu from "../userMenu";
import { gsap } from 'gsap';

export default function Sidebar() {
  const toggleSidebarShown = useSidebarStore((state) => state.toggleSidebar);
  let sidebarShown = useSidebarStore((state) => state.isShown);

  useSidebarStore.subscribe(() => {
    gsap.set('.sidebar', { x: 300 });
    gsap.to('.sidebar', { x: 0, duration: 1 });
  });

  return (
    <div className="sidebar fixed right-0 w-screen md:w-[500px]">
      {sidebarShown ?
        <div className="p-4 bg-white shadow-md overflow-y-auto md:w-[500px] h-screen z-50">
          <div className="flex flex-col">
            <div className="my-[6px] self-end">
              <div className="flex items-center gap-2">
                <UserMenu />
                <button onClick={toggleSidebarShown}><img src={hamburgerIcon} width="30" alt="" /></button>
              </div>
            </div>
            <Cart />
          </div>
        </div>
        : <></>}
    </div>
  )
}
