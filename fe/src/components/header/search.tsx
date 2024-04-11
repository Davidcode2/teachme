export default function Search() {
  return (
  <div className="flex h-full w-full justify-center">
    <div className="searchBox lg:w-[800px] self-center">
      <div className="searchBox border border-gray-200 bg-white shadow-lg rounded-lg p-10 blur-none flex flex-col">
        <input className="searchBox p-4 rounded-full border" type="text" />
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
