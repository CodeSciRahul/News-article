// components/ui/Loader.tsx
import React from "react";
import { CircularProgress } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64 w-full">
      <div className="flex flex-col items-center space-y-4">
        <CircularProgress size={60} thickness={5} color="primary" />
        <p className="text-lg font-medium text-gray-600">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loader;
