import { useSearchState } from "../store";

export default class SearchService {
  private setSearchString = useSearchState((state: any) => state.setSearchString);

  public clearSearch = () => {
    this.setSearchString('');
  }
}
