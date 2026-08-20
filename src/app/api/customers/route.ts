import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

// GET all customers
export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Customer ORDER BY CustomerID");
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST create a new customer
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, address } = await request.json();
    const pool = await getPool();
    await pool
      .request()
      .input("FirstName", firstName)
      .input("LastName", lastName)
      .input("Email", email)
      .input("Phone", phone)
      .input("Address", address)
      .query(
        "INSERT INTO Customer (FirstName, LastName, Email, Phone, Address) VALUES (@FirstName, @LastName, @Email, @Phone, @Address)"
      );
    return NextResponse.json({ message: "Customer created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
