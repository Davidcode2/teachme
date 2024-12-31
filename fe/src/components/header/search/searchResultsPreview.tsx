import Material from "../../../DTOs/material";

type SearchResultsPreviewProps = {
  searchResults: Material[];
};

export default function SearchResultsPreview({
  searchResults,
}: SearchResultsPreviewProps) {
  console.log(searchResults);

  return (
    <div className="mt-4 grid-cols-2 sm:grid">
      <div className="">
        {searchResults.map((el: Material, index: number) => (
          <div
            key={index}
            className="mr-2 mt-2 inline-block rounded-xl border bg-slate-50 p-1 text-sm"
          >
            {el.title}
          </div>
        ))}
      </div>
    </div>
  );
}
