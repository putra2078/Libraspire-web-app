"use client";

import React, { useEffect, useState } from "react";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { BookListHorizontal } from "@/components/BookListHorizontal";
import { Book } from "@/types/book";

export default function DiscoverPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Langsung tembak ke URL Backend temanmu
        const response = await fetch("http://localhost:3000/books");
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setBooks(result.data);
        } else {
          // Jika data kosong, gunakan Mock
          setBooks(MOCK_BOOKS);
        }
      } catch (error) {
        console.error("Fetch error, using dummy data:", error);
        setBooks(MOCK_BOOKS);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (book: Book, bgClass: string) => {
    alert(`Membuka detail: ${book.title}`);
  };

  if (loading) {
    return <div className="p-10 text-gray-500 font-medium">Memuat buku...</div>;
  }
    return(
        <div className="flex flex-col gap-4 px-10 pb-10">
            <h2 className="font-bold text-xl text-gray-800">Popular Now</h2>
            <BookListHorizontal books={books} onBookClick={handleBookClick}/>
        </div>
    )
}