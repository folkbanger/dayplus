# Panduan menulis artikel blog Day+

Satu artikel = satu file di folder `src/content/blog/`. Isi artikel dalam bahasa Inggris (US).

## Cara menambah artikel

1. **Salin file contoh.** Salin `src/content/blog/_template.mdx`, lalu beri nama baru dengan huruf kecil dan tanda hubung, misalnya `why-streaks-help.mdx`.
   Nama file menjadi alamat artikel: `dayplus.app/blog/why-streaks-help/`. Jangan ganti nama file setelah artikel tayang, karena alamatnya ikut berubah.
2. **Isi bagian atas file (di antara dua garis `---`):**
   - `title`: judul, sebaiknya berupa pertanyaan yang biasa diketik orang di Google.
   - `description`: satu kalimat (20–170 huruf) tentang apa yang akan dipelajari pembaca.
   - `date`: tanggal artikel muncul, contoh `2026-12-01`. Artikel bertanggal hari ini atau sebelumnya langsung tampil. Artikel bertanggal nanti disembunyikan dulu, lalu muncul sendiri pagi hari pada tanggal itu (sekitar jam 5 pagi waktu New York, kira-kira jam 17.00 WIB).
   - `topic`: pilih satu dari `Science`, `Books`, `Habits`, `Routines`, `Focus`, `Sleep`, `Motivation`. Gambar sampul dibuat otomatis dari topik ini.
   - `sources`: daftar sumber, satu per baris (lihat aturan di bawah).
   - `updated`: hanya diisi kalau kamu mengubah artikel lama.
   - `draft: true`: artikel tidak akan tayang. Ubah ke `false` kalau sudah siap.
3. **Tulis isinya.** Judul bagian pakai `## Judul bagian`. Daftar isi di samping atau atas artikel dibuat otomatis dari judul-judul ini. Lama baca juga dihitung otomatis.
4. **Kotak-kotak yang bisa dipakai:**
   - `<InShort>Jawaban singkat.</InShort>`: kotak "In short" di awal artikel.
   - `<Stats items={[['66', 'days, on average'], ['18', 'days, fastest'], ['254', 'days, slowest']]} />`: tiga angka besar.
   - `<DayPlusBox />`: kotak "Try Day+ free for 3 days". **Tepat satu per artikel**, kira-kira di tengah.
   - `<Cite n={1} />`: angka kecil yang menunjuk ke sumber nomor 1. Taruh di akhir kalimat.
   - Daftar sumber dan catatan "not medical advice" muncul otomatis di akhir artikel.
5. **Lihat dulu (preview).** Minta Claude Code: "tampilkan preview artikel baru". Artikel draft dan artikel terjadwal juga terlihat di preview, dengan tanda "Draft" atau "Scheduled".
6. **Tayangkan.** Bilang ke Claude Code: **"publish"**. Itu artinya izin untuk push file artikel itu saja. Kalau ada file lain yang ikut berubah, Claude Code akan menunjukkan daftarnya dan bertanya dulu.

Tips: kamu bisa menulis beberapa artikel sekaligus untuk seminggu, masing-masing dengan tanggal berbeda, lalu publish semuanya. Setiap pagi satu artikel muncul sendiri.

## Aturan isi (wajib)

- **Studi harus asli dan sumbernya lengkap:** nama penulis, tahun, judul, jurnal, volume, halaman, dan link DOI kalau ada. Setiap angka di artikel harus ada di sumbernya. Kalau tidak yakin, jangan ditulis.
- **Buku dirangkum dengan kata-kata kita sendiri.** Jangan menyalin kalimat dari buku. Kutipan pendek (di bawah 15 kata) boleh, kalau perlu sekali, dengan tanda kutip dan nama penulisnya.
- **Jangan pakai sampul buku asli, foto stok, atau gambar dari internet.** Gambar sampul dibuat otomatis dari topik.
- **Jangan menulis "best", "#1", "most popular"** atau klaim sejenis.
- **Jangan mengarang angka** (misalnya "40% more productive") dan jangan membuat klaim yang tidak bisa dibuktikan.
- **Jangan menulis jumlah pengguna, rating, review, testimoni, atau penghargaan.**
- **Bukan nasihat medis.** Tulis "research suggests", bukan "this will cure". Catatan "not medical advice" muncul otomatis.
- Tentang Day+, hanya tulis yang memang bisa dilakukan aplikasinya. Contoh: "free for 3 days", bukan "free trial".

## Catatan teknis

- File yang namanya diawali `_` (seperti `_template.mdx`) tidak pernah tayang.
- Rebuild harian berjalan otomatis lewat GitHub Actions (`.github/workflows/deploy.yml`). GitHub mematikan jadwal otomatis kalau repo tidak ada perubahan selama 60 hari. Selama kamu rutin menambah artikel, jadwalnya tetap jalan.
