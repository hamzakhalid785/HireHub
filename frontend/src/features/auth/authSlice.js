import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const savedUser = localStorage.getItem("user");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/register/", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Registration failed."
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const tokenResponse = await api.post("/auth/token/", {
        username,
        password,
      });

      const { access, refresh } = tokenResponse.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const userResponse = await api.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      localStorage.setItem(
        "user",
        JSON.stringify(userResponse.data)
      );

      return {
        user: userResponse.data,
        accessToken: access,
        refreshToken: refresh,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Invalid username or password."
      );
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me/");
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load user."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Me
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;