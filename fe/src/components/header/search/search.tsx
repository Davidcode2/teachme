import { useSearchState } from '../../../store'
import SearchResultsPreview from './searchResultsPreview'

export default function Search() {
  let searchResults = useSearchState((state: any) => state.searchResults);
  let searchString = useSearchState((state: any) => state.searchString);

  const changeSearchString = (e: any) => {
    const searchString: string = e.target.value;
    useSearchState.getState().setSearchString(searchString);
  }

  return (
    <div className="flex h-full w-full justify-center">
      <div className="searchBox lg:w-[800px] sm:w-[600px] w-4/5 self-center">
        <div className="z-50 searchBox border border-fuchsia-200 bg-white shadow-2xl shadow-fuchsia-900 rounded-lg p-10 blur-none flex flex-col">
          <input value={searchString} onChange={changeSearchString} autoFocus={true} className="border border-fuchsia-200 searchBox p-4 rounded-full focus:outline-none focus:outline-purple-300 focus:shadow-lg focus:shadow-purple-200 focus:border-none" type="text" />
          <ul className="searchBox flex flex-col gap-2">
            <SearchResultsPreview searchResults={searchResults} />
          </ul>
        </div>
      </div>
    </div>
  )
}
