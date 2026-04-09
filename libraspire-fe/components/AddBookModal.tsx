import { useState } from "react";

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
}

export default function AddBookModal({ isOpen, onClose, onSubmit }: AddBookModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        year: "",
        status: "available",
    });
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("author", formData.author);
        fd.append("genre", formData.genre);
        fd.append("year", formData.year);
        fd.append("status", formData.status);
        if (pdfFile) {
            fd.append("pdfFile", pdfFile);
        }
        onSubmit(fd);
    };

    const handleClose = () => {
        setFormData({
            title: "",
            author: "",
            genre: "",
            year: "",
            status: "available",
        });
        setPdfFile(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-xl max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Tambah Buku Baru</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 font-bold text-sm text-gray-700">Judul Buku</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="author" className="block mb-2 font-bold text-sm text-gray-700">Penulis</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            required
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="genre" className="block mb-2 font-bold text-sm text-gray-700">Genre</label>
                        <input
                            type="text"
                            id="genre"
                            name="genre"
                            required
                            value={formData.genre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="year" className="block mb-2 font-bold text-sm text-gray-700">Tahun Terbit</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            required
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pdfFile" className="block mb-2 font-bold text-sm text-gray-700">Upload File PDF</label>
                        <input
                            type="file"
                            id="pdfFile"
                            name="pdfFile"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="status" className="block mb-2 font-bold text-sm text-gray-700">Status</label>
                        <select
                            id="status"
                            name="status"
                            required
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        >
                            <option value="available">Available</option>
                            <option value="borrowed">Borrowed</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
