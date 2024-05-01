import SearchService from '../../../services/searchService';
import { useSearchState } from '../../../store'
import SearchResultsPreview from './searchResultsPreview'

export default function Search({ setShowSearch }: { setShowSearch: any}) {
  let searchResults = useSearchState((state: any) => state.searchResults);
  let searchString = useSearchState((state: any) => state.searchString);
  let setSearchString = useSearchState((state: any) => state.setSearchString);
  const clearSearch = new SearchService().clearSearch;;

  const changeSearchString = (e: any) => {
    const searchString: string = e.target.value;
    setSearchString(searchString);
  }

  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      setShowSearch();
    }
  }

  return (
    <div className="flex h-full w-full justify-center">
      <div className="searchBox lg:w-[800px] sm:w-[600px] w-4/5 self-center">
        <div className="z-50 searchBox border border-fuchsia-200 bg-white shadow-2xl shadow-fuchsia-900 rounded-lg p-10 blur-none flex flex-col">
          <div className="flex">
            <input value={searchString} onChange={changeSearchString} onKeyDown={onEnter} autoFocus={true} className="flex-grow border border-fuchsia-200 searchBox p-4 rounded-full focus:outline-none focus:outline-purple-300 focus:shadow-lg focus:shadow-purple-200 focus:border-none" type="text" />
            {searchString && <div onClick={clearSearch} className="relative right-8 cursor-pointer font-handwriting text-stone-500 text-xs self-center">X<img src="" alt="" /></div>}
          </div>
          <ul className="searchBox flex flex-col gap-2">
            <SearchResultsPreview searchResults={searchResults} />
          </ul>
        </div>
      </div>
    </div>
  )
}
