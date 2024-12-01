import { useCartStore, useSidebarStore } from '../../store';
import { useState } from 'react';

function ShoppingCartIcon() {
  const setSidebarShown = useSidebarStore((state) => state.toggleSidebar);
  const numberOfCartItems = useCartStore((state: any) => state.numberOfCartItems);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setSidebarShown();
    setIsOpen((prev) => !prev);
  };


  return (
    <>
      <button className="" onClick={toggleMenu}>
        {numberOfCartItems > 0
          && <div className="absolute z-20 top-5 right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex justify-center items-center">{numberOfCartItems}</div>
        }
        <div
          className="w-6 h-6 flex flex-col justify-between items-center cursor-pointer"
        >
          <div
            className={`h-1 w-full bg-black rounded transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-2 rotate-45' : ''
              }`}
          ></div>
          <div
            className={`h-1 w-full bg-black rounded transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''
              }`}
          ></div>
          <div
            className={`h-1 w-full bg-black rounded transition-transform duration-300 ease-in-out ${isOpen ? '-translate-y-3 -rotate-45' : ''
              }`}
          ></div>
        </div>
      </button>
    </>
  )
}

export default ShoppingCartIcon;
