import { useDispatch,useSelector } from 'react-redux';
import { setUserName as aSetUsrN } from "../state/userSlice.js";
import { clearErrorMsg } from '../state/errorMsgSlice.js';


export default function UserNameInput() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.loading.value)
  const aUserName = useSelector(state => state.user.value.name)
  const error = useSelector(state => state.errorMsg.value)


  const handleInputChange = function(e){
    const targetValue = e.target.value;
    dispatch(aSetUsrN(targetValue))

    if (error) {
      dispatch(clearErrorMsg())
    }
  }

  
  
  return (
    <div className="mb-5">
      <input
        type="text"
        placeholder="Username"
        value={aUserName}
        onChange={handleInputChange}
        required
        disabled={isLoading}
        className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}
