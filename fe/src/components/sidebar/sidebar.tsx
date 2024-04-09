import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png"
import { useSidebarStore} from "../../store";
import Cart from "../cart/cart";
import UserMenu from "../userMenu";

export default function Sidebar() {
  const toggleSidebarShown = useSidebarStore((state) => state.toggleSidebar);

  if (!useSidebarStore().isShown) {
    return (
      <></>
    );
  }

  return (
    <div className="p-4 md:fixed bg-white shadow-md overflow-y-auto md:w-[500px] md:right-0 h-screen z-50">
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
  )
}
