import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, role: user?.role || null, isAuthenticated: !!token },
  reducers: {
    setCredentials(state, action) {

      console.log("comugn",action.payload)
      const { user_id, email, full_name, mobile_number, role, token } = action.payload.data;
      let userObj = {
        user_id, email, full_name, mobile_number, role
      }
      state.user = userObj;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
