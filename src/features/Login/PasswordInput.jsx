import { useUserStore } from '../../store/useUserStore.js';

import FormInput from '../../components/Form/FormInput.jsx';

export default function PasswordInput() {
  const { setPassword, userPassword } = useUserStore();

  return (
    <FormInput
      type="password"
      placeholder="Enter Password"
      value={userPassword}
      onChange={setPassword}
      showToggle={true}
    />
  );
}
