import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import jobsReducer from "../features/jobs/jobsSlice";
import applicationsReducer from "../features/applications/applicationsSlice";
import profileReducer from "../features/profile/profileSlice";
import recruiterReducer from "../features/recruiter/recruiterSlice";
import recruiterApplicationsReducer from "../features/recruiter/recruiterApplicationsSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    profile: profileReducer,
    recruiter: recruiterReducer,
    recruiterApplications: recruiterApplicationsReducer,
    notifications: notificationsReducer,
  },
});