import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      `SELECT m.*, r.Name AS RestaurantName
       FROM MenuItem m
       INNER JOIN Restaurant r ON m.RestaurantID = r.RestaurantID
       ORDER BY m.MenuItemID`
    );
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, name, description, price, category } = await request.json();
    const pool = await getPool();
    await pool
      .request()
      .input("RestaurantID", restaurantId)
      .input("Name", name)
      .input("Description", description)
      .input("Price", price)
      .input("Category", category)
      .query(
        "INSERT INTO MenuItem (RestaurantID, Name, Description, Price, Category) VALUES (@RestaurantID, @Name, @Description, @Price, @Category)"
      );
    return NextResponse.json({ message: "Menu item created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
