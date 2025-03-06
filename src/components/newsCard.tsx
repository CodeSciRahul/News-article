// components/NewsCard.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import { Card,CardContent } from '@mui/material';

interface NewsCardProps {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, link, snippet, date, source, imageUrl }) => {
  return (
    <Card className="flex flex-col md:flex-row bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
    {/* Image Section */}
    <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 relative">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
      />
    </div>

    {/* Content Section */}
    <CardContent className="flex flex-col justify-between p-4 w-full">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg md:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
      >
        {title}
      </a>
      <p className="text-sm md:text-base text-gray-700 mt-2 line-clamp-3">
        {snippet}
      </p>
      <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-3 border-t pt-2">
        <span className="font-medium">{source}</span>
        <span>{date}</span>
      </div>
    </CardContent>
  </Card>
  );
};

export default NewsCard;