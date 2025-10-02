const express = require('express');
const app = express();
const port = 3500;
const path = require('path'); // مطلوب للمسارات الثابتة

// تهيئة الملفات الثابتة:
// 1. لخدمة ملفات الواجهة الأمامية (index.html, script.js, style.css)
app.use('/public', express.static(path.join(__dirname, 'public')));
// 2. لخدمة صور المنتجات المحملة
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json()); // للسماح بقراءة JSON في الطلبات

// المسار الجذري لخدمة صفحة الواجهة الأمامية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ربط مسارات الـ API بالـ Router
app.use('/p', require('./routes/products_R'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});