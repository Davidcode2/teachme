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
        <div className="searchBox border-accent-muted dark:bg-surface-raised bg-surface-base shadow-accent z-50 flex flex-col rounded-lg border px-10 pb-10 shadow-2xl blur-none">
          <div className="flex flex-col gap-2">
            <div className="text-text-primary dark:text-text-primary pt-10 text-2xl">
              Finde deinen Arbeitserleichterer
            </div>
            <div className="flex">
              <input
                value={searchString}
                placeholder="Deutsch Klasse 6 Fabeln"
                onChange={changeSearchString}
                onKeyDown={onCloseButton}
                autoFocus={true}
                className="searchBox border-accent-muted focus:shadow-accent-muted focus:outline-accent-weak w-full grow rounded-3xl border p-4 focus:shadow-xs focus:outline-none"
              />
              {searchString && (
                <div className="justify-end">
                  <div className="absolute">
                    <div
                      role="button"
                      onClick={clearSearch}
                      className="font-handwriting text-text-muted hover:text-text-secondary relative top-1 right-12 cursor-pointer self-center p-4 text-xs"
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
