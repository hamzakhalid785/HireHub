import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ---------------- COMPANY ----------------

export const fetchCompanies = createAsyncThunk(
  "recruiter/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/companies/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load companies."
      );
    }
  }
);

export const createCompany = createAsyncThunk(
  "recruiter/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/companies/",
        companyData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create company."
      );
    }
  }
);

export const updateCompany = createAsyncThunk(
  "recruiter/updateCompany",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/companies/${id}/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update company."
      );
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "recruiter/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/companies/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete company."
      );
    }
  }
);

// ---------------- JOBS ----------------

export const fetchRecruiterJobs = createAsyncThunk(
  "recruiter/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/jobs/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load jobs."
      );
    }
  }
);

export const createJob = createAsyncThunk(
  "recruiter/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/jobs/",
        jobData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create job."
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  "recruiter/updateJob",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/jobs/${id}/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update job."
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  "recruiter/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete job."
      );
    }
  }
);

const initialState = {
  companies: [],
  jobs: [],

  loadingCompanies: false,
  savingCompany: false,

  loadingJobs: false,
  savingJob: false,

  error: null,
  success: null,
};

const recruiterSlice = createSlice({
  name: "recruiter",

  initialState,

  reducers: {
    clearRecruiterMessage: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loadingCompanies = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loadingCompanies = false;
        state.companies =
          action.payload.results || action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loadingCompanies = false;
        state.error = action.payload;
      })

      .addCase(createCompany.pending, (state) => {
        state.savingCompany = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.savingCompany = false;
        state.companies.push(action.payload);
        state.success = "Company created successfully.";
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.savingCompany = false;
        state.error = action.payload;
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companies = state.companies.map((company) =>
          company.id === action.payload.id
            ? action.payload
            : company
        );

        state.success = "Company updated successfully.";
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (company) => company.id !== action.payload
        );

        state.success = "Company deleted successfully.";
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Jobs
      .addCase(fetchRecruiterJobs.pending, (state) => {
        state.loadingJobs = true;
        state.error = null;
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.loadingJobs = false;
        state.jobs =
          action.payload.results || action.payload;
      })
      .addCase(fetchRecruiterJobs.rejected, (state, action) => {
        state.loadingJobs = false;
        state.error = action.payload;
      })

      .addCase(createJob.pending, (state) => {
        state.savingJob = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.savingJob = false;
        state.jobs.unshift(action.payload);
        state.success = "Job created successfully.";
      })
      .addCase(createJob.rejected, (state, action) => {
        state.savingJob = false;
        state.error = action.payload;
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.map((job) =>
          job.id === action.payload.id
            ? action.payload
            : job
        );

        state.success = "Job updated successfully.";
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(
          (job) => job.id !== action.payload
        );

        state.success = "Job deleted successfully.";
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearRecruiterMessage,
} = recruiterSlice.actions;

export default recruiterSlice.reducer;