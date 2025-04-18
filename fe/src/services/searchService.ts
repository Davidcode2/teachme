import { useNavigate } from "react-router";
import { useSearchState } from "../store";

export default class SearchService {
  private setSearchString = useSearchState(
    (state: any) => state.setSearchString,
  );
  navigate = useNavigate();

  public clearSearch = () => {
    this.setSearchString("");
    this.navigate("/");
  };
}
