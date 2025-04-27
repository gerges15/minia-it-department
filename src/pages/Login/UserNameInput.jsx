import { useUserStore } from '../../store/useUserStore.js';
import FormInput from '../../components/Form/FormInput.jsx';

export default function UserNameInput() {
  const { setUserName, userName } = useUserStore();

  return (
    <FormInput
      type="text"
      placeholder="Username"
      value={userName}
      onChange={setUserName}
      showToggle={false}
    />
  );
}
