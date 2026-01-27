import { AUTH_CONFIG } from '../config/app.config';

export const auth = {
  getToken: (): string =>
    localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) ||
    localStorage.getItem(AUTH_CONFIG.LEGACY_TOKEN_KEY) ||
    '',

  setToken: (token: string): void =>
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token),

  clearToken: (): void => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.LEGACY_TOKEN_KEY);
  },
};
