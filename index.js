const express = require('express');
const pool = require("./db");
const app = express();
const controller = require('./controller');
const port = 8000;

app.use(express.json())


app.get('/', (req,res)=>{
    res.send('Hello')
})

app.get('/students', controller.getAllStudent);
app.get('/students/:id', controller.getStudentById);
app.post('/students', controller.createStudent);
app.patch('/students/:id', controller.updateStudent);
app.delete('/students/:id', controller.deleteStudent);

app.get('/Ogrenci_sayac/', controller.getStudentCount);

app.get('/departments', controller.getAllBolum);
app.get('/departments/:id', controller.getBolumById);
app.post('/department', controller.createBolum);
app.patch('/department/:id', controller.updateBolum);
app.delete('/department/:id', controller.deleteBolum);

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