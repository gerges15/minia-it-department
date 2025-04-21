import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  
  name:'loading',
  initialState:{
    value:false
  }
  ,
  reducers:{
    openLoading: (state) =>{
      state.value = true;
    }
    ,
    disableLoading:(state) =>{
      state.value = false
    }
  }
})


export const {openLoading, disableLoading} = loadingSlice.actions;
export default loadingSlice.reducer;