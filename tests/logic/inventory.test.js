import dotenv from 'dotenv';
import {
  describe,
  it,
  expect,
  beforeAll,
  assert,
  beforeEach,
  vi,
} from 'vitest';
import { Token } from '../../src/utils/token';
import { Inventory } from '../../src/utils/inventory';
import { setUserName, setUserPassword } from '../../src/store/useUserStore';
import Cookies from 'js-cookie';

dotenv.config({ path: '.env' });

describe('Test Inventor Class', async () => {
  let inventory;
  let tk;

  beforeAll(async () => {
    const usrPassword = process.env.VITE_TEST_PASSWORD;
    const usrName = process.env.VITE_TEST_USERNAME;

    setUserName(usrName);
    setUserPassword(usrPassword);

    tk = await Token.Create();
    inventory = new Inventory(tk);
  });

  it('should store correct access token', async () => {
    inventory.storeAccessToken();
    const storedToken = Cookies.get('accessToken');

    expect(storedToken).toBe(tk.accessToken);
  });
  it('should store correct refresh token', async () => {
    inventory.storeRefreshToken();
    const storedToken = Cookies.get('refreshToken');

    expect(storedToken).toBe(tk.refreshToken);
  });
  it('should store correct refreshTokenExpireTime', async () => {
    inventory.storeRefreshTokenExpTime();
    const storedToken = Cookies.get('refreshTokenExpTime');

    expect(storedToken).toBe(tk.refreshTokenExpTime);
  });
});
