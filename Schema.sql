CREATE TABLE IF NOT EXISTS Ogrenci (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    deptid INTEGER,
    counter INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Bolum (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    dept_std_id INTEGER
);
CREATE TABLE IF NOT EXISTS Ogrenci_sayac (
    sayac INTEGER DEFAULT 0
);
INSERT INTO Ogrenci_sayac (sayac)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM Ogrenci_sayac);