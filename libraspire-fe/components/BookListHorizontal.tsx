"use client";

import { Book } from "@/types/book";
import { BookCard } from "./BookCard";
import { GRADIENTS } from "@/data/mockBooks";

export const BookListHorizontal = ({ books, onBookClick }: { books: Book[], onBookClick: any }) => (
  <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x px-10 ">
    {books.map((book, idx) => (
      <BookCard 
        key={book._id} 
        book={book} 
        bgClass={GRADIENTS[idx % GRADIENTS.length]} 
        onClick={onBookClick} 
        isHorizontal 
      />
    ))}
  </div>
);