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
    expect(tokens.accessToken()).not.toBeUndefined();
    expect(tokens.accessToken()).not.toBeNull();
    expect(tokens.accessToken()).not.toBe('');
    expect(tokens.accessToken()).toBeDefined();
  });

  it('should be string', async () => {
    expect(typeof tokens.accessToken()).toBe('string');
  });
  it('should fetch refresh token successfully', async () => {
    expect(tokens.refreshToken()).not.toBeUndefined();
    expect(tokens.refreshToken()).not.toBeNull();
    expect(tokens.refreshToken()).not.toBe('');
    expect(tokens.refreshToken()).toBeDefined();
  });

  it('should be string', async () => {
    expect(typeof tokens.refreshToken()).toBe('string');
  });
});
