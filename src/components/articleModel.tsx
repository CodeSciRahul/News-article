"use client"
import React from "react";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700">{description}</p>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ArticleModal;
