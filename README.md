# WRITER APP
----
## Descripttion:

### Using TechStack
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-%233ECF8E.svg?style=for-the-badge&logo=supabase&logoColor=white) ![React Query](https://img.shields.io/badge/React%20Query-%23FF4154.svg?style=for-the-badge&logo=react%20query&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-%23CA4245.svg?style=for-the-badge&logo=react-router&logoColor=white) ![GSAP](https://img.shields.io/badge/gsap-%230AE448.svg?style=for-the-badge&logo=gsap&logoColor=white)
**And Build By :**
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
****
Projek Aplikasi Pribadi untuk **Penulis** yang ingin membangun sebuah Novel dengan **Universe Fiksi** yang sangat luas dalam jangka panjang.

----

## Features:

- ***Project Management*** : 
  Management lebih dari satu Project/Universe Fiksi.
- ***Dashboard*** :
  - **Timeline Building**:
  Mengatur garis waktu secara lengkap, untuk *Novelist* yang ingin mengatur garis waktu *Universe Fiksi* mereka secara runut.
  - **World Building**:
  Mendeskripsikan latar dunia *Universe Fiksi* penulis untuk mendeskripsikan masing cara kerja tentang dunia mereka, seperti *Peta Dunia*, *Benua* di dalamnya, dan *Tempat-tempat penting* untuk cerita.
  - **Character Development**:
  Management Tokoh-tokoh yang akan hadir dalam cerita di *Universe Fiksi Novelist* seperti menambahkan atribut untuk mereka (*Nama*, *Umur*, *Gender*, *Pihak Baik/Netral/Jahat*, Stats personal karakter, dan tentunya *Deskriptsi sifat* atau detail penting karakter lainnya berupa teks).
  - **Goals Management**:
  Mengatur *To-Do-List* atau tugas untuk *Novelist* itu sendiri sebagai pengingat tujuan mereka terhadap *Universe Fiksi* mereka.
  - **Events Management**:
  Mengatur Kejadian-kejadian penting yang terjadi di dalam *Universe Fiksi* secara detail.
  - **Relic/Items Management**:
  Mengatur benda-benda fisik yang berpengaruh penting dan menjadi pusaka di dalam *Universe Fiksi*.
  - **Book Library**:
  Berupa *perpustakaan* untuk menyimpan *draft novel/cerpen* atau jenis buku lainnya yang di dalamnya terdapat *list Chapter* yang dapat di edit dan menjadi ruang kerja penulis *untuk menuliskan cerita* mereka.
  - **Notes Management**:
  Mengatur catatan untuk *Novelist* membangun garis besar konsep cerita sebelum mereka menulis di ***Book Library***
- ***Fitur Tambahan***
  - **Pinning**
  Terdapat fitur untuk melakukan pin konten khususnya untuk **Notes** dan **Event** agar tidak perlu untuk sering pindah halaman saat sedang menulis di halaman **Chapter Page**
  - **Average Word Count**
  Menghitung seluruh jumlah kata per Chapter lalu melakukan penghitungan untuk rata-rata.
  - **Export To Document** 
  Dapat melakukan export ke file document (.docx) sebagai *draft script* serta melakukan kostumisasi pemformatan export.
  - **AI Integration**
  Ai Writer Companion akan membantu pengguna untuk brainstorming dan teman diskusi dalam membangun *Universe Fiksi*
  - **Chapter Reader Tools**
  Klik Tombol Chapter Reader di Halaman Chapter untuk meminta ssistem membacakan hasil tulisan anda*

----
## How To Use:

- **Custom Hooks**
  - **useFetch**
  Melakukan Fetch data dari *supabase*
  ```tsx
  const {data, loading, error, refetch} = useFetch<DATA>(key)
  // DATA : Generic Type Parameter
  // data : mengambil semua data
  // loading : mengambil kondisi pengambilan data (true/false)
  // error : mengambil error jika terjadi kesalahan saat pengambilan data
  // refetch : melakukan fetch ulang data
  ```
  - **useForm**
  Melakukan aksi (CRUD) yang akan mengubah data di *supabase*
  ```tsx
  // Create Data
  const { onCreate } = useForm([], key, "", dafaulValue)
  //key : enpoint data (belakangnya harus terdapat huruf 's', tapi dituliskan di hook tidak perlu tulis 's' nya)
  //defaultValue : default value yang akan di otomatis terisi saat di data di buat

  // Update Data
  const { onSubmit, loading, setValue, getValue } = useForm([inputs], key, id_data)
  //inputs : data apa saja yang akan diinputkan oleh user untuk mengedit
  //key : enpoint data (belakangnya harus terdapat huruf 's', tapi dituliskan di hook tidak perlu tulis 's' nya)
  //id_data : edit data berdasarkan id datanya 

  // Delete Data
  const {onDelete} = useForm([], key, data_id)
  //key : enpoint data (belakangnya harus terdapat huruf 's', tapi dituliskan di hook tidak perlu tulis 's' nya)
  //id_data : hapus data berdasarkan id datanya 
  ```

- **Utils**
  - *Sanitizer Utils*
  Kegunaan untuk melakukan pembersihan terhadap teks.
  ```ts
  export function Sanitizer(html: string) {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/<[^>]*>/g, '')
  }
  ```
  Contoh penggunaan:
  ```tsx
  Sanitizer(text)
  ```
----

## Follow Me:
- Nama : **Masagus Ahmad Ramadhan** 
- NPM : *(202643500545)*

![Gmail](https://img.shields.io/badge/Gmail-%23D14836.svg?style=for-the-badge&logo=gmail&logoColor=white) : agusyantosugiyanto@gmail.com
![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white) : [Instagram Link](https://www.instagram.com/msgs_adra/)
![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white) : [Facebook Link](https://www.facebook.com/profile.php?id=61589665117247)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) : [Github Link](https://github.com/Ashonst2844)

----

## ChangeLog

Keterangan:
*digit ke-1* : Update Versi Aplikasi
*digit ke-2* : Update Fitur
*digit ke-3* : Update Fix

- (4 Sept. 2026) **app-build v1.0**
  - (5 Sept. 2026) **update-build v1.0.1**
    Perbaikan backend saat melakukan pembuatan, penghapusan, dan pembaruan data ke supabase
  - (7 Sept. 2026) **update-build v1.1.0**
    - Melakukan pembaruan UI/UX
    - penambahan fitur hitung estimasi rata-rata jumlah kata
    - Membuat tombol minimize navigasi dashboard
    - Perbaruan Single Pinning -> Multi Pinning
  - (9 Sept. 2026) **update-build v1.2.0**
    - Optimalisasi code-source
    - Melakukan pembaruan UI/UX
    - Menambahkan Modal Box untuk beberapa aksi krusial
    - Integrasi TanStack agar load data menjadi lebih cepat
  - (12 Sept. 2026) **update-build v1.3.0**
    - Menambahkan fitur copy-to-clipboard
    - Menambahkan fitur export untuk buku menjadi *customable .docx*
  - (17 Sept. 2026) **update-build v1.4.0**
    - Menambahkan fitur *Short-Cut Keyboard*
    - membuat alignment exported document menjadi justify
    - Menambahkan fitur Stats Personalisasi Karakter
  - (17 Sept. 2026) **update-build v1.5.0**
    - Menambahkan icon
    - Menambahkan tags untuk Traits Character sesuai dengan statistic yang diberikan
    - Fix search position
  - (23 Sept. 2026) **update-build v1.6.0**
    - Membuat Landing Page untuk umum dan mengintegrasikan dengan GSAP Animation
    - Membuat Halam Register untuk Sistem Authentication Register 
      - Sign-up
      - Sign-in
      - Sign-out
  - (23 Sept. 2026) **update-build v1.6.1**
    - Memperbaiki Formatting pada Pinning
  - (25 Sept. 2026) **update-build v1.7.0**
    - Membuat halaman teknis (Privacy Policy, Terms Of Services, dan Changelog)
    - Memberikan batasan pengguna sesuai dengan Plan/Tier
  - (27 Sept. 2026) **update-build v1.7.1**
    - Fix Error
  - (27 Sept. 2026) **update-build v1.8.0**
    - Memperbarui planning-benefits
    - Optimalisasi source-code
  - (28 Sept. 2026) **update-build v1.8.1**
    - Minority Change
  - (28 Sept. 2026) **update-build v1.8.2**
    - Security Update
  - (29 Sept. 2026) **update-build v1.9.0**
    - Minority Fix
    - AI Companion Integration
    - Chapter Reading Tools
  - (29 Sept. 2026) **update-build v1.10.0**
    - Optimalisasi source-code
    - Perbarui sedikit UI/UX Landing Page
  - (29 Sept. 2026) **update-build v1.10.1**
    - Fix UI/UX
  - (1 Oct. 2026) **update-build v1.10.2**
    - Optimaslisasi source-code"
    - Forgot Password
    - Manual Crawling dengan sitemap.xml dan robots.txt
  - (1 Oct. 2026) **update-build v1.10.3**
    - Boost beberapa metrik analisis Lighthouse
    - Upgrade SEO
  - (2 Oct. 2026) **update-build v1.11.0**
    - Memperbaiki sedikit UI/UX
    - Membuat wesbite menjadi responsive untuk mobile dan tablet
    - Menambahkan API AI KEY ke env
  - (3 Oct. 2026) **update-build v1.11.1**
    - Fix AI Companion Error
    - Fix Responsive UI
  - (3 Oct. 2026) **update-build v1.11.2**
    - Fix Some Error
  - (5 Oct. 2026) **update-build v1.11.3**
    - Fix Some Error
    - Fix UI/UX
    - Menambahkan fitur donate
    - Menyimpan Premium Content dan membukanya untuk umum
    - Polish System agar menjadi Launchable