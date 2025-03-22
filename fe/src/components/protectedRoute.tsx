import { useAuth } from "react-oidc-context";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  return (
    <>
      {auth.isAuthenticated
        ? children
        : (
          history.replaceState(null, "", "/materials"),
          auth.signinRedirect()
        )
      }
    </>
  );
}
