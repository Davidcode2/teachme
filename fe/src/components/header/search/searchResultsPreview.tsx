import Material from "../../../DTOs/material";

type SearchResultsPreviewProps = {
  searchResults: Material[]
}

export default function SearchResultsPreview({ searchResults }: SearchResultsPreviewProps) {

  console.log(searchResults);

  return (
    <div className="sm:grid grid-cols-2 mt-4">
      <div className="">
        {searchResults.map((el: Material, index: number) => <div key={index} className="inline-block mr-2 mt-2 text-sm border rounded-xl p-1 bg-slate-50">{el.title}</div>)}
      </div>
    </div>
  )
}
