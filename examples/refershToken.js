async function resetRefreshToken() {
  const KEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_API_URL;
  const isProduction = import.meta.env.PROD;
  try {
    const refreshUrl = isProduction
      ? `/api/proxy/Users/${fullId}/Authentications?refreshToken=${this.refreshToken}`
      : `${URL}/Users/${fullId}/Authentications?refreshToken=${this.refreshToken}`;

    const res = await fetch(refreshUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY,
      },
    });

    this._refreshToken = await res.json();
  } catch (e) {
    console.error('Error: ', e);
  }
}
