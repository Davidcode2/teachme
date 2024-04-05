import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png"
import { useSidebarStore, useUserStore } from "../../store";
import Cart from "../cart/cart";
import UserMenu from "../userMenu";

export default function Sidebar() {
  const user = useUserStore((state) => state.user);

  if (!useSidebarStore().isShown) {
    // dirty fix for rendering more hooks than on previous render
    return (
      <div className="right-0 absolute">
        <button className="hidden" onClick={useSidebarStore().toggleSidebar}><img src={hamburgerIcon} width="30" alt="" /></button>
      </div>
    );
  }

  if (!user) return (
    <div className="p-4 fixed bg-white shadow-md right-0 h-screen">
      <div className="flex flex-col">
        <div className="mt-[6px] self-end">
          <button onClick={useSidebarStore().toggleSidebar}><img src={hamburgerIcon} width="30" alt="" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:fixed bg-white shadow-md overflow-y-auto md:w-[500px] md:right-0 h-screen z-50">
      <div className="flex flex-col">
        <div className="my-[6px] self-end">
          <div className="flex items-center gap-2">
            <UserMenu />
            <button onClick={useSidebarStore().toggleSidebar}><img src={hamburgerIcon} width="30" alt="" /></button>
          </div>
        </div>
        <Cart />
      </div>
    </div>
  )
}
