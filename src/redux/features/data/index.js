import { createSlice } from '@reduxjs/toolkit';


const dataSlice = createSlice({
  name: 'data',
  initialState: {data:{authorization: null, admin: false}},
  reducers:{
    setAuth (state,action){
      state.data.authorization = action.payload.authorization;
      state.data.admin = action.payload.admin;
    }
  }
});

export const dataAction = dataSlice.actions;

export default dataSlice;