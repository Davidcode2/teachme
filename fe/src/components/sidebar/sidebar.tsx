import { useSidebarStore } from "../../store";
import Cart from "../cart/cart";
import { gsap } from "gsap";

export default function Sidebar() {
  const sidebarShown = useSidebarStore((state) => state.isShown);

  useSidebarStore.subscribe(() => {
    gsap.set(".sidebar", { x: 300 });
    gsap.to(".sidebar", { x: 0, duration: 1 });
  });

  return (
    <div className="sidebar fixed right-0 z-50 w-screen md:w-[500px]">
      {sidebarShown && (
        <div className="z-50 h-screen overflow-y-auto bg-white p-4 pt-24 shadow-md md:w-[500px]">
          <div className="flex flex-col gap-4">
            <Cart />
          </div>
        </div>
      )}
    </div>
  );
}
