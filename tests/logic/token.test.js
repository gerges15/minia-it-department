import { describe, it, expect, beforeAll, assert, beforeEach } from 'vitest';
import { Token } from '../../src/utils/token';
import api from '../../api/apiClint';

describe('Token Class and its methods', () => {
  it('should fetch access token successfully', async () => {
    const tokens = new Token();
    expect(tokens.accessToken()).not.toBeUndefined();
    expect(tokens.accessToken()).not.toBeNull();
    expect(tokens.accessToken()).not.toBe('');
    expect(tokens.accessToken()).toBeDefined();
  });
});
