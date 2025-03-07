"use client";

import { Alert, AlertTitle } from "@mui/material";
import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";

export default function DashboardClient({
  userPreference,
  newsData,
}: {
  userPreference: any;
  newsData: any;
}) {
  // If user preferences couldn't be fetched, show an error
  if (!userPreference) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert severity="error" className="max-w-md shadow-lg rounded-2xl">
          <AlertTitle>Connection Error</AlertTitle>
          Unable to fetch user preferences. Please ensure your backend is running.
        </Alert>
      </div>
    );
  }

  // If no user preferences, prompt user to set them
  if (!userPreference?.data) {
    return <UserPreferenceModel />;
  }

  // Show loading state if news data isn't available yet
  if (!newsData) {
    return (
      <div className="flex justify-center items-center text-2xl">
        Loading news articles...
      </div>
    );
  }

  return <DashboardArticle news={newsData} />;
}
