import { useCartStore, useSidebarStore } from '../../store';
import hamburgerIcon from "../../assets/icons/icons8-hamburger-50.png";

function ShoppingCartIcon() {
  const setSidebarShown = useSidebarStore((state) => state.toggleSidebar);
  const numberOfCartItems = useCartStore((state: any) => state.numberOfCartItems);

  return (
    <>
      <button className="" onClick={setSidebarShown}>
        {numberOfCartItems > 0
          && <div className="absolute top-5 right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex justify-center items-center">{numberOfCartItems}</div>}
        <img src={hamburgerIcon} width="30" alt="" />
      </button>
    </>
  )
}

export default ShoppingCartIcon;
