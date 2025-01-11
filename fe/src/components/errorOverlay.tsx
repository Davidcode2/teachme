import { useErrorStore } from "../store";

export function ErrorOverlay() {
  const { errors, pop } = useErrorStore();

  if (errors.length === 0) return null;

  const clearErrors = () => {
    pop();
  };

  return (
    <>
      {errors && (
        <div className="fixed left-1/2 right-1/2 top-28 z-50 flex justify-center">
          <div>
            <ul className="flex flex-col gap-4">
              {errors.map((error, index) => (
                <li
                  key={index}
                  className="flex h-fit min-w-96 justify-between gap-2 rounded-full border border-rose-700 bg-rose-800 p-2 text-white shadow-xl shadow-stone-500"
                >
                  <div className="p-2">{error.message}</div>
                  <button
                    onClick={clearErrors}
                    className="p-2 font-handwriting text-sm hover:text-rose-400 mr-2"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
