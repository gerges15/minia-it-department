class Token {
  constructor(data) {
    this._data = data;
    this._accessToken = this._data.token;
  }

  accessToken() {
    return this._accessToken;
  }
}

export { Token };
