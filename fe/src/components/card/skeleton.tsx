import { useEffect } from "react";

function Skeleton({ id }: { id: string }) {
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
        className="flex flex-col rounded-lg border border-gray-300 bg-white opacity-0 shadow-lg transition-opacity duration-700 md:flex-row"
      >
        <div className="min-h-96 animate-pulse rounded-t-lg bg-gray-100 md:w-[400px] md:rounded-l-lg md:rounded-tr-none lg:w-[600px]">
          <div className="h-full w-8 "></div>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t border-slate-200 bg-white p-10 md:rounded-r-lg md:rounded-bl-none md:border-l md:border-t-0">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-24 animate-pulse rounded-xl bg-gray-300 text-2xl"></div>
            <div className="h-4 w-80 animate-pulse rounded-xl bg-gray-200 text-2xl"></div>
            <div className="h-4 w-36 rounded-xl bg-gray-200 text-2xl"></div>
            <div className="h-4 w-52 animate-pulse rounded-xl bg-gray-200 text-2xl"></div>
          </div>
          <p className="h-8 w-28 rounded-xl bg-emerald-100 text-3xl text-emerald-500"></p>
          <div className="mt-auto flex gap-2">
            <div className="h-8 w-8 rounded-xl bg-gray-200 text-2xl"></div>
            <div className="h-8 w-8 rounded-xl bg-gray-200 text-2xl"></div>
            <div className="h-8 w-8 animate-pulse rounded-xl bg-gray-200 text-2xl"></div>
            <div className="ml-auto self-end">
              <div className="h-4 w-52 animate-pulse rounded-xl bg-gray-300 text-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Skeleton;
