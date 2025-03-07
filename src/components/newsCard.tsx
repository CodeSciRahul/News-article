// components/NewsCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@mui/material";
import ArticleModal from "./articleModel";

interface NewsCardProps {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl: string;
  category?: string;
  description: string; // Full description of the article
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  link,
  snippet,
  date,
  source,
  imageUrl,
  category,
  description,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* News Card */}
      <Card
        className="flex flex-col md:flex-row bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
      >
        {/* Category Badge */}
        {category && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {category}
          </span>
        )}

        {/* Image Section */}
        <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 relative">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
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
          {/* Read More Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
          >
            Read More
          </button>
        </CardContent>
      </Card>

      {/* Article Modal */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
      />
    </>
  );
};

export default NewsCard;
