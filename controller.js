const fs = require('fs');
const pool = require("./db");

const createTables = async () => {
    try {
        const sql = fs.readFileSync('schema.sql', 'utf8');
        await pool.query(sql);
        console.log('Tablolar oluşturuldu.');
    } catch (error) {
        console.error('Hata:', error);
    }
};

// STUDENT CONTROLLER
// Öğrenci verilerini alma
const fetchAllStudents = async () => {
    try {
        const result = await pool.query('SELECT * FROM Ogrenci');
        return result.rows;
    } catch (err) {
        console.error('Hata:', err);
        throw err;
    }
};

const getAllStudent = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Ogrenci');
        return res.status(200).send({ status: true, message: 'Kayıt listelendi.', data: result.rows });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Kayıt Listeleme Sırasında Hata Oluştu. Hata: ' + err });
    } finally {
    }
};

const getStudentById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Ogrenci WHERE id = $1', [id]);
        return res.status(200).send({ status: true, message: 'Öğrenci bulundu.', data: result.rows });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Öğrenci Bulma Sırasında Hata Oluştu. Hata: ' + err });
    } finally {
    }
};
// const updaterCouter=async()=>{
//   let counter=await fetchAllStudents();
//   if(!counter){
//       return false;
//   }else{
//       return counter.length;
//   }  
// }
const createStudent = async (req, res) => {
    const { name, email, deptid } = req.body;
    try {
      const result = await pool.query('INSERT INTO Ogrenci (name, email, deptid) VALUES ($1, $2, $3) RETURNING *', [name, email, deptid]);
      
      // Öğrenci oluşturulduktan sonra sayaç güncellendi
      await pool.query('UPDATE Ogrenci_sayac SET sayac = sayac + 1');
  
      return res.status(201).send({ status: true, message: 'Öğrenci oluşturuldu.', data: result.rows });
    } catch (err) {
      console.error('Hata:', err);
      return res.status(500).send({ status: false, message: 'Öğrenci Oluşturma Sırasında Hata Oluştu. Hata: ' + err });
    } finally {
    }
  };
  

const updateStudent = async (req, res) => {
    const id = req.params.id;
    const { name, email, deptid } = req.body;

    const updatedFields = [];
    if (name) updatedFields.push('name');
    if (email) updatedFields.push('email');
    if (deptid) updatedFields.push('deptid');

    if (updatedFields.length === 0) {
        return res.status(400).send({ status: false, message: 'En az bir alan güncellenmelidir.' });
    }

    const sql = `UPDATE Ogrenci SET ${updatedFields.map((field) => `${field} = $${updatedFields.indexOf(field) + 1}`).join(', ')} WHERE id = $${updatedFields.length + 1} RETURNING *`;

    try {
        const result = await pool.query(sql, [...updatedFields.map((field) => req.body[field]), id]);
        return res.status(200).send({ status: true, message: 'Öğrenci güncellendi.', data: result.rows });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Öğrenci güncelleme sırasında bir hata oluştu.', error: err });
    }
};

const deleteStudent = async (req, res) => {
    const id = req.params.id;
    try {
      await pool.query('DELETE FROM Ogrenci WHERE id = $1', [id]);
  
      // Öğrenci silindikten sonra sayaç güncellendi
      await pool.query('UPDATE Ogrenci_sayac SET sayac = sayac - 1');
  
      return res.status(200).send({ status: true, message: 'Öğrenci silindi.' });
    } catch (err) {
      console.error('Hata:', err);
      return res.status(500).send({ status: false, message: 'Öğrenci Silme Sırasında Hata Oluştu. Hata: ' + err });
    } finally {
    }
  };
  
const getStudentCount = async (req, res) => {
    try {
        const result = await pool.query('SELECT sayac FROM Ogrenci_sayac');
        const count = result.rows[0].sayac;
        return res.status(200).send({ status: true, message: 'Öğrenci sayısı alındı.', data: count });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Öğrenci Sayısı Alınırken Hata Oluştu. Hata: ' + err });
    }
};


// BOLUM CONTROLLER

const getAllBolum = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Bolum');
        return res.status(200).send({ status: true, message: 'Kayıt listelendi.', data: result.rows });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Kayıt Listeleme Sırasında Hata Oluştu. Hata: ' + err });
    } finally {
    }
};

const getBolumById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Bolum WHERE id = $1', [id]);
        return res.status(200).send({ status: true, message: 'Bölüm bulundu.', data: result.rows });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Bölüm Bulma Sırasında Hata Oluştu. Hata: ' + err });
    } finally {
    }
};

const createBolum = async (req, res) => {
    const { name, dept_std_id } = req.body; 
    try {

        const result = await pool.query('INSERT INTO Bolum (name, dept_std_id) VALUES ($1, $2) RETURNING *', [name, dept_std_id]);

        return res.status(201).send({ status: true, message: 'Bölüm oluşturuldu.', data: result.rows });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Bölüm oluşturma sırasında bir hata oluştu.', error: err });
    } finally {
    }
};

const updateBolum = async (req, res) => {
    const id = req.params.id;
    const { name, dept_std_id } = req.body;

    const updatedFields = [];
    if (name) updatedFields.push('name');
    if (dept_std_id) updatedFields.push('dept_std_id');

    if (updatedFields.length === 0) {
        return res.status(400).send({ status: false, message: 'En az bir alan güncellenmelidir.' });
    }

    const sql = `UPDATE Bolum SET ${updatedFields.map((field) => `${field} = $${updatedFields.indexOf(field) + 1}`).join(', ')} WHERE id = $${updatedFields.length + 1} RETURNING *`;

    const values = [...updatedFields.map((field) => req.body[field]), id];

    try {
        const result = await pool.query(sql, values);
        return res.status(200).send({ status: true, message: 'Bölüm güncellendi.', data: result.rows });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Bölüm Güncelleme Sırasında Hata Oluştu. Hata: ' + err });
    }
};

const deleteBolum = async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM Bolum WHERE id = $1', [id]);
        return res.status(200).send({ status: true, message: 'Bölüm silindi.' });
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).send({ status: false, message: 'Bölüm Silme Sırasında Hata Oluştu. Hata: ' + err });
    } finally {
    }
};

module.exports = {
    createTables,
    getAllStudent,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getAllBolum,
    getBolumById,
    createBolum,
    updateBolum,
    deleteBolum,
    getStudentCount,
    fetchAllStudents
    
};
