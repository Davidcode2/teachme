type SearchResultsPreviewProps = {
  searchResults: any
}

export default function SearchResultsPreview({ searchResults }: SearchResultsPreviewProps) {
  return (
    <div>
      {searchResults.map((el: any) => <div>{el.title}</div>)}
    </div>
  )
}
