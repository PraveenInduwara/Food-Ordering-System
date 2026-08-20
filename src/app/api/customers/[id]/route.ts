import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

// GET single customer
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", parseInt(id))
      .query("SELECT * FROM Customer WHERE CustomerID = @id");
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

// PUT update customer
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { firstName, lastName, email, phone, address } = await request.json();
    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(id))
      .input("FirstName", firstName)
      .input("LastName", lastName)
      .input("Email", email)
      .input("Phone", phone)
      .input("Address", address)
      .query(
        "UPDATE Customer SET FirstName=@FirstName, LastName=@LastName, Email=@Email, Phone=@Phone, Address=@Address WHERE CustomerID=@id"
      );
    return NextResponse.json({ message: "Customer updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

// DELETE customer
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(id))
      .query("DELETE FROM Customer WHERE CustomerID = @id");
    return NextResponse.json({ message: "Customer deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
