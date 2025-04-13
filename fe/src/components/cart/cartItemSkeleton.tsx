import { useEffect } from "react";

function CartSkeleton({ id }: { id: string }) {
  useEffect(() => {
    setTimeout(() => {
      const rootElement = document.getElementById(id);
      rootElement?.classList.add("opacity-100");
    }, 10);
  }, []);

  return (
    <>
      <div
        id={id}
        className="flex flex-col rounded-lg border border-slate-200 dark:bg-slate-800 bg-white opacity-0 shadow-lg transition-opacity duration-700"
      >
        <div className="flex flex-row">
          <div className="flex flex-1 flex-col gap-4 overflow-auto p-10">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 animate-pulse rounded-xl bg-gray-200 text-2xl"></div>
              <div className="h-8 w-44 animate-pulse rounded-xl bg-gray-300 text-2xl"></div>
              <div className="h-4 w-36 rounded-xl bg-gray-200 text-2xl"></div>
              <div className="h-4 w-16 animate-pulse rounded-xl bg-gray-200 text-2xl"></div>
            </div>
            <p className="h-8 w-28 rounded-xl bg-emerald-100 text-3xl text-emerald-500"></p>
          </div>
          <div className="m-4 w-1/3 animate-pulse rounded-lg bg-gray-100">
            <div className="w-8"></div>
          </div>
        </div>
        <div className="ml-auto self-end p-4">
          <div className="mt-auto flex gap-2">
            <div className="h-8 w-8 animate-pulse rounded-xl bg-gray-200 text-2xl"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartSkeleton;
