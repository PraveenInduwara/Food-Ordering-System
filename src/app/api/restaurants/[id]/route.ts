import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", parseInt(id))
      .query("SELECT * FROM Restaurant WHERE RestaurantID = @id");
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch restaurant" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, address, phone, cuisineType, rating } = await request.json();
    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(id))
      .input("Name", name)
      .input("Address", address)
      .input("Phone", phone)
      .input("CuisineType", cuisineType)
      .input("Rating", rating)
      .query(
        "UPDATE Restaurant SET Name=@Name, Address=@Address, Phone=@Phone, CuisineType=@CuisineType, Rating=@Rating WHERE RestaurantID=@id"
      );
    return NextResponse.json({ message: "Restaurant updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(id))
      .query("DELETE FROM Restaurant WHERE RestaurantID = @id");
    return NextResponse.json({ message: "Restaurant deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 });
  }
}
