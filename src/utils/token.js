class Token {
  constructor(data) {
    this._data = data;
    this._accessToken = this._data.token;
    this._refreshToken = this._data.refreshToken;
  }

  accessToken() {
    return this._accessToken;
  }
  refreshToken() {
    return this._accessToken;
  }
}

export { Token };
