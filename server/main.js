const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi koneksi MongoDB MongoDB
// Sesuaikan URI ini dengan setup Anda, defaultnya mongodb://localhost:27017
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Nama Database yang akan dipakai (ubah jika perlu)
const dbName = 'libraspire_db';

let db;

// =============== MIDDLEWARE ===============
app.use(express.json());

// Pastikan folder uploads tersedia
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Konfigurasi Multer — simpan PDF ke folder uploads/
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Hanya file PDF yang diperbolehkan'));
    },
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});

// Sajikan file PDF yang sudah diupload secara statis
app.use('/uploads', express.static(UPLOADS_DIR));

// Izinkan CORS agar bisa diakses dari front-end HTML statis Anda
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// =============== ROUTINGS ===============

// Endpoint test ping
app.get('/ping', (req, res) => {
    console.log('Serving ping endpoint');
    res.json({ success: true, message: 'Pong! Server Express berjalan lancar.' });
});

// Contoh Endpoint untuk mengambil data buku dari MongoDB
app.get('/books', async (req, res) => {
    try {
        const collection = db.collection('books');
        const books = await collection.find({}).toArray();
        res.json({ success: true, data: books });
    } catch (error) {
        console.error('Error get books:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const collection = db.collection('books');
        const { id } = req.params;
        const book = await collection.findOne({ _id: new ObjectId(id) });
        if (book) {
            res.json({ success: true, data: book });
        } else {
            res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error get book:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

// Endpoint untuk menyimpan data buku + upload PDF ke MongoDB
app.post('/books', upload.single('pdfFile'), async (req, res) => {
    try {
        const collection = db.collection('books');
        const { title, author, genre, year, status } = req.body;

        // Susun URL publik file PDF (jika ada)
        let pdfUrl = null;
        if (req.file) {
            pdfUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        }

        const result = await collection.insertOne({
            title,
            author,
            genre,
            year: parseInt(year, 10),
            status: status || 'available',
            pdfUrl,
            createdAt: new Date()
        });

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error insert book:', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const collection = db.collection('users');
        const { username, password } = req.body;

        const result = await collection.findOne({
            username,
            password
        });

        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.status(401).json({ success: false, message: 'Username atau password salah' });
        }
    } catch (error) {
        console.error('Error login:', error);
        res.status(500).json({ success: false, message: 'Gagal login' });
    }
});

app.patch('/books/:id', async (req, res) => {
    try {
        const collection = db.collection('books');
        const { id } = req.params;
        const { status } = req.body;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error update book:', error);
        res.status(500).json({ success: false, message: 'Gagal update data' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const collection = db.collection('users');
        const { username, password } = req.body;

        const result = await collection.insertOne({
            username,
            password,
            createdAt: new Date()
        });

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error register:', error);
        res.status(500).json({ success: false, message: 'Gagal register' });
    }
});

// =============== DATABASE CONNECTOR ===============

// Function untuk melakukan koneksi MongoDB & me-listen port secara bersamaan
async function bootstrap() {
    try {
        // Melakukan koneksi ke MongoDB Server
        await client.connect();
        console.log('✅ Berhasil terhubung ke database MongoDB');

        // Setup db instance yang akan digunakan aplikasi (dbName = libraspire_db)
        db = client.db(dbName);

        // Setelah database terhubung, jalankan app express server Anda
        app.listen(PORT, () => {
            console.log(`🚀 Server sedang berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal terhubung ke database MongoDB:', error);
        await client.close();
        process.exit(1);
    }
}

// Menangani penutupan server dengan menutup koneksi database
process.on('SIGINT', async () => {
    await client.close();
    console.log('\nKoneksi MongoDB terputus karena server dimatikan. Shutdown aman.');
    process.exit(0);
});

// Jalankan sistem
bootstrap();

// (Opsional) Meng-export DB ke file lain jika kode program akan dipisah di masa mendatang
module.exports = {
    getDb: () => db
};
