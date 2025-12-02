/**
 * Servicio de autenticación
 */

import apiClient from './api';

/**
 * Servicio para manejar autenticación
 */
export const authService = {
  /**
   * Inicia sesión con credenciales
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<{user: object, accessToken: string}>}
   */
  async login(username, password) {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    });

    if (response.success) {
      apiClient.setTokens(response.access_token, response.refresh_token);
      apiClient.setUser(response.user);
    }

    return response;
  },

  /**
   * Registra un nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} email - Email
   * @param {string} password - Contraseña
   * @returns {Promise<{user: object, accessToken: string}>}
   */
  async signup(username, email, password) {
    const response = await apiClient.post('/auth/signup', {
      username,
      email,
      password,
    });

    if (response.success) {
      apiClient.setTokens(response.access_token, response.refresh_token);
      apiClient.setUser(response.user);
    }

    return response;
  },

  /**
   * Restablece la contraseña de un usuario
   * @param {string} username - Nombre de usuario
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async resetPassword(username) {
    return apiClient.post('/auth/reset-password', { username });
  },

  /**
   * Renueva los tokens de acceso
   * @returns {Promise<boolean>}
   */
  async refreshToken() {
    return apiClient.refreshToken();
  },

  /**
   * Cierra la sesión actual
   */
  logout() {
    apiClient.clearTokens();
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!apiClient.getAccessToken();
  },

  /**
   * Obtiene el usuario actual
   * @returns {object|null}
   */
  getCurrentUser() {
    return apiClient.getUser();
  },
};

export default authService;
