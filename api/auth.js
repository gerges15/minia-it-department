import { clearError, setError } from '../src/store/useErrorMessageStore';
import { Inventory } from '../src/utils/inventory';
import { openLoading, disableLoading } from '../src/store/useLoadingStore';
import { setRole, resetRole } from '../src/store/useAuthStore';
import { setInventory, getInventory } from '../src/store/usInventoryStore';
import { Token } from '../src/utils/token';

export const login = async () => {
  try {
    openLoading();
    clearError();
    await storeCommonData();
  } catch (err) {
    setError(err.response?.data?.detail || 'Authentication failed');
    console.error('Login error:', err);
  } finally {
    disableLoading();
  }
};

const storeCommonData = async () => {
  const tk = await Token.Create();
  const data = await tk.fetchTokensObj();
  const inventory = new Inventory(tk);
  const { role } = tk.decodeAccessToken;

  if (isValidTokens(data)) {
    inventory.storeAllTokens();
    inventory.storeUserId();
    setRole(role);
    setInventory(data);
  } else throw new Error('Invalid authentication response');
};

const isValidTokens = function (data) {
  return data.accessToken || data.refreshToken || data.refreshTokenExpireTime;
};

export const logout = async () => {
  try {
    removeCommonData();
    resetRole();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const removeCommonData = () => {
  const raw = getInventory();
  const inventory = new Inventory(raw);

  inventory.removeAllTokens();
  inventory.removeUserId();
  inventory.removeUserRole();
};
