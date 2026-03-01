import { Menu } from "lucide-react";
import { useCartStore, useSidebarStore } from "../../store";

function ShoppingCartIcon() {
  const setSidebarShown = useSidebarStore((state) => state.toggleSidebar);
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
        <Menu className="h-6 w-6 cursor-pointer" />
      </button>
    </>
  );
}

export default ShoppingCartIcon;
