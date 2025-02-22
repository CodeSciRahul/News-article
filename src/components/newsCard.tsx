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
    <Card className="flex flex-col md:flex-row mb-4 p-4 shadow-lg">
      <Image src={imageUrl} alt={title} width={150} height={100} className="rounded object-cover" />
      <CardContent className="flex flex-col justify-between ml-4">
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">
          {title}
        </a>
        <p className="text-sm text-gray-600 mt-2">{snippet}</p>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{source}</span>
          <span>{date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;