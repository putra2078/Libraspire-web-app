import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    status: 'available' | 'borrowed';
    pdfUrl?: string;
}

export const getBooks = async () => {
    try {
        const response = await api.get('/books');
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const getBookById = async (id: string) => {
    try {
        const response = await api.get(`/books/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book ${id}:`, error);
        throw error;
    }
};

export const createBook = async (bookData: FormData) => {
    try {
        const response = await api.post('/books', bookData);
        return response.data;
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};

export const borrowBook = async (id: string, status: 'borrowed' | 'available') => {
    try {
        const response = await api.patch(`/books/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating book status for ID ${id}:`, error);
        throw error;
    }
};

export default api;
