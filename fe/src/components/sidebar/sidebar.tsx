import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png"
import { useSidebarStore, useUserStore } from "../../store";
import Cart from "../cart/cart";

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
    <div className="p-4 fixed bg-white shadow-md right-0 h-screen">
      <div className="flex flex-col">
        <div className="mt-[6px] self-end">
          <button onClick={useSidebarStore().toggleSidebar}><img src={hamburgerIcon} width="30" alt="" /></button>
        </div>
        <Cart/>
      </div>
    </div>
  )
}
