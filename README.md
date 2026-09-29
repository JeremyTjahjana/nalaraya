# Nalaraya

Laboratorium virtual titrasi untuk siswa SMA. Next.js + React Three Fiber, geometri low-poly prosedural, bahasa Indonesia.

## Jalankan

```sh
npm install
npm run dev
```

Buka http://localhost:3000. `npm run build` memeriksa produksi; `npm test` memeriksa logika eksperimen.

## Alur demo

1. Landing → Kimia → Titrasi → Latihan.
2. Klik tiga APD. Tambahkan statif dan buret, pilih masing-masing lalu **Pasang pada titik**. Alat juga dapat diseret dan otomatis snap di dekat posisi pemasangan.
3. Ambil NaOH, gelas limbah, dan corong. Bilas buret, isi, lalu lepas corong dan catat.
4. Ambil Erlenmeyer, pipet, HCl, dan fenolftalein. Pipet sampel lalu tambahkan indikator.
5. Pilih Erlenmeyer dan pasang pada titik. Mulai titrasi.
6. Alirkan 24 × 1 mL dan 16 × 0,05 mL. Aduk labu, tunggu warna stabil 15 detik, lalu selesai.
7. Isi meniskus 0,15 dan 24,95 mL; molaritas 0,0992 M.

Ujian memakai 10 menit, pilihan alat dengan distraktor, tanpa panduan langkah. Timer tetap berjalan saat tab tidak aktif. Data hanya di memori; reload memulai sesi baru. Ini demo asesmen lokal, bukan sistem ujian yang tahan manipulasi.

## Batas model

Reaksi ideal HCl–NaOH, endpoint direpresentasikan sebagai rentang 24,80–25,05 mL. Gerak cairan dan preparasi merupakan penyederhanaan pendidikan, bukan simulasi fluida atau pengganti pengawasan guru. Hasil molaritas dihitung dari volume aktual yang dialirkan; hasil overshoot ditandai tidak valid. SDS bahan nyata bergantung formulasi/konsentrasi.

Referensi prosedur: https://www.chem.fsu.edu/chemlab/glassware/glassware.html dan https://www2.chem.wisc.edu/deptfiles/genchem/lab/labdocs/modules/buret/bretread.htm.

## Deployment

Import repository ke Vercel, pilih preset Next.js, build `npm run build`. Tidak membutuhkan environment variable atau backend. Deployment membutuhkan akun Vercel dan repository milik tim.

## Roadmap dan atribusi

Editor guru, eksperimen biologi/fisika, penyimpanan lintas perangkat, serta validasi hasil belajar belum tersedia. Jangan mengklaim kemampuan tersebut pada submission.

Next.js/React/Three.js/R3F/Drei menggunakan lisensi open-source masing-masing di node_modules; font Atkinson Hyperlegible memakai SIL OFL. Aset model dan favicon dibuat di kode proyek. AI membantu implementasi serta dokumentasi; tim wajib meninjau dan memahami kode serta menyatakan penggunaan AI secara transparan saat diperlukan.
