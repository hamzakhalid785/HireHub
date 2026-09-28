import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to load notifications."
      );
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/notifications/${notificationId}/read/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to mark notification as read."
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",

  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = Array.isArray(action.payload)
          ? action.payload
          : action.payload.results || [];
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload;

        state.notifications = state.notifications.map((notification) =>
          notification.id === updated.id ? updated : notification
        );
      });
  },
});

export default notificationsSlice.reducer;