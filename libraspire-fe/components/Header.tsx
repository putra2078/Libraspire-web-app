"use client";

import { useState } from "react";
import { createBook } from "@/app/service/axios";
import AddBookModal from "./AddBookModal";
import SuccessModal from "./SuccessModal";

export default function Header() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const handleAddSubmit = async (data: any) => {
        try {
            await createBook(data);
            setIsAddOpen(false);
            setIsSuccessOpen(true);
            // Let other components know a book was added
            window.dispatchEvent(new Event("book-added"));
        } catch (error) {
            alert("Error adding book");
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        window.dispatchEvent(
            new CustomEvent("search-book", { detail: e.target.value })
        );
    };

    return (
        <>
            <header className="h-24 flex items-center justify-between px-10 flex-shrink-0">
                {/* Search */}
                <div className="relative w-[360px]">
                    <i className="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={handleSearch}
                        className="w-full bg-gray-50 text-sm font-medium rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-600 placeholder-gray-400"
                    />
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="px-5 py-2.5 bg-yellow-400 text-white font-bold rounded-xl shadow-sm hover:bg-yellow-500 transition"
                    >
                        Add Book
                    </button>
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        <i className="bx bx-moon text-xl"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 relative">
                        <i className="bx bx-bell text-xl"></i>
                        <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    </button>
                    <img
                        src="https://i.pravatar.cc/150?img=11"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ml-2"
                    />
                </div>
            </header>

            <AddBookModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSubmit={handleAddSubmit}
            />

            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
            />
        </>
    );
}
