import { useSearchStringState } from '../../store';
export default function Search() {

  const changeSearchString = (e: any) => {
    const searchString: string = e.target.value;
    useSearchStringState.getState().setSearchString(searchString);
  }

  return (
    <div className="flex h-full w-full justify-center">
      <div className="searchBox lg:w-[800px] sm:w-[600px] self-center">
        <div className="searchBox border border-gray-200 bg-white shadow-lg rounded-lg p-10 blur-none flex flex-col">
          <input onChange={changeSearchString} className="searchBox p-4 rounded-full border" type="text" />
          <ul className="searchBox flex flex-col gap-2">
            <li>Text somethin</li>
            <li>Text somethin</li>
            <li>Text somethin</li>
            <li>Text somethin</li>
            <li>Text somethin</li>
          </ul>
        </div></div>
    </div>
  )
}
