import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OAuthRedirect() {
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const token = query.get("token");
     console.log("OAuthRedirect Token:", token);
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [query, navigate]);

  return <div>Logging in via Google...</div>;
}
