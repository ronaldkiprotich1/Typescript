import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('/api/users/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Registration failed');
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('/api/users/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
