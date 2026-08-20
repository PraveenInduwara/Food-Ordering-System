import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      `SELECT o.*, c.FirstName + ' ' + c.LastName AS CustomerName, r.Name AS RestaurantName
       FROM [Order] o
       INNER JOIN Customer c ON o.CustomerID = c.CustomerID
       INNER JOIN Restaurant r ON o.RestaurantID = r.RestaurantID
       ORDER BY o.OrderID DESC`
    );
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, restaurantId, deliveryAddress, items } = await request.json();
    const pool = await getPool();

    const orderResult = await pool
      .request()
      .input("CustomerID", customerId)
      .input("RestaurantID", restaurantId)
      .input("DeliveryAddress", deliveryAddress)
      .query(
        `INSERT INTO [Order] (CustomerID, RestaurantID, DeliveryAddress, Status)
         OUTPUT INSERTED.OrderID
         VALUES (@CustomerID, @RestaurantID, @DeliveryAddress, 'Pending')`
      );

    const orderId = orderResult.recordset[0].OrderID;

    for (const item of items) {
      await pool
        .request()
        .input("OrderID", orderId)
        .input("MenuItemID", item.menuItemId)
        .input("Quantity", item.quantity)
        .input("UnitPrice", item.unitPrice)
        .query(
          "INSERT INTO OrderDetails (OrderID, MenuItemID, Quantity, UnitPrice) VALUES (@OrderID, @MenuItemID, @Quantity, @UnitPrice)"
        );
    }

    return NextResponse.json({ message: "Order created", orderId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
