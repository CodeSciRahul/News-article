"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Drawer,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    date: searchParams.get("date") || "",
    title: searchParams.get("title") || "",
    source: searchParams.get("source") || "",
    snippet: searchParams.get("snippet") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    router.push(`?${searchParams.toString()}`);
    setDrawerOpen(false); // Close drawer after applying filters
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      date: "",
      title: "",
      source: "",
      snippet: "",
    });
    router.push("/dashboard");
    setDrawerOpen(false);
  };

  return (
    <div>
      {/* Mobile Filter Icon */}
      <div className="lg:hidden p-2 flex justify-end">
        <IconButton onClick={() => setDrawerOpen(true)}>
          <FilterList />
        </IconButton>
      </div>

      {/* Sidebar for larger screens */}
      <div className="hidden lg:block w-78">
        <Card className="w-full p-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <TextField
                label="Category"
                variant="outlined"
                name="category"
                value={filters.category}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Date"
                variant="outlined"
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Title"
                variant="outlined"
                name="title"
                value={filters.title}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Source"
                variant="outlined"
                name="source"
                value={filters.source}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Snippet"
                variant="outlined"
                name="snippet"
                value={filters.snippet}
                onChange={handleChange}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={applyFilters}
                className="w-full"
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-72 p-4">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <TextField
              label="Category"
              variant="outlined"
              name="category"
              value={filters.category}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Date"
              variant="outlined"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Title"
              variant="outlined"
              name="title"
              value={filters.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Source"
              variant="outlined"
              name="source"
              value={filters.source}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Snippet"
              variant="outlined"
              name="snippet"
              value={filters.snippet}
              onChange={handleChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={applyFilters}
              className="w-full"
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default FilterSidebar;
