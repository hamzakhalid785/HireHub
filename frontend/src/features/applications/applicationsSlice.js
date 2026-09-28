import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const applyForJob = createAsyncThunk(
  "applications/applyForJob",
  async ({ jobId, coverLetter = "" }, { rejectWithValue }) => {
    try {
      const response = await api.post("/applications/", {
        job: jobId,
        cover_letter: coverLetter,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to submit application."
      );
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load applications."
      );
    }
  }
);

export const fetchSavedJobs = createAsyncThunk(
  "applications/fetchSavedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications/saved/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load saved jobs."
      );
    }
  }
);

export const saveJob = createAsyncThunk(
  "applications/saveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.post("/applications/saved/", {
        job: jobId,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to save job."
      );
    }
  }
);

export const deleteSavedJob = createAsyncThunk(
  "applications/deleteSavedJob",
  async (savedJobId, { rejectWithValue }) => {
    try {
      await api.delete(`/applications/saved/${savedJobId}/`);

      return savedJobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove saved job."
      );
    }
  }
);

const initialState = {
  applications: [],
  savedJobs: [],

  loading: false,
  savedLoading: false,
  submitting: false,
  saving: false,

  error: null,
  success: null,
};

const applicationsSlice = createSlice({
  name: "applications",

  initialState,

  reducers: {
    clearApplicationMessage: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Apply
      .addCase(applyForJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = null;
      })

      .addCase(applyForJob.fulfilled, (state, action) => {
        state.submitting = false;
        state.success =
          "Application submitted successfully.";

        state.applications.unshift(action.payload);
      })

      .addCase(applyForJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // My Applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.results || [];
      })

      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Saved Jobs
      .addCase(fetchSavedJobs.pending, (state) => {
        state.savedLoading = true;
        state.error = null;
      })

      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.savedLoading = false;
        state.savedJobs = action.payload.results || [];
      })

      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.savedLoading = false;
        state.error = action.payload;
      })

      // Save
      .addCase(saveJob.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.success = null;
      })

      .addCase(saveJob.fulfilled, (state, action) => {
        state.saving = false;
        state.success = "Job saved successfully.";

        state.savedJobs.unshift(action.payload);
      })

      .addCase(saveJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // Remove saved
      .addCase(deleteSavedJob.fulfilled, (state, action) => {
        state.success = "Job removed from saved jobs.";

        state.savedJobs = state.savedJobs.filter(
          (job) => job.id !== action.payload
        );
      })

      .addCase(deleteSavedJob.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearApplicationMessage,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;