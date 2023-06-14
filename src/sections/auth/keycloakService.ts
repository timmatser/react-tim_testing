// src/keycloakService.ts
import Keycloak, { KeycloakConfig, KeycloakLoginOptions } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL!,
  realm: process.env.REACT_APP_KEYCLOAK_REALM!,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID!,
};

const keycloak: Keycloak.KeycloakInstance = new Keycloak(keycloakConfig);

const keycloakService = {
  init: () => {
    return keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    });
  },

  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const loginOptions: KeycloakLoginOptions = {
        prompt: 'none',
        loginHint: `${email}:${password}`,
      };

      await keycloak.login(loginOptions);

      if (keycloak.authenticated) {
        localStorage.setItem('accessToken', keycloak.token || '');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Keycloak login error:', error);
      return false;
    }
  },


  logout: () => {
    keycloak.logout();
  },

  // other Keycloak methods you may need (e.g., getUserProfile, updateToken, etc.)
};

export default keycloakService;
