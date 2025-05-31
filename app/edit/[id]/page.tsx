"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [name, setName] = useState("");
    const [market, setMarket] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.name);
                setMarket(data.market);
                setPrice(data.price);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, market, price: parseFloat(price) }),
        });
        router.push("/");
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Editar producto</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    className="w-full border px-4 py-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Mercado"
                    className="w-full border px-4 py-2 rounded"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Precio"
                    className="w-full border px-4 py-2 rounded"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Actualizar
                </button>
            </form>
        </div>
    );
}
