"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Customer {
  CustomerID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      setCustomers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/customers/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ firstName: "", lastName: "", email: "", phone: "", address: "" });
    setEditingId(null);
    fetchCustomers();
  };

  const handleEdit = (c: Customer) => {
    setEditingId(c.CustomerID);
    setForm({ firstName: c.FirstName, lastName: c.LastName, email: c.Email, phone: c.Phone, address: c.Address });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8 grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input className="border p-2 rounded col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <div className="col-span-2 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {editingId ? "Update" : "Add"} Customer
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ firstName: "", lastName: "", email: "", phone: "", address: "" }); }} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
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
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.CustomerID} className="hover:bg-gray-50">
                <td className="border p-2">{c.CustomerID}</td>
                <td className="border p-2">{c.FirstName} {c.LastName}</td>
                <td className="border p-2">{c.Email}</td>
                <td className="border p-2">{c.Phone}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(c.CustomerID)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
