"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [marketFilter, setMarketFilter] = useState("Todos");
    const [markets, setMarkets] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setFiltered(data);
                // Extrae valores únicos de "market"
                const uniqueMarkets = [...new Set(data.map((p: any) => p.market))] as string[];
                setMarkets(uniqueMarkets);
            });
    }, []);

    useEffect(() => {
        let results = [...products];

        if (search) {
            results = results.filter((p: any) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (marketFilter !== "Todos") {
            results = results.filter((p: any) => p.market === marketFilter);
        }

        setFiltered(results);
    }, [search, marketFilter, products]);

    const deleteProduct = async (id: string) => {
        if (!confirm("¿Eliminar este producto?")) return;
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        setProducts(products.filter((p: any) => p._id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Productos</h1>
                <Link
                    href="/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Crear producto
                </Link>
            </div>

            {/* Buscador y filtro */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded w-full sm:w-1/2"
                />

                <select
                    value={marketFilter}
                    onChange={(e) => setMarketFilter(e.target.value)}
                    className="border px-4 py-2 rounded w-full sm:w-1/3"
                >
                    <option value="Todos">Todos los mercados</option>
                    {markets.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto shadow rounded">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-6 py-3 border-b">Nombre</th>
                            <th className="px-6 py-3 border-b">Mercado</th>
                            <th className="px-6 py-3 border-b">Precio</th>
                            <th className="px-6 py-3 border-b text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-500">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                        {filtered.map((product: any) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 border-b">{product.name}</td>
                                <td className="px-6 py-4 border-b">{product.market}</td>
                                <td className="px-6 py-4 border-b">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 border-b text-center space-x-4">
                                    <Link
                                        href={`/edit/${product._id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
