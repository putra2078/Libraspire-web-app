import { Book } from "@/app/service/axios";

interface BookDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onActionClick?: (book: Book) => void;
    bgClass?: string;
}

export default function BookDetailsModal({
    isOpen,
    onClose,
    book,
    onActionClick,
    bgClass = "bg-gradient-to-br from-yellow-300 to-blue-400 text-white"
}: BookDetailsModalProps) {
    if (!isOpen || !book) return null;

    const isBorrowed = book.status === "borrowed";
    const displayTitle = book.title ? book.title.toUpperCase() : "NO TITLE";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm mx-4 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
                >
                    <i className="bx bx-x text-xl"></i>
                </button>

                <div className={`w-full h-48 rounded-xl mb-6 flex flex-col items-center justify-center text-center px-4 ${bgClass}`}>
                    <h4 className="font-bold text-3xl leading-tight">{displayTitle}</h4>
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-2 truncate" title={book.title}>
                    {book.title}
                </h2>
                <p className="text-gray-500 font-medium mb-4 truncate text-sm">
                    <i className="bx bx-user text-sm"></i> {book.author}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Genre</p>
                        <p className="font-bold text-gray-900 text-sm truncate">{book.genre || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Tahun Terbit</p>
                        <p className="font-bold text-gray-900 text-sm">{book.year || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 col-span-2">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Status</p>
                        <p className="font-bold text-gray-900 text-sm capitalize">{book.status || "available"}</p>
                    </div>
                </div>

                <button
                    onClick={() => onActionClick && onActionClick(book)}
                    className={`w-full py-3.5 text-white rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-md ${isBorrowed ? "bg-gray-500 hover:bg-gray-600" : "bg-gray-900 hover:bg-gray-800"
                        }`}
                >
                    <i className="bx bx-book-reader text-lg"></i>
                    {isBorrowed ? "Kembalikan Buku" : "Mulai Membaca"}
                </button>
            </div>
        </div>
    );
}
