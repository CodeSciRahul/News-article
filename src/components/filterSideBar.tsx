// components/FilterSidebar.tsx
"use client"
import React, { useState } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
const [filters, setFilters] = useState({
  category: searchParams.get("category") || "",
  date: searchParams.get("date") || "",
  title: searchParams.get("title") || "",
  source: searchParams.get("source") || "",
  snippet: searchParams.get("snippet") || "",
});


  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters and update the URL
  const applyFilters = () => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    router.push(`?${searchParams.toString()}`);
  };

  //clear filter
  const clearFilters = () => {
    setFilters({
      category: "",
      date: "",
      title: "",
      source: "",
      snippet: "",
    });
    router.push('/');
  };

  

  return (
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
          <Button variant="contained" color="primary" onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button variant="outlined" color="secondary" onClick={clearFilters} className="w-full">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
