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

let inventory;
beforeAll(async => {
  inventory = new Inventory();
});
