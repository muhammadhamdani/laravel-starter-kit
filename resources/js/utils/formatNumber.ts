export const formatNumberWhatsapp = (value: string) => {
    if (!value) return '';

    // hapus semua karakter selain angka
    let number = value.replace(/\D/g, '');

    // jika diawali 0 → ganti dengan 62
    if (number.startsWith('0')) {
        number = '62' + number.slice(1);
    }

    // jika diawali 8 (user input tanpa 0) → tambahkan 62
    if (number.startsWith('8')) {
        number = '62' + number;
    }

    // jika sudah 62 → biarkan
    if (number.startsWith('62')) {
        return number;
    }

    return number;
};
