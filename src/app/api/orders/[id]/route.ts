import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    const order = await pool
      .request()
      .input("id", parseInt(id))
      .query(
        `SELECT o.*, c.FirstName + ' ' + c.LastName AS CustomerName, r.Name AS RestaurantName
         FROM [Order] o
         INNER JOIN Customer c ON o.CustomerID = c.CustomerID
         INNER JOIN Restaurant r ON o.RestaurantID = r.RestaurantID
         WHERE o.OrderID = @id`
      );
    if (order.recordset.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const details = await pool
      .request()
      .input("orderId", parseInt(id))
      .query(
        `SELECT od.*, m.Name AS ItemName
         FROM OrderDetails od
         INNER JOIN MenuItem m ON od.MenuItemID = m.MenuItemID
         WHERE od.OrderID = @orderId`
      );

    return NextResponse.json({ ...order.recordset[0], items: details.recordset });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, deliveryAddress } = await request.json();
    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(id))
      .input("Status", status)
      .input("DeliveryAddress", deliveryAddress)
      .query("UPDATE [Order] SET Status=@Status, DeliveryAddress=@DeliveryAddress WHERE OrderID=@id");
    return NextResponse.json({ message: "Order updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    await pool.request().input("id", parseInt(id)).query("DELETE FROM OrderDetails WHERE OrderID = @id");
    await pool.request().input("id", parseInt(id)).query("DELETE FROM [Order] WHERE OrderID = @id");
    return NextResponse.json({ message: "Order deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
