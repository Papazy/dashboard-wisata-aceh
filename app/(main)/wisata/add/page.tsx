'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Fungsi untuk menambahkan data wisata
async function addWisata(wisata: Omit<any, "id">, token: string) {
  
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL + "/places?secret_key=" + process.env.NEXT_PUBLIC_BACKEND_API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
          "Bearer " + token,
    },
    body: JSON.stringify({ ...wisata, image_url: "" }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const resData = await res.json();
  return resData;
}

// Fungsi untuk mengunggah gambar
async function uploadImage(placeId: number, file: File, token: string) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/places/${placeId}/image?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer " + token,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const resData = await res.json();
  return resData;
}

export default function AddWisataPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location_name: "",
    latitude: "",
    longitude: "",
  });
  const {token} = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Tambah data wisata tanpa gambar
      const addedWisata = await addWisata(form, token);

      // Jika file gambar tersedia, upload gambar
      if (file) {
        await uploadImage(addedWisata.id, file, token);
        alert("Wisata dan gambar berhasil ditambahkan!");
      } else {
        alert("Wisata berhasil ditambahkan tanpa gambar!");
      }

      router.push("/"); // Arahkan ke halaman utama
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">Tambah Wisata</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nama Wisata</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="location_name" className="block text-sm font-medium">Nama Lokasi</label>
          <input
            type="text"
            id="location_name"
            name="location_name"
            value={form.location_name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium">Latitude</label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium">Longitude</label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium">Unggah Gambar</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {isSubmitting ? "Mengirim..." : "Tambah Wisata"}
        </button>
      </form>
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
}
