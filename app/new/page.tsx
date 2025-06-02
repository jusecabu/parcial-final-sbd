"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const [name, setName] = useState("");
    const [market, setMarket] = useState("");
    const [price, setPrice] = useState("");
    const [existingNames, setExistingNames] = useState<string[]>([]);
    const [existingMarkets, setExistingMarkets] = useState<string[]>([]);

    const router = useRouter();

    // Cargar productos existentes para autocompletar
    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                const names = [...new Set(data.map((p: any) => p.name))] as string[];
                const markets = [...new Set(data.map((p: any) => p.market))] as string[];
                setExistingNames(names);
                setExistingMarkets(markets);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !market || !price) {
            alert("Todos los campos son requeridos.");
            return;
        }

        await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify({ name, market, price: parseFloat(price) }),
        });

        router.push("/");
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name with datalist */}
                <div>
                    <label className="block font-semibold mb-1">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        list="name-list"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-4 py-2"
                        placeholder="Ej: Manzana, Pan..."
                        required
                    />
                    <datalist id="name-list">
                        {existingNames.map((n) => (
                            <option key={n} value={n} />
                        ))}
                    </datalist>
                </div>

                {/* Market with datalist */}
                <div>
                    <label className="block font-semibold mb-1">Mercado</label>
                    <input
                        type="text"
                        value={market}
                        list="market-list"
                        onChange={(e) => setMarket(e.target.value)}
                        className="w-full border rounded px-4 py-2"
                        placeholder="Ej: Walmart, Plaza local..."
                        required
                    />
                    <datalist id="market-list">
                        {existingMarkets.map((m) => (
                            <option key={m} value={m} />
                        ))}
                    </datalist>
                </div>

                {/* Price */}
                <div>
                    <label className="block font-semibold mb-1">Precio</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border rounded px-4 py-2"
                        placeholder="Ej: 12.50"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Guardar producto
                </button>
            </form>
        </div>
    );
}
