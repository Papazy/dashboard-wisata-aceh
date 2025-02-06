'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

async function fetchWisata(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/places/${id}?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error('Gagal memuat data wisata');
  return res.json();
}

async function updateWisata(id: string, wisata: any, token: string) {
  const wisataWithoutImage = { ...wisata };
  delete wisataWithoutImage.image_url;
  console.log(wisataWithoutImage);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/places/${id}?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...wisataWithoutImage,
        latitude: parseFloat(wisata.latitude),
        longitude: parseFloat(wisata.longitude),
      }),
    }
  );
  if (!res.ok) throw new Error('Gagal menyimpan perubahan');
  return res.json();
}

async function uploadImage(id: number, file: File, token: string) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/places/${id}/image?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );
  if (!res.ok) throw new Error('Gagal mengunggah gambar');
  return res.json();
}

export default function EditWisataPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    location_name: '',
    latitude: '',
    longitude: '',
    image_url: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWisata(id as string, token);
        setForm({
          name: data.name,
          description: data.description,
          location_name: data.location_name,
          latitude: data.latitude,
          longitude: data.longitude,
          image_url: data.image_url,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Update data wisata
      const updatedWisata = await updateWisata(id as string, form, token);

      // Jika ada gambar baru, upload gambar
      if (file) {
        await uploadImage(updatedWisata.id, file, token);
      }

      router.push('/wisata');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center p-4">Memuat data...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Wisata</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Wisata</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lokasi</label>
          <input
            type="text"
            name="location_name"
            value={form.location_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gambar Saat Ini</label>
          {form.image_url && (
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <Image
                loader={() => form.image_url}
                src={form.image_url}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          
          <label className="block text-sm font-medium mb-1">Unggah Gambar Baru</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
}