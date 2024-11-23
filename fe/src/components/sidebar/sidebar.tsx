import { useSidebarStore } from "../../store";
import Cart from "../cart/cart";
import { gsap } from 'gsap';

export default function Sidebar() {
  const sidebarShown = useSidebarStore((state) => state.isShown);

  useSidebarStore.subscribe(() => {
    gsap.set('.sidebar', { x: 300 });
    gsap.to('.sidebar', { x: 0, duration: 1 });
  });

  return (
    <div className="sidebar fixed right-0 w-screen md:w-[500px]">
      {sidebarShown ?
        <div className="p-4 bg-white shadow-md overflow-y-auto md:w-[500px] pt-40 md:pt-24 h-screen z-50">
          <div className="flex flex-col gap-4">
            <Cart />
          </div>
        </div>
        : <></>}
    </div>
  )
}
