import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
        return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: any) {
    const data = await req.json();
    await connectDB();
    const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(product);
}

export async function DELETE(req: Request, { params }: any) {
    await connectDB();
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Eliminado" });
}
