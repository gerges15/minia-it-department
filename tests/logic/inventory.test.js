import dotenv from 'dotenv';
import { describe, it, expect, beforeAll } from 'vitest';
import { Token } from '../../src/utils/token';
import { Inventory } from '../../src/utils/inventory';
import { setUserName, setUserPassword } from '../../src/store/useUserStore';
import Cookies from 'js-cookie';

dotenv.config({ path: '.env' });

let inventory;
let tk;
describe('Test Store functionality in Inventory class', async () => {
  beforeAll(async () => {
    const usrPassword = process.env.VITE_TEST_PASSWORD;
    const usrName = process.env.VITE_TEST_USERNAME;

    setUserName(usrName);
    setUserPassword(usrPassword);

    tk = await Token.Create();
    inventory = new Inventory(tk);
    inventory.storeAllTokens();
  });
  it('should store correct access token', async () => {
    const storedToken = Cookies.get('accessToken');

    expect(storedToken).toBe(tk.accessToken);
  });
  it('should store correct refresh token', async () => {
    const storedToken = Cookies.get('refreshToken');

    expect(storedToken).toBe(tk.refreshToken);
  });
  it('should store correct refreshTokenExpireTime', async () => {
    const storedToken = Cookies.get('refreshTokenExpTime');

    expect(storedToken).toBe(tk.refreshTokenExpTime);
  });
  it('should store the correct role of user', async () => {
    inventory.storeUserRole();
    const storedRole = Cookies.get('role');
    const { role } = tk.decodeAccessToken;

    expect(storedRole).toBe(role);
  });
  it('should store the correct id of user', async () => {
    inventory.storeUserId();
    const storedId = Cookies.get('id');
    const { nameid: id } = tk.decodeAccessToken;
    expect(storedId).toBe(id);
  });
});

describe('Test remove functionality in Inventory class', async () => {
  beforeAll(() => {
    inventory.removeAllTokens();
  });
  it('should remove  accessToken', async () => {
    const storedToken = Cookies.get('accessToken');

    expect(storedToken).toBeUndefined();
  });
  it('should remove  refreshToken', async () => {
    const storedToken = Cookies.get('refreshToken');

    expect(storedToken).toBeUndefined();
  });
  it('should remove  refreshTokenExpTime', async () => {
    const storedToken = Cookies.get('refreshTokenExpTime');

    expect(storedToken).toBeUndefined();
  });
  it('should remove  role', async () => {
    inventory.removeUserRole();
    const storedToken = Cookies.get('role');

    expect(storedToken).toBeUndefined();
  });
  it('should remove  userId', async () => {
    inventory.removeUserId();
    const storedToken = Cookies.get('id');

    expect(storedToken).toBeUndefined();
  });
});
