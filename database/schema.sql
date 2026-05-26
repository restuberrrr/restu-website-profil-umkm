CREATE DATABASE IF NOT EXISTS website_profil_umkm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE website_profil_umkm;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price INT NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, price, description) VALUES
('Kopi Susu Aren', 'Minuman', 18000, 'Kopi susu gula aren dengan rasa ringan untuk harian.'),
('Roti Coklat Premium', 'Makanan', 12000, 'Roti lembut isi coklat, cocok untuk sarapan.'),
('Paket Snack Meeting', 'Paket', 45000, 'Paket snack untuk acara kecil dan rapat kantor.')
ON DUPLICATE KEY UPDATE name = VALUES(name);

