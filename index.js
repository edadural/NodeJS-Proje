const express = require('express');
const pool = require("./db");
const app = express();
const controller = require('./controller');
const { login, register } = require('./authController');
const authMiddleware = require('./authMiddleware');
const port = 8000;

app.use(express.json())


// Kimlik doğrulama rotaları
//const authRoutes = require('./authRoutes');
//app.use('/api/auth', authRoutes);

app.post('/login', login);
app.post('/register', register);


app.get('/', (req,res)=>{
    res.send('Hello')
})

app.get('/students', authMiddleware, controller.getAllStudent);
app.get('/students/:id', authMiddleware, controller.getStudentById);
app.post('/students', authMiddleware, controller.createStudent);
app.patch('/students/:id', authMiddleware, controller.updateStudent);
app.delete('/students/:id', authMiddleware, controller.deleteStudent);

app.get('/Ogrenci_sayac/', authMiddleware, controller.getStudentCount);

app.get('/departments', authMiddleware, controller.getAllBolum);
app.get('/departments/:id', authMiddleware, controller.getBolumById);
app.post('/department', authMiddleware, controller.createBolum);
app.patch('/department/:id', authMiddleware, controller.updateBolum);
app.delete('/department/:id', authMiddleware, controller.deleteBolum);

pool.connect()
    .then(() => {
        console.log('Veritabanı bağlantısı kuruldu.');

        controller.createTables();

        app.listen(port, () => {
            console.log(`Sunucu ${port} portunda çalışıyor.`);
        });
    })
    .catch(err => {
        console.error('Veritabanı bağlantısı kurulurken hata oluştu:', err);
    });