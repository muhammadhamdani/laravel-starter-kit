# Laravel Starter Kit

📦 Laravel Starter Kit adalah kerangka awal pengembangan aplikasi Laravel modern yang siap pakai, dibangun oleh [muhammadhamdani](https://github.com/muhammadhamdani).

## 🚀 Fitur Unggulan

- Laravel 10+
- Inertia.js + React.js + Tailwind CSS
- Autentikasi dan otorisasi siap pakai (Spatie Permission)
- Manajemen role & permission
- Log viewer (opcodesio/log-viewer)
- Logging custom (info, success, warning, error)
- Struktur folder modular dan rapi
- Integrasi validasi dengan Form Request
- Komponen reusable & form dinamis
- Support multi-theme dan dark mode berbasis Tailwind

---

## 🛠️ Instalasi

```bash
git clone https://github.com/muhammadhamdani/laravel-starter-kit.git
cd laravel-starter-kit
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
npm install && npm run dev
```

## 🔐 Login Default (Seeder)

| Role     | Email               | Password  |
|----------|---------------------|-----------|
| Admin    | admin@example.com   | password  |
| Users    | user@example.com    | password  |

---

## 🧩 Struktur Utama

```
app/
├── Http/
│   ├── Controllers/
│   └── Middleware/
├── Models/
├── Policies/
├── Traits/
routes/
├── web.php
resources/
├── js/         ← React + Inertia
├── views/
database/
├── migrations/
├── seeders/
```

---

## 🧰 Fitur Teknis

- **Spatie Laravel Permission**  
  Role dan permission berbasis middleware & policy.

- **Inertia.js + React**  
  SPA tanpa API tambahan.

- **Log Viewer**  
  Integrasi `opcodesio/log-viewer` untuk melihat log Laravel.

- **Activity Logger (Custom Logging)**  
  Logging actions ke file `activity.log` berdasarkan tipe (`success`, `error`, `info`, `warning`).

- **Theming System**  
  Support multiple themes berbasis `oklch()` dan CSS variable.

---

## 📦 Perintah Artisan Tambahan

```bash
php artisan permission:cache-reset
php artisan make:policy MyPolicy --model=MyModel
php artisan make:trait LogsActivity
```

---

## 🧑‍💻 Kontributor

👤 [muhammadhamdani](https://github.com/muhammadhamdani)

---

## 📜 Lisensi

MIT License. Silakan gunakan, modifikasi, dan kontribusi!

---

## 💡 Tips

> Gunakan `trait LogsActivity` untuk mencatat setiap aktivitas penting.  
> Cek `storage/logs/activity.log` untuk log aktivitas berdasarkan user & action.