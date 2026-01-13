import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
