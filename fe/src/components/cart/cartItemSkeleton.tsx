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
        className="border-border dark:bg-surface-raised bg-surface-base flex flex-col rounded-lg border opacity-0 shadow-lg transition-opacity duration-700"
      >
        <div className="flex flex-row">
          <div className="flex flex-1 flex-col gap-4 overflow-auto p-10">
            <div className="flex flex-col gap-2">
              <div className="bg-surface-subtle h-4 w-20 animate-pulse rounded-xl text-2xl"></div>
              <div className="bg-surface-raised h-8 w-44 animate-pulse rounded-xl text-2xl"></div>
              <div className="bg-surface-subtle h-4 w-36 rounded-xl text-2xl"></div>
              <div className="bg-surface-subtle h-4 w-16 animate-pulse rounded-xl text-2xl"></div>
            </div>
            <p className="bg-success/20 text-success h-8 w-28 rounded-xl text-3xl"></p>
          </div>
          <div className="bg-surface-subtle m-4 w-1/3 animate-pulse rounded-lg">
            <div className="w-8"></div>
          </div>
        </div>
        <div className="ml-auto self-end p-4">
          <div className="mt-auto flex gap-2">
            <div className="bg-surface-subtle h-8 w-8 animate-pulse rounded-xl text-2xl"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartSkeleton;
