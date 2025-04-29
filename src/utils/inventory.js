import Cookies from 'js-cookie';
export class Inventory {
  constructor(data) {
    this._data = data;
  }

  storeAllTokens() {
    this.storeAccessToken();
    this.storeRefreshToken();
    this.storeRefreshTokenExpTime();
  }

  storeAccessToken() {
    const accessToken = this._data.accessToken;
    this.setCookie('accessToken', accessToken);
  }
  storeRefreshToken() {
    const refreshToken = this._data.refreshToken;
    this.setCookie('refreshToken', refreshToken);
  }
  storeRefreshTokenExpTime() {
    const refreshTokenExpTime = this._data.refreshTokenExpTime;
    this.setCookie('refreshTokenExpTime', refreshTokenExpTime);
  }

  storeUserRole() {
    const { role } = this._data.decodeAccessToken;
    this.setCookie('role', role);
  }
  storeUserId() {
    const { nameid: id } = this._data.decodeAccessToken;
    this.setCookie('id', id);
  }

  removeAllTokens() {
    return undefined;
  }
  setCookie(name, cookie) {
    Cookies.set(name, cookie, this._data.refreshTokenExpireTime);
  }

  removeCookie(name) {
    Cookies.remove(name);
  }
}
