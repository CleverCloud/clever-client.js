import { login, logout } from '../lib/login.js';

/** @type {Mocha.RootHookObject} */
export const mochaHooks = {
  beforeAll: login,
  afterAll: logout,
};
