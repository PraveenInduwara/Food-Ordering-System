"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  OrderID: number;
  CustomerName: string;
  RestaurantName: string;
  OrderDate: string;
  TotalAmount: number;
  Status: string;
  DeliveryAddress: string;
}

interface Customer { CustomerID: number; FirstName: string; LastName: string; }
interface Restaurant { RestaurantID: number; Name: string; }
interface MenuItem { MenuItemID: number; Name: string; Price: number; RestaurantID: number; }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderItems, setOrderItems] = useState<{ menuItemId: number; quantity: number; unitPrice: number }[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    fetch("/api/customers").then((r) => r.json()).then(setCustomers);
    fetch("/api/restaurants").then((r) => r.json()).then(setRestaurants);
    fetch("/api/menu-items").then((r) => r.json()).then(setMenuItems);
  }, []);

  const filteredItems = menuItems.filter((m) => m.RestaurantID === parseInt(restaurantId));

  const addItem = (item: MenuItem) => {
    const existing = orderItems.find((o) => o.menuItemId === item.MenuItemID);
    if (existing) {
      setOrderItems(orderItems.map((o) => o.menuItemId === item.MenuItemID ? { ...o, quantity: o.quantity + 1 } : o));
    } else {
      setOrderItems([...orderItems, { menuItemId: item.MenuItemID, quantity: 1, unitPrice: item.Price }]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: parseInt(customerId), restaurantId: parseInt(restaurantId), deliveryAddress, items: orderItems }),
    });
    setShowForm(false);
    setCustomerId(""); setRestaurantId(""); setDeliveryAddress(""); setOrderItems([]);
    fetchOrders();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/orders/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: editStatus, deliveryAddress: editAddress }),
    });
    setEditingId(null);
    fetchOrders();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            {showForm ? "Cancel" : "New Order"}
          </button>
          <Link href="/" className="text-blue-600 hover:underline leading-10">Back to Home</Link>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded-lg mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select className="border p-2 rounded" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c.CustomerID} value={c.CustomerID}>{c.FirstName} {c.LastName}</option>)}
            </select>
            <select className="border p-2 rounded" value={restaurantId} onChange={(e) => { setRestaurantId(e.target.value); setOrderItems([]); }} required>
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => <option key={r.RestaurantID} value={r.RestaurantID}>{r.Name}</option>)}
            </select>
            <input className="border p-2 rounded col-span-2" placeholder="Delivery Address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required />
          </div>
          {restaurantId && (
            <div>
              <p className="font-semibold mb-2">Add Items:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {filteredItems.map((item) => (
                  <button key={item.MenuItemID} type="button" onClick={() => addItem(item)} className="bg-white border px-3 py-1 rounded hover:bg-gray-100 text-sm">
                    {item.Name} - Rs. {item.Price}
                  </button>
                ))}
              </div>
              {orderItems.length > 0 && (
                <div className="bg-white p-3 rounded border">
                  {orderItems.map((o) => {
                    const item = menuItems.find((m) => m.MenuItemID === o.menuItemId);
                    return (
                      <div key={o.menuItemId} className="flex justify-between items-center py-1">
                        <span>{item?.Name} x {o.quantity}</span>
                        <div className="flex items-center gap-2">
                          <span>Rs. {(o.quantity * o.unitPrice).toFixed(2)}</span>
                          <button type="button" onClick={() => setOrderItems(orderItems.filter((i) => i.menuItemId !== o.menuItemId))} className="text-red-500 text-sm">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t mt-2 pt-2 font-bold">Total: Rs. {orderItems.reduce((sum, o) => sum + o.quantity * o.unitPrice, 0).toFixed(2)}</div>
                </div>
              )}
            </div>
          )}
          <button type="submit" disabled={orderItems.length === 0} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-gray-300">
            Place Order
          </button>
        </form>
      )}

      {editingId && (
        <form onSubmit={handleUpdate} className="bg-yellow-50 p-6 rounded-lg mb-8 grid grid-cols-3 gap-4">
          <select className="border p-2 rounded" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} required>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input className="border p-2 rounded" placeholder="Delivery Address" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required />
          <div className="flex gap-2">
            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Update</button>
            <button type="button" onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p>Loading...</p> : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Customer</th>
              <th className="border p-2 text-left">Restaurant</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Total</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.OrderID} className="hover:bg-gray-50">
                <td className="border p-2">{o.OrderID}</td>
                <td className="border p-2">{o.CustomerName}</td>
                <td className="border p-2">{o.RestaurantName}</td>
                <td className="border p-2">{new Date(o.OrderDate).toLocaleDateString()}</td>
                <td className="border p-2">Rs. {o.TotalAmount?.toFixed(2)}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    o.Status === "Delivered" ? "bg-green-100 text-green-800" :
                    o.Status === "Cancelled" ? "bg-red-100 text-red-800" :
                    o.Status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>{o.Status}</span>
                </td>
                <td className="border p-2">
                  <button onClick={() => { setEditingId(o.OrderID); setEditStatus(o.Status); setEditAddress(o.DeliveryAddress); }} className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(o.OrderID)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
