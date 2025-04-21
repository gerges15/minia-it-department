import Cookies from 'js-cookie';

export class Cookie {
  #_cookieOptions = {
    secure: true,
    sameSite: 'strict',
    expires: new Date(this._expireTime),
  };

  constructor(cookieName, cookieValue, expireTime) {
    this._cookieName = cookieName;
    this._cookieValue = cookieValue;
    this._expireTime = expireTime;
    Cookies.set(this._cookieName, this._cookieValue, this.#_cookieOptions);
  }

  get cookie() {
    return Cookies.get(this.name);
  }

  remove() {
    Cookies.remove(this.name);
  }

  get name() {
    return this._cookieName;
  }
}
