interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    status?: "success" | "failed";
    title?: string;
    message?: string;
}

export default function SuccessModal({
    isOpen,
    onClose,
    status = "success",
    title: externalTitle,
    message: externalMessage
}: SuccessModalProps) {
    if (!isOpen) return null;

    const isSuccess = status === "success";

    const title = externalTitle ?? (isSuccess ? "Berhasil!" : "Gagal!");
    const message = externalMessage ?? (isSuccess ? "Data buku baru telah sukses ditambahkan ke database MongoDB." : "Terjadi kesalahan saat memproses permintaan.");

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center shadow-lg text-center mx-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isSuccess ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
                    }`}>
                    <i className={`bx ${isSuccess ? "bx-check text-5xl" : "bx-x text-6xl"}`}></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-500 mb-8 font-medium text-sm">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
