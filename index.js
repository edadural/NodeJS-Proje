const express = require('express'); // HTTP sunucusu oluşturma ve yönetme 
const pool = require("./db");       // veritabanı işlemlerini gerçekleştirmek için kullanılacak bağlantıların yönetimi
const app = express();              // Express uygulaması oluşturuluyor
const controller = require('./controller');     // CRUD 
const port = 8000;                  // Sunucunun dinleyeceği port

app.use(express.json())             // gelen isteklerdeki JSON verilerini ayrıştırmak, req.body üzerinden erişilebilir hale getirir

app.get('/', (req,res)=>{           // sunucunun çalışıp çalışmadığını test etmek için kök dizine yapılan istek
    res.send('Hello')
})

// uygulamada öğrenci ve bölüm kayıtlarını işlemek için HTTP isteklerini yönlendirir
app.get('/students', controller.getAllStudent);
app.get('/students/:id', controller.getStudentById);
app.post('/students', controller.createStudent);
app.patch('/students/:id', controller.updateStudent);
app.delete('/students/:id', controller.deleteStudent);

app.get('/departments', controller.getAllBolum);
app.get('/departments/:id', controller.getBolumById);
app.post('/department', controller.createBolum);
app.patch('/department/:id', controller.updateBolum);
app.delete('/department/:id', controller.deleteBolum);

pool.connect()              // veritabanıyla bağlantı kuruldu
    .then(() => {
        console.log('Veritabanı bağlantısı kuruldu.');

        controller.createTables();      // tabloların oluşturulması için createTables fonksiyonu çağrılır

        app.listen(port, () => {        // sunucu belirtilen portta dinlemeye başlar
            console.log(`Sunucu ${port} portunda çalışıyor.`);
        });
    })
    .catch(err => {
        console.error('Veritabanı bağlantısı kurulurken hata oluştu:', err);
    });