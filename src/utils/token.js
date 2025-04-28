class Token {
  constructor(data) {
    this._data = data;
    this._accessToken = this._data.token;
    this._refreshToken = this._data.refreshToken;
  }

  get accessToken() {
    return this._accessToken;
  }
  get refreshToken() {
    return this._accessToken;
  }
}

export { Token };
