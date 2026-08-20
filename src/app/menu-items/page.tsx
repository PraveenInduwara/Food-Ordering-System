"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MenuItem {
  MenuItemID: number;
  RestaurantID: number;
  RestaurantName: string;
  Name: string;
  Description: string;
  Price: number;
  Category: string;
}

interface Restaurant {
  RestaurantID: number;
  Name: string;
}

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [form, setForm] = useState({ restaurantId: "", name: "", description: "", price: "", category: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const res = await fetch("/api/menu-items");
    setItems(await res.json());
    setLoading(false);
  };

  const fetchRestaurants = async () => {
    const res = await fetch("/api/restaurants");
    setRestaurants(await res.json());
  };

  useEffect(() => { fetchItems(); fetchRestaurants(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, restaurantId: parseInt(form.restaurantId), price: parseFloat(form.price) };
    if (editingId) {
      await fetch(`/api/menu-items/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setForm({ restaurantId: "", name: "", description: "", price: "", category: "" });
    setEditingId(null);
    fetchItems();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.MenuItemID);
    setForm({
      restaurantId: item.RestaurantID.toString(),
      name: item.Name,
      description: item.Description || "",
      price: item.Price.toString(),
      category: item.Category,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/menu-items/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Items</h1>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8 grid grid-cols-2 gap-4">
        <select className="border p-2 rounded" value={form.restaurantId} onChange={(e) => setForm({ ...form, restaurantId: e.target.value })} required>
          <option value="">Select Restaurant</option>
          {restaurants.map((r) => (
            <option key={r.RestaurantID} value={r.RestaurantID}>{r.Name}</option>
          ))}
        </select>
        <input className="border p-2 rounded" placeholder="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input className="border p-2 rounded col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="col-span-2 flex gap-2">
          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
            {editingId ? "Update" : "Add"} Menu Item
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ restaurantId: "", name: "", description: "", price: "", category: "" }); }} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
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
              <th className="border p-2 text-left">Restaurant</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.MenuItemID} className="hover:bg-gray-50">
                <td className="border p-2">{item.MenuItemID}</td>
                <td className="border p-2">{item.Name}</td>
                <td className="border p-2">{item.RestaurantName}</td>
                <td className="border p-2">{item.Category}</td>
                <td className="border p-2">Rs. {item.Price.toFixed(2)}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(item.MenuItemID)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
