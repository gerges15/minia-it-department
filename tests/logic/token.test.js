import { describe, it, expect, beforeAll, assert, beforeEach } from 'vitest';
import { Token, tk } from '../../src/utils/token';
import api from '../../api/apiClint';

describe('Token Class and its methods', () => {
  let tokens;
  let tokensData;
  beforeAll(async () => {
    tokensData = await api.post('/api/Authentications', {
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

  it('should reset refreshToken', () => {
    const oldRefreshToken = tokens.refreshToken;
    tokens.resetRefreshToken();
    const newRefreshToken = tokens.refreshToken;
    assert(oldRefreshToken != newRefreshToken);
  });

  it('should return decoded object', () => {
    expect(tokens.dataOfAccessToken).toBeDefined();
    expect(tokens.dataOfAccessToken).toBeTypeOf('object');
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
