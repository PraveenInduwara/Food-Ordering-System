import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", parseInt(id))
      .query(
        `SELECT m.*, r.Name AS RestaurantName
         FROM MenuItem m
         INNER JOIN Restaurant r ON m.RestaurantID = r.RestaurantID
         WHERE m.MenuItemID = @id`
      );
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }
    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { restaurantId, name, description, price, category } = await request.json();
    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(id))
      .input("RestaurantID", restaurantId)
      .input("Name", name)
      .input("Description", description)
      .input("Price", price)
      .input("Category", category)
      .query(
        "UPDATE MenuItem SET RestaurantID=@RestaurantID, Name=@Name, Description=@Description, Price=@Price, Category=@Category WHERE MenuItemID=@id"
      );
    return NextResponse.json({ message: "Menu item updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(id))
      .query("DELETE FROM MenuItem WHERE MenuItemID = @id");
    return NextResponse.json({ message: "Menu item deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
