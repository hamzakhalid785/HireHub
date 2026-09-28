import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchRecruiterApplications = createAsyncThunk(
  "recruiterApplications/fetchRecruiterApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to load applications."
      );
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "recruiterApplications/updateApplicationStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/applications/${applicationId}/status/`,
        { status }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update application status."
      );
    }
  }
);

const recruiterApplicationsSlice = createSlice({
  name: "recruiterApplications",

  initialState: {
    applications: [],
    loading: false,
    updating: false,
    error: null,
    success: null,
  },

  reducers: {
    clearApplicationMessage: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch applications
      .addCase(fetchRecruiterApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
        state.loading = false;

        state.applications = Array.isArray(action.payload)
          ? action.payload
          : action.payload.results || [];
      })

      .addCase(fetchRecruiterApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = null;
      })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.updating = false;
        state.success = "Application status updated successfully.";

        const updatedApplication = action.payload;

        state.applications = state.applications.map((application) =>
          application.id === updatedApplication.id
            ? updatedApplication
            : application
        );
      })

      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearApplicationMessage } =
  recruiterApplicationsSlice.actions;

export default recruiterApplicationsSlice.reducer;