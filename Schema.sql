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
