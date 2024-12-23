type SearchResultsPreviewProps = {
  searchResults: any
}

export default function SearchResultsPreview({ searchResults }: SearchResultsPreviewProps) {

  return (
    <div className="sm:grid grid-cols-2 mt-4">
      <div className="">
        {searchResults.map((el: any, index: number) => <div key={index} className="inline-block mr-2 mt-2 text-sm border rounded-xl p-1 bg-slate-50">{el.material.title}</div>)}
      </div>
    </div>
  )
}
