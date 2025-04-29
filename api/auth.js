import { clearError, setError } from '../src/store/useErrorMessageStore';
import { Inventory } from '../src/utils/inventory';
import { openLoading, disableLoading } from '../src/store/useLoadingStore';
import { setRole, resetRole } from '../src/store/useAuthStore';
import { Token } from '../src/utils/token';

let inventory;

export const login = async () => {
  try {
    openLoading();
    clearError();
    await storeCommonData();
  } catch (err) {
    const errorMessage = err.response?.data?.detail || 'Authentication failed';
    setError(errorMessage);
    console.error('Login error:', err);
  } finally {
    disableLoading();
  }
};

const storeCommonData = async () => {
  const tk = await Token.Create();
  const data = await tk.fetchTokensObj();
  inventory = new Inventory(tk);
  const { role } = tk.decodeAccessToken;
  if (isValidTokens(data)) {
    inventory.storeAllTokens();
    inventory.storeUserId();
    setRole(role);
  } else throw new Error('Invalid authentication response');
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
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
