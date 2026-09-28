import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/profile/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load profile."
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        "/users/profile/",
        profileData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update profile."
      );
    }
  }
);

export const fetchSkills = createAsyncThunk(
  "profile/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/skills/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load skills."
      );
    }
  }
);

export const fetchEducation = createAsyncThunk(
  "profile/fetchEducation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/education/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load education."
      );
    }
  }
);

export const addEducation = createAsyncThunk(
  "profile/addEducation",
  async (educationData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/users/education/",
        educationData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add education."
      );
    }
  }
);

export const updateEducation = createAsyncThunk(
  "profile/updateEducation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/users/education/${id}/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update education."
      );
    }
  }
);

export const deleteEducation = createAsyncThunk(
  "profile/deleteEducation",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/education/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete education."
      );
    }
  }
);

export const fetchExperience = createAsyncThunk(
  "profile/fetchExperience",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/experience/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load experience."
      );
    }
  }
);

export const addExperience = createAsyncThunk(
  "profile/addExperience",
  async (experienceData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/users/experience/",
        experienceData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add experience."
      );
    }
  }
);

export const updateExperience = createAsyncThunk(
  "profile/updateExperience",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/users/experience/${id}/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update experience."
      );
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "profile/deleteExperience",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/experience/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete experience."
      );
    }
  }
);

const initialState = {
  profile: null,
  skills: [],
  education: [],
  experience: [],

  loading: false,
  saving: false,
  skillsLoading: false,

  error: null,
  success: null,
};

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    clearProfileMessage: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = action.payload;
        state.success = "Profile updated successfully.";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // Skills
      .addCase(fetchSkills.pending, (state) => {
        state.skillsLoading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skillsLoading = false;
        state.skills = action.payload.results || action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.skillsLoading = false;
        state.error = action.payload;
      })

      // Education
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.education = action.payload.results || action.payload;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.education.unshift(action.payload);
        state.success = "Education added successfully.";
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.education = state.education.map((item) =>
          item.id === action.payload.id
            ? action.payload
            : item
        );
        state.success = "Education updated successfully.";
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.education = state.education.filter(
          (item) => item.id !== action.payload
        );
        state.success = "Education removed.";
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Experience
      .addCase(fetchExperience.fulfilled, (state, action) => {
        state.experience = action.payload.results || action.payload;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.experience.unshift(action.payload);
        state.success = "Experience added successfully.";
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.experience = state.experience.map((item) =>
          item.id === action.payload.id
            ? action.payload
            : item
        );
        state.success = "Experience updated successfully.";
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experience = state.experience.filter(
          (item) => item.id !== action.payload
        );
        state.success = "Experience removed.";
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProfileMessage } =
  profileSlice.actions;

export default profileSlice.reducer;