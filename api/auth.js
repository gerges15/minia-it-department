import Cookies from 'js-cookie';
import { openLoading, disableLoading } from '../src/store/useLoadingStore';
import { Token } from '../src/utils/token';
import { clearError, setError } from '../src/store/useErrorMessageStore';
import { setRole, resetRole } from '../src/store/useAuthStore';
import { Inventory } from '../src/utils/inventory';

let inventory;

export const login = async () => {
  openLoading();
  clearError();
  try {
    const tk = await Token.Create();
    inventory = new Inventory(tk);
    const data = await tk.fetchTokensObj();
    const { role, nameid: id } = tk.decodeAccessToken;

    if (isValidTokens(data)) {
      inventory.storeAllTokens();
      inventory.storeUserId();
      setRole(role);
    } else {
      const message = 'Invalid authentication response';
      setError(message);
      throw new Error(message);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.detail || 'Authentication failed';
    setError(errorMessage);
    console.error('Login error:', err);
    throw err;
  } finally {
    disableLoading();
  }
};

const isValidTokens = function (data) {
  return data.accessToken || data.refreshToken || data.refreshTokenExpireTime;
};

export const logout = async () => {
  try {
    inventory.removeAllTokens();
    inventory.removeUserId();
    inventory.removeUserRole();
    resetRole();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
