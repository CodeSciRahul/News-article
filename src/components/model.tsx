"use client";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { categories, languages, locations } from "@/constant/properties";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

// Form validation schema
const preferencesSchema = z.object({
  category: z.array(z.string()).min(1, "Select at least one category"),
  language: z.string().nonempty("Language is required"),
  location: z.string().nonempty("Location is required"),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UserPreferenceModel() {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
  });

  const { getToken } = useAuth();


  const createUserPreference = async (
    newData: PreferencesForm
  ): Promise<MutationResponse> => {
    const token = await getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-preference`,
      newData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  // Using useMutation
  interface MutationResponse {
    userId: string,
    category: string[],
    language: string,
    location: string  
  }

  interface MutationError {
    message: string;
  }

  const { mutate } = useMutation<
  MutationResponse,
  MutationError,
  PreferencesForm
>({
  mutationFn: createUserPreference,
  onSuccess: (response) => {
    toast.success("Preferences saved successfully!");
    console.log("Data created successfully", response);
  },
  onError: (error) => {
    toast.error("Failed to save preferences.");
    console.error("Error creating data", error);
  },
});

  // Handle form submission
  const onSubmit = (data: PreferencesForm) => {
    mutate(data);
  };

  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Set Your Preferences to Personalize Your News Feed
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Please select your preferences to tailor the news articles to your
            interests.
          </p>
          <Button onClick={() => handleOpen()} className="mt-4">
            Set Preferences
          </Button>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Set Your Preferences
            </Typography>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ marginTop: "1rem" }}
            >
              {/* Categories Selection */}
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="categories-label">Categories</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="categories-label"
                      multiple
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.category && (
                  <Typography color="error">
                    {errors.category.message}
                  </Typography>
                )}
              </FormControl>

              {/* Language Selection */}
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="language-label">Language</InputLabel>
                <Controller
                  name="language"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="language-label"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {languages.map((lang) => (
                        <MenuItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.language && (
                  <Typography color="error">
                    {errors.language.message}
                  </Typography>
                )}
              </FormControl>

              {/* Location Selection */}
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="location-label">Location</InputLabel>
                <Controller
                  name="location"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="location-label"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {locations.map((loc) => (
                        <MenuItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.location && (
                  <Typography color="error">
                    {errors.location.message}
                  </Typography>
                )}
              </FormControl>

              {/* Submit Button */}
              <Button type="submit" variant="contained" fullWidth>
                Save Preferences
              </Button>
            </form>
          </Box>
        </Modal>
        <Toaster />
      </div>
    </>
  );
}
