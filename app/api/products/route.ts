import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const data = await req.json();
    await connectDB();
    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
}
