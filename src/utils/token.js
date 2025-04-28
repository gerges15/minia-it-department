class Token {
  constructor(data) {
    this._data = data;
    this._accessToken = this._data.token;
    this._refreshToken = this._data.refreshToken;
    this._refreshTokenExpTime = this._data.refreshTokenExpireTime;
  }

  get accessToken() {
    return this._accessToken;
  }
  get refreshToken() {
    return this._refreshToken;
  }
  get refreshTokenExpTime() {
    return this._refreshTokenExpTime;
  }
}

export { Token };
