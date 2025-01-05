import { useCartStore, useSidebarStore } from "../../store";

function ShoppingCartIcon() {
  const setSidebarShown = useSidebarStore((state) => state.toggleSidebar);
  const sidebarShown = useSidebarStore((state) => state.isShown);
  const numberOfCartItems = useCartStore(
    (state: any) => state.numberOfCartItems,
  );

  const toggleMenu = () => {
    setSidebarShown();
  };

  return (
    <>
      <button className="py-2" onClick={toggleMenu}>
        {numberOfCartItems > 0 && (
          <div className="absolute right-2 top-5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            {numberOfCartItems}
          </div>
        )}
        <div className="flex h-5 w-6 cursor-pointer flex-col items-center justify-between">
          <div
            className={`h-[3px] w-full rounded bg-neutral-700 transition-transform duration-300 ease-in-out ${
              sidebarShown ? "translate-y-[9px] rotate-45" : ""
            }`}
          ></div>
          <div
            className={`h-[3px] w-full rounded bg-neutral-700 transition-opacity duration-300 ease-in-out ${
              sidebarShown ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`h-[3px] w-full rounded bg-neutral-700 transition-transform duration-300 ease-in-out ${
              sidebarShown ? "-translate-y-2 -rotate-45" : ""
            }`}
          ></div>
        </div>
      </button>
    </>
  );
}

export default ShoppingCartIcon;
