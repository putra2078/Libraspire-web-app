"use client";

import { useEffect, useState } from "react";
import { getBooks, borrowBook, Book } from "@/app/service/axios";
import BookDetailsModal from "@/components/BookDetailsModal";
import SuccessModal from "@/components/SuccessModal";

const gradients = [
  "bg-gradient-to-br from-yellow-300 to-blue-400 text-white",
  "bg-white border border-gray-100 text-orange-500",
  "bg-blue-700 text-white",
  "bg-pink-400 text-white",
  "bg-[#d2e4df] text-[#1c3c3a]",
  "bg-gradient-to-b from-[#e3e8e4] to-[#bac9bc] text-gray-700",
  "bg-purple-500 text-white",
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBgClass, setSelectedBgClass] = useState(gradients[0]);
  const [successModalConfig, setSuccessModalConfig] = useState<{
    isOpen: boolean;
    status: "success" | "failed";
    title: string;
    message: string;
  }>({
    isOpen: false,
    status: "success",
    title: "",
    message: "",
  });

  const fetchAllBooks = async () => {
    try {
      const res = await getBooks();
      if (res.success && res.data) {
        setBooks(res.data.reverse());
        setFilteredBooks(res.data);
      }
    } catch (e) {
      console.error("Failed fetching books");
    }
  };

  useEffect(() => {
    fetchAllBooks();

    const handleBookAdded = () => fetchAllBooks();
    const handleSearch = (e: any) => {
      const query = e.detail.toLowerCase();
      if (!query) {
        setFilteredBooks(books);
      } else {
        setFilteredBooks(
          books.filter((b) =>
            (b.title && b.title.toLowerCase().includes(query)) ||
            (b.author && b.author.toLowerCase().includes(query))
          )
        );
      }
    };

    window.addEventListener("book-added", handleBookAdded);
    window.addEventListener("search-book", handleSearch);

    return () => {
      window.removeEventListener("book-added", handleBookAdded);
      window.removeEventListener("search-book", handleSearch);
    };
  }, [books]); // Need to re-bind when books changes so search closure is fresh

  const handleCardClick = (book: Book, bgClass: string) => {
    setSelectedBook(book);
    setSelectedBgClass(bgClass);
    setIsDetailsOpen(true);
  };

  const handleBookAction = async (book: Book) => {
    const isBorrowed = book.status === "borrowed";
    if (isBorrowed) {
      try {
        await borrowBook(book._id, "available");
        setSuccessModalConfig({
          isOpen: true,
          status: "success",
          title: "Buku Dikembalikan!",
          message: `Buku "${book.title}" berhasil dikembalikan. Terima kasih.`,
        });
        setIsDetailsOpen(false);
        fetchAllBooks();
      } catch (e: any) {
        setSuccessModalConfig({
          isOpen: true,
          status: "failed",
          title: "Gagal Mengembalikan",
          message: "Terdapat kendala saat mengembalikan buku. Silakan coba lagi.",
        });
      }
    } else {
      try {
        await borrowBook(book._id, "borrowed");
        setIsDetailsOpen(false);
        window.location.href = `/read/${book._id}`;
      } catch (e: any) {
        alert("Gagal meminjam buku.");
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 pb-10">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-gray-800 text-white rounded-full text-sm font-semibold shadow-md whitespace-nowrap">
            Popular
          </button>
          <button className="px-6 py-2.5 text-gray-500 hover:bg-gray-50 rounded-full text-sm font-semibold transition whitespace-nowrap">
            Top Selling
          </button>
          <button className="px-6 py-2.5 text-gray-500 hover:bg-gray-50 rounded-full text-sm font-semibold transition whitespace-nowrap">
            Following
          </button>
          <button className="px-6 py-2.5 text-gray-500 hover:bg-gray-50 rounded-full text-sm font-semibold transition whitespace-nowrap">
            New
          </button>
        </div>
        <button className="text-sm font-bold text-gray-800 hover:text-blue-600 flex items-center gap-1">
          Next <i className="bx bx-chevron-right text-lg"></i>
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.length === 0 ? (
          <p className="col-span-full text-gray-500 py-10 font-medium text-center">
            Buku tidak ditemukan.
          </p>
        ) : (
          filteredBooks.map((book, idx) => {
            const bgClass = gradients[idx % gradients.length];
            const isBorrowed = book.status === "borrowed";
            const displayTitle = book.title ? book.title.toUpperCase() : "NO TITLE";

            return (
              <div
                key={book._id}
                onClick={() => handleCardClick(book, bgClass)}
                className="flex flex-col cursor-pointer group"
              >
                <div className="relative rounded-xl overflow-visible mb-4 shadow-sm group-hover:shadow-md transition">
                  {isBorrowed && (
                    <div
                      className="absolute top-0 right-3 z-10 flex flex-col items-center"
                      title="Sedang dipinjam"
                    >
                      <div
                        className="w-6 h-8 bg-yellow-400 flex items-end justify-center pb-1 shadow-md"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)" }}
                      >
                        <i className="bx bxs-bookmark text-white text-xs"></i>
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-xl overflow-hidden aspect-[2/3] ${bgClass} p-4 flex flex-col items-center justify-center text-center`}
                  >
                    <h4 className="font-bold text-xl leading-tight break-words px-2">{displayTitle}</h4>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-[15px] truncate" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {book.author} &middot; {book.year}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Progress List */}
      <div className="mt-8 flex flex-col gap-4">
        {/* Item 1 */}
        <div className="flex items-center gap-6 justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl -ml-2 transition">
          <div className="flex items-center gap-4 w-[240px]">
            <div
              className="w-8 h-[46px] bg-pink-100 rounded-sm bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop')",
              }}
            ></div>
            <h4 className="font-bold text-gray-800 text-sm truncate">Hold back the star</h4>
          </div>
          <span className="text-xs font-semibold text-gray-500 w-16 text-right">121 page</span>
          <div className="flex-1 max-w-[200px] h-[6px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-800 rounded-full" style={{ width: "64%" }}></div>
          </div>
          <span className="text-xs font-semibold text-gray-500 w-24 text-right">64% complete</span>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-6 justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl -ml-2 transition">
          <div className="flex items-center gap-4 w-[240px]">
            <div
              className="w-8 h-[46px] bg-gray-800 rounded-sm bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100&h=100&fit=crop')",
              }}
            ></div>
            <h4 className="font-bold text-gray-800 text-sm truncate">One day a novel</h4>
          </div>
          <span className="text-xs font-semibold text-gray-500 w-16 text-right">11 page</span>
          <div className="flex-1 max-w-[200px] h-[6px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-800 rounded-full" style={{ width: "45%" }}></div>
          </div>
          <span className="text-xs font-semibold text-gray-500 w-24 text-right">45% complete</span>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-6 justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl -ml-2 transition">
          <div className="flex items-center gap-4 w-[240px]">
            <div
              className="w-8 h-[46px] bg-blue-200 rounded-sm bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop')",
              }}
            ></div>
            <h4 className="font-bold text-gray-800 text-sm truncate">In the company of...</h4>
          </div>
          <span className="text-xs font-semibold text-gray-500 w-16 text-right">21 page</span>
          <div className="flex-1 max-w-[200px] h-[6px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-800 rounded-full" style={{ width: "52%" }}></div>
          </div>
          <span className="text-xs font-semibold text-gray-500 w-24 text-right">52% complete</span>
        </div>
      </div>

      <BookDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        book={selectedBook}
        bgClass={selectedBgClass}
        onActionClick={handleBookAction}
      />

      <SuccessModal
        isOpen={successModalConfig.isOpen}
        onClose={() => setSuccessModalConfig(prev => ({ ...prev, isOpen: false }))}
        status={successModalConfig.status}
        title={successModalConfig.title}
        message={successModalConfig.message}
      />
    </div>
  );
}
