"use client";

import React from "react";
import { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  bgClass: string;
  onClick: (book: Book, bgClass: string) => void;
  isHorizontal?: boolean;
}

export const BookCard = ({ book, bgClass, onClick, isHorizontal }: BookCardProps) => {
  return (
    <div
      onClick={() => onClick(book, bgClass)}
      className={`group cursor-pointer flex flex-col transition-all duration-300
        ${isHorizontal ? "flex-none w-[180px] snap-start" : "w-full"}`}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md mb-3">
        {book.status === "borrowed" && (
          <div className="absolute top-0 right-3 z-10">
            <div className="w-5 h-7 bg-yellow-400 flex items-center justify-center shadow-md" 
                 style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)" }}>
              <i className="bx bxs-bookmark text-white text-[10px]"></i>
            </div>
          </div>
        )}
        <div className={`w-full h-full ${bgClass} p-5 flex flex-col items-center justify-center text-center`}>
          <h4 className="font-bold text-base leading-tight line-clamp-3 uppercase">
            {book.title}
          </h4>
        </div>
      </div>
      <div className="px-1">
        <h3 className="font-bold text-gray-900 text-sm truncate">{book.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{book.author} • {book.year}</p>
      </div>
    </div>
  );
};