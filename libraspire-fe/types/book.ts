export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  status: "available" | "borrowed";
  pdfUrl?: string | null;
}