import { validateCredentials } from '../services/user.service.js';

class AuthModel {
  async authenticate(name, password) {
    try {
      const user = await validateCredentials(name, password);
      return user || null;
    } catch (error) {
      console.error('Error en AuthModel.authenticate:', error);
      throw error;
    }
  }
}

export default new AuthModel();
