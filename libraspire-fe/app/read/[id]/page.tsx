"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookById, Book } from "@/app/service/axios";

export default function ReadBookPage() {
    const { id } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (id) {
            getBookById(id as string)
                .then((res) => {
                    if (res.success && res.data) {
                        setBook(res.data);
                    } else if (res._id) {
                        // In case backend returns raw object directly
                        setBook(res);
                    }
                })
                .catch((e) => console.error("Error fetching book", e))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-[#f8f7f4]">Loading...</div>;
    }

    if (!book) {
        return <div className="h-screen w-full flex items-center justify-center bg-[#f8f7f4]">Buku tidak ditemukan</div>;
    }

    return (
        <div className="bg-[#f8f7f4] h-screen w-full flex flex-col overflow-hidden font-sans">
            {/* Top Bar */}
            <header className="h-16 flex-shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 z-10">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors"
                >
                    <i className="bx bx-arrow-back text-xl"></i>
                    <span className="hidden sm:inline">Back</span>
                </button>

                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900 text-sm truncate max-w-[200px] md:max-w-xs block">
                        {book.title}
                    </span>
                    <span className="text-xs text-gray-400 font-medium truncate max-w-[160px] md:max-w-xs block">
                        {book.author}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        title="Bookmark this page"
                        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
                    >
                        {isBookmarked ? (
                            <i className="bx bxs-bookmark text-lg text-yellow-400"></i>
                        ) : (
                            <i className="bx bx-bookmark text-lg"></i>
                        )}
                    </button>
                </div>
            </header>

            {/* Reader Area */}
            <main className="flex-1 flex flex-col items-center justify-start overflow-hidden px-4 py-6 md:py-8">
                <div className="w-full max-w-5xl flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                    {book.pdfUrl ? (
                        <iframe
                            src={book.pdfUrl}
                            className="w-full h-full border-none"
                            title={book.title}
                        ></iframe>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <i className="bx bx-error-circle text-4xl mb-4"></i>
                            <p className="font-medium">File PDF tidak tersedia untuk buku ini.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
