import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Restaurant ORDER BY RestaurantID");
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, address, phone, cuisineType, rating } = await request.json();
    const pool = await getPool();
    await pool
      .request()
      .input("Name", name)
      .input("Address", address)
      .input("Phone", phone)
      .input("CuisineType", cuisineType)
      .input("Rating", rating || 0)
      .query(
        "INSERT INTO Restaurant (Name, Address, Phone, CuisineType, Rating) VALUES (@Name, @Address, @Phone, @CuisineType, @Rating)"
      );
    return NextResponse.json({ message: "Restaurant created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
}
