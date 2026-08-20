import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Food Ordering System</h1>
      <p className="text-lg text-zinc-600 mb-8">
        Manage restaurants, menus, customers, and orders.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/customers"
          className="px-6 py-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
        >
          Customers
        </Link>
        <Link
          href="/restaurants"
          className="px-6 py-4 bg-green-600 text-white rounded-lg text-center hover:bg-green-700"
        >
          Restaurants
        </Link>
        <Link
          href="/menu-items"
          className="px-6 py-4 bg-orange-600 text-white rounded-lg text-center hover:bg-orange-700"
        >
          Menu Items
        </Link>
        <Link
          href="/orders"
          className="px-6 py-4 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700"
        >
          Orders
        </Link>
      </div>
    </div>
  );
}
