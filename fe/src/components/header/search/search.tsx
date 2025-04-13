import { useNavigate } from "react-router";
import SearchService from "../../../services/searchService";
import { useSearchState } from "../../../store";

export default function Search({ setShowSearch }: { setShowSearch: any }) {
  const searchString = useSearchState((state: any) => state.searchString);
  const setSearchString = useSearchState((state: any) => state.setSearchString);
  const clearSearch = new SearchService().clearSearch;
  const navigate = useNavigate();

  const keyCodeEnter = 13;
  const keycodeEscape = 27;

  const changeSearchString = (e: any) => {
    const searchString: string = e.target.value;
    setSearchString(searchString);
    if (searchString.length > 0) {
      navigate("/search");
    } else {
      navigate("/");
    }
  };

  const onCloseButton = (e: any) => {
    if (
      e.key === "Enter" ||
      e.keyCode == keyCodeEnter ||
      e.keyCode == keycodeEscape
    ) {
      setShowSearch(false);
    }
  };

  document.body.addEventListener("keydown", onCloseButton);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="searchBox w-4/5 self-center sm:w-[600px] lg:w-[800px]">
        <div className="searchBox z-50 flex flex-col rounded-lg border border-fuchsia-200 dark:bg-slate-800 bg-white px-10 pb-10 shadow-2xl shadow-fuchsia-900 blur-none">
          <div className="flex flex-col gap-2">
            <div className="pt-10 text-2xl dark:text-slate-200 text-slate-900">
              Finde deinen Arbeitserleichterer
            </div>
            <div className="flex">
              <input
                value={searchString}
                placeholder="Deutsch Klasse 6 Fabeln"
                onChange={changeSearchString}
                onKeyDown={onCloseButton}
                autoFocus={true}
                className="searchBox w-full grow rounded-3xl border border-fuchsia-200 p-4 focus:shadow-xs focus:shadow-purple-200 focus:outline-none focus:outline-purple-300"
              />
              {searchString && (
                <div className="justify-end">
                  <div className="absolute">
                    <div
                      role="button"
                      onClick={clearSearch}
                      className="relative right-12 top-1 cursor-pointer self-center p-4 font-handwriting text-xs text-stone-500 hover:text-stone-600"
                    >
                      X
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
