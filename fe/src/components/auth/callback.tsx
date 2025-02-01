import { useLocation } from "react-router"
import { useUserStore } from "../../store";

export default function AuthCallback() {
  const userId = useUserStore((state) => state?.user?.id);
  const location = useLocation();
  const queryStrings = new URLSearchParams(location.search);
  const auth_code = queryStrings.get("code");
  const state = queryStrings.get("state");
  handleAuthentication(auth_code, state, userId);

  console.log(queryStrings);
  return (
    <>
    loading...
    </>
  )
}
