const fs = require('fs');
const pool = require('./db');
const nodemailer = require('nodemailer'); 

require('dotenv').config();
const period = process.env.period;
console.log("preiyot:",period);
console.log("mail ",process.env.EMAIL_ADDRESS)

const controller = require('./controller');
const fetchAllStudents=controller.fetchAllStudents;
// // Öğrenci verilerini alma
// const fetchAllStudents = async () => {
//     try {
//         const result = await pool.query('SELECT * FROM Ogrenci');
//         return result.rows;
//     } catch (err) {
//         console.error('Hata:', err);
//         throw err;
//     }
// };
// E-posta ayarları
const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail kullanımı
    auth: {
        user: process.env.EMAIL_ADDRESS, // Gönderen e-posta adresi
        pass: process.env.EMAIL_PASS, // Gönderen e-posta uygulama şifresi
    },
});

// Yedekleme ve raporlama fonksiyonu
const generateBackup = async () => {
  const students = await fetchAllStudents();

  
  const studentData = JSON.stringify(students, null, 2); 

  const backupFileName = `./yedeks/ogrenci-yedek2-${Date.now()}.json`;
  const backupFilePath = `./${backupFileName}`;

  
  fs.writeFileSync(backupFilePath, studentData);

  // E-posta hazırlama
  const emailOptions = {
    from: 'cimen2001humeyra@gmail.com', // Gönderen e-posta adresi
    to: process.env.EMAIL_ADDRESS ,//  Alıcı e-posta adresi
    subject: `Haftalık Öğrenci Yedeği (${backupFileName})`,
    text: 'Herkese merhaba, bu e-posta ekte haftalık öğrenci yedek dosyasını içerir.',
    attachments: [
      {
        filename: backupFileName,
        path: backupFilePath,
      },
    ],
  };

  // E-posta gönder
  try {
    await transporter.sendMail(emailOptions);
    console.log('Haftalık rapor başarıyla gönderildi!');
  } catch (err) {
    console.error('Haftalık rapor gönderilirken hata oluştu:', err);
  } finally {
    // fs.unlinkSync(backupFilePath);
  }
};

// setInterval(generateBackup, 1000 * 60 * 60 * 24 * period);

setInterval(generateBackup, 1000 * 60*period); 

generateBackup();

module.exports = generateBackup;