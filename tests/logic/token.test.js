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
import { Token, tk } from '../../src/utils/token';
import api from '../../api/apiClint';
import { setUserName, setUserPassword } from '../../src/store/useUserStore';

dotenv.config({ path: '.env' });
describe('Token Class and its methods', () => {
  let tokens;
  let tokensData;
  beforeAll(async () => {
    tokensData = await api.zPost('/api/Authentications', {
      userName: 'admin-admin-wHGa8',
      password: '123',
    });
    tokens = new Token(await tokensData);
  });

  it('should fetch access token successfully', async () => {
    testValidToken(tokens.accessToken);
    testValidToken(tokens.refreshToken);
    testValidToken(tokens.refreshTokenExpTime);
  });

  it('should be string', async () => {
    testTypeIsString(tokens.accessToken);
    testTypeIsString(tokens.refreshToken);
    testTypeIsString(tokens.refreshTokenExpTime);
  });

  it('should reset refreshToken', async () => {
    const oldRefreshToken = tokens.refreshToken;
    await tokens.resetRefreshToken();
    const newRefreshToken = tokens.refreshToken;

    expect(oldRefreshToken).not.toEqual(newRefreshToken);
  });

  it('should return decoded object', () => {
    expect(tokens.decodeAccessToken).toBeDefined();
    expect(tokens.decodeAccessToken).toBeTypeOf('object');
  });
  it('should contains {nameid, rol, given_name} properties', () => {
    const decodedTokenData = tokens.decodeAccessToken;

    assert(Object.hasOwn(decodedTokenData, 'nameid'));
    assert(Object.hasOwn(decodedTokenData, 'role'));
    assert(Object.hasOwn(decodedTokenData, 'given_name'));
  });

  it('should fetch tokensObject that contains {token, refreshToken, refreshTokenExpireTime}', async () => {
    const usrPassword = process.env.VITE_TEST_PASSWORD;
    const usrName = process.env.VITE_TEST_USERNAME;

    setUserName(usrName);
    setUserPassword(usrPassword);

    const tokensObject = await tokens.fetchTokensObj();

    console.log(tokensObject);
    assert(Object.hasOwn(tokensObject, 'token'));
    assert(Object.hasOwn(tokensObject, 'refreshToken'));
    assert(Object.hasOwn(tokensObject, 'refreshTokenExpireTime'));
  });
});

function testValidToken(token) {
  expect(token).not.toBeUndefined();
  expect(token).not.toBeNull();
  expect(token).not.toBe('');
  expect(token).toBeDefined();
}

function testTypeIsString(token) {
  expect(typeof token).toBe('string');
}
