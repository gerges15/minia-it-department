import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name:'user',
  initialState:{
    value:{
      name:'',
      password:''
    }
  },
  reducers:{
    setUserName:(state,action)=>{
      state.value.name = action.payload;
    },
    setPassword:(state,action)=>{
      state.value.password= action.payload;
    }
  }
})


export const {setUserName, setPassword} = userSlice.actions;
export default userSlice.reducer;