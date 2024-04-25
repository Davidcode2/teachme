import { useSearchState } from '../../../store';
import SearchResultsPreview from './searchResultsPreview';
export default function Search() {
  let searchResults = useSearchState(state => state.searchResults);

  const changeSearchString = (e: any) => {
    const searchString: string = e.target.value;
    useSearchState.getState().setSearchString(searchString);
  }

  return (
    <div className="flex h-full w-full justify-center">
      <div className="searchBox lg:w-[800px] sm:w-[600px] self-center">
        <div className="z-50 searchBox border border-gray-200 bg-white shadow-lg rounded-lg p-10 blur-none flex flex-col">
          <input onChange={changeSearchString} autoFocus={true} className="searchBox p-4 rounded-full border" type="text" />
          <ul className="searchBox flex flex-col gap-2">
            <SearchResultsPreview searchResults={searchResults} />
          </ul>
        </div></div>
    </div>
  )
}
