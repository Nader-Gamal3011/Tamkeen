import { getRefreshToken, setAccessToken, setRefreshToken, logout } from "./auth";

const API_URL = "https://tamkeen-backend-production.up.railway.app/api";

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    logout();
    window.location.href = "/";
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();




    // To-Do
    // if (!res.ok || !data.success) {
    //   logout();
    //   window.location.href = "/";
    //   return null;
    // }

    const { accessToken, refreshToken: newRefreshToken } = data.data;

    setAccessToken(accessToken);
    setRefreshToken(newRefreshToken);

    return accessToken;
  } catch (error) {
    console.log("Refresh error:", error.message);

    logout();
    window.location.href = "/";
    return null;
  }
};