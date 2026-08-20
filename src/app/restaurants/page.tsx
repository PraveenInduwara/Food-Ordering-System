"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Restaurant {
  RestaurantID: number;
  Name: string;
  Address: string;
  Phone: string;
  CuisineType: string;
  Rating: number;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [form, setForm] = useState({ name: "", address: "", phone: "", cuisineType: "", rating: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch {
      setRestaurants([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, rating: parseFloat(form.rating) || 0 };
    if (editingId) {
      await fetch(`/api/restaurants/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setForm({ name: "", address: "", phone: "", cuisineType: "", rating: "" });
    setEditingId(null);
    fetchRestaurants();
  };

  const handleEdit = (r: Restaurant) => {
    setEditingId(r.RestaurantID);
    setForm({ name: r.Name, address: r.Address, phone: r.Phone, cuisineType: r.CuisineType, rating: r.Rating.toString() });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
    fetchRestaurants();
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8 grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Restaurant Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Cuisine Type" value={form.cuisineType} onChange={(e) => setForm({ ...form, cuisineType: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Rating (0-5)" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} required />
        <input className="border p-2 rounded col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <div className="col-span-2 flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            {editingId ? "Update" : "Add"} Restaurant
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", address: "", phone: "", cuisineType: "", rating: "" }); }} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? <p>Loading...</p> : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Cuisine</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Rating</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.RestaurantID} className="hover:bg-gray-50">
                <td className="border p-2">{r.RestaurantID}</td>
                <td className="border p-2">{r.Name}</td>
                <td className="border p-2">{r.CuisineType}</td>
                <td className="border p-2">{r.Phone}</td>
                <td className="border p-2">{r.Rating}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(r.RestaurantID)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
