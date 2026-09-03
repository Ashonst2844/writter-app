# WRITTER APP
----
## Descripttion:

### Using TechStack
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-%233ECF8E.svg?style=for-the-badge&logo=supabase&logoColor=white)
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
  Management Tokoh-tokoh yang akan hadir dalam cerita di *Universe Fiksi Novelist* seperti menambahkan atribut untuk mereka (*Nama*, *Umur*, *Gender*, *Pihak Baik/Netral/Jahat*, dan tentunya *Deskriptsi sifat* atau detail penting karakter lainnya berupa teks).
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

----
## How To Use:

- **Fork App**

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
  - *Pinning Utils*
  Kegunaan untuk melakukan pinning 
  ```ts
  {/*Sanitasi teks yang ingin di pin menjadi plain-text*/}
  export function Sanitizer(html: string) {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/<[^>]*>/g, '')
  }

  {/*Fungsi untuk set Item dengan key pinned ke localStorage*/}
  export default function Pinning(head: string, body: string, from: string) {
    if(!head && !body && !from) return
    window.localStorage.setItem('pinned', JSON.stringify({
      head: Sanitizer(head), // Judul Pinned
      body: Sanitizer(body), // Badan/Teks Pinned
      from: Sanitizer(from) // Berasal dari mana Pinned nya
    }))
  }

  {/*Akan di ambil dengan fungsi*/}
  const handleOn = () => {
    const data = window.localStorage.getItem('pinned')
    setPin(JSON.parse(data))
  }
  ```
  Contoh penggunaan:
  ```tsx
  Pinned(text)
  ```

----

## Follow Me:
- Nama : **Masagus Ahmad Ramadhan** 
- NPM : *(202643500545)*

![Gmail](https://img.shields.io/badge/Gmail-%23D14836.svg?style=for-the-badge&logo=gmail&logoColor=white) :
![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white) : 
![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white) :
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) :
![TikTok](https://img.shields.io/badge/TikTok-%23000000.svg?style=for-the-badge&logo=TikTok&logoColor=white) : 

----