import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      const response = await api.get("/jobs/", {
        params: cleanParams,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load jobs."
      );
    }
  }
);

export const fetchJob = createAsyncThunk(
  "jobs/fetchJob",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load job."
      );
    }
  }
);

const initialState = {
  jobs: [],
  selectedJob: null,
  count: 0,
  next: null,
  previous: null,
  loading: false,
  detailLoading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;

        state.jobs = action.payload.results || [];
        state.count = action.payload.count || 0;
        state.next = action.payload.next || null;
        state.previous = action.payload.previous || null;
      })

      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchJob.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })

      .addCase(fetchJob.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedJob = action.payload;
      })

      .addCase(fetchJob.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedJob } = jobsSlice.actions;

export default jobsSlice.reducer;