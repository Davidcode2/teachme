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
          <div className="bg-success text-text-inverse absolute top-5 right-2 z-20 flex h-5 w-5 items-center justify-center rounded-full">
            {numberOfCartItems}
          </div>
        )}
        <div className="flex h-5 w-6 cursor-pointer flex-col items-center justify-between">
          <div
            className={`bg-text-secondary h-[3px] w-full rounded transition-transform duration-300 ease-in-out ${
              sidebarShown ? "translate-y-[9px] rotate-45" : ""
            }`}
          ></div>
          <div
            className={`bg-text-secondary h-[3px] w-full rounded transition-opacity duration-300 ease-in-out ${
              sidebarShown ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`bg-text-secondary h-[3px] w-full rounded transition-transform duration-300 ease-in-out ${
              sidebarShown ? "-translate-y-2 -rotate-45" : ""
            }`}
          ></div>
        </div>
      </button>
    </>
  );
}

export default ShoppingCartIcon;
