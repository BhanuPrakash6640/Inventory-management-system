import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    Trash2, Plus, Search, Filter, Package,
    LayoutDashboard, Box, Bell, User, CheckCircle2,
    XCircle, ChevronDown, PackageOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
    const API = "http://localhost:8081/products";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    // Toasts
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type, id: Date.now() });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProducts = () => {
        setIsLoading(true);
        axios.get(API)
            .then(res => {
                setProducts(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        // Simulate slight network delay for skeletons
        setTimeout(() => {
            fetchProducts();
        }, 800);
    }, []);

    const addProduct = (e) => {
        e.preventDefault();
        if (!name || !category || !quantity) {
            showToast("Please fill all fields.", "error");
            return;
        }

        setIsLoading(true);
        axios.post(API, {
            name,
            category,
            quantity: parseInt(quantity)
        })
            .then(() => {
                fetchProducts();
                setName("");
                setCategory("");
                setQuantity("");
                showToast("Product added successfully!");
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
                showToast("Failed to add product.", "error");
            });
    };

    const deleteProduct = (id) => {
        setIsLoading(true);
        axios.delete(`${API}/${id}`)
            .then(() => {
                fetchProducts();
                showToast("Product deleted successfully!");
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
                showToast("Failed to delete product.", "error");
            });
    };

    // Derived states
    const categories = ["All", ...new Set(products.map(p => p.category))];

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === "All" || p.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, filterCategory]);

    const statCards = [
        { label: "Total Inventory Value", value: "$0.00", sub: "Based on retail" },
        { label: "Products Tracking", value: products.length, sub: "Unique SKUs" },
        { label: "Low Stock Items", value: products.filter(p => p.quantity < 5).length, sub: "Needs reordering" },
    ];

    return (
        <div className="min-h-screen bg-[#F6F9FC] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-[#635BFF]/20">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 min-w-[300px]"
                    >
                        {toast.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                        ) : (
                            <XCircle className="w-5 h-5 text-[#F43F5E]" />
                        )}
                        <p className="font-medium text-[15px]">{toast.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navbar (Stripe-esque) */}
            <header className="h-16 bg-white flex items-center justify-between px-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#635BFF] rounded-lg flex items-center justify-center shadow-sm shadow-[#635BFF]/30">
                        <Box className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-[17px] tracking-tight">inventory</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group hidden sm:block">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#635BFF] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search everything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#F6F9FC] hover:bg-gray-100 text-sm pl-9 pr-4 py-2 rounded-full w-64 outline-none focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF]/40 border border-transparent transition-all shadow-inner"
                        />
                    </div>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[#F43F5E] rounded-full border border-white" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
                        <User className="w-4 h-4 text-gray-600" />
                    </div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto p-8 pt-10">
                {/* Header Section (Notion-esque Typography) */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#111827] mb-2 flex items-center gap-3">
                        Products
                        <span className="text-sm font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full mt-1">
                            {products.length} items
                        </span>
                    </h1>
                    <p className="text-gray-500 text-[15px]">Manage your inventory listings, pricing, and stock levels.</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    {statCards.map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group cursor-default"
                        >
                            <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-bold tracking-tight text-[#111827] group-hover:text-[#635BFF] transition-colors">{stat.value}</h3>
                            <p className="text-sm text-gray-400 mt-2 font-medium">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Filter & Table Area */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
                            <div className="flex items-center px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors w-full sm:w-auto">
                                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                                <select
                                    className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer appearance-none pr-6 w-full"
                                    value={filterCategory}
                                    onChange={e => setFilterCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat} CATEGORY</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-[0_2px_14px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[14px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-[#F9FAFB]/50 text-gray-500 font-medium">
                                            <th className="px-6 py-4 font-semibold tracking-wide">Product</th>
                                            <th className="px-6 py-4 font-semibold tracking-wide">Category</th>
                                            <th className="px-6 py-4 font-semibold tracking-wide">Stock</th>
                                            <th className="px-6 py-4 font-semibold tracking-wide text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            /* Skeleton Loading */
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded-md animate-pulse w-3/4" /></td>
                                                    <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-md animate-pulse w-1/2" /></td>
                                                    <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-md animate-pulse w-8" /></td>
                                                    <td className="px-6 py-4"><div className="h-8 bg-gray-50 rounded-lg animate-pulse w-8 ml-auto" /></td>
                                                </tr>
                                            ))
                                        ) : filteredProducts.length === 0 ? (
                                            /* Empty State */
                                            <tr>
                                                <td colSpan="4" className="py-20 text-center">
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="flex flex-col items-center justify-center max-w-sm mx-auto"
                                                    >
                                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                                                            <PackageOpen className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <h3 className="text-[#111827] font-semibold text-lg mb-1">No products found</h3>
                                                        <p className="text-gray-500 text-sm mb-6">You don't have any products matching the current filters. Adjust your filters or add a new product.</p>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <AnimatePresence>
                                                {filteredProducts.map((p) => (
                                                    <motion.tr
                                                        key={p.id || p.name}
                                                        initial={{ opacity: 0, backgroundColor: "#ffffff" }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0, backgroundColor: "#FEF2F2", transition: { duration: 0.2 } }}
                                                        className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors group"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-[#111827] flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-sm">
                                                                <Package className="w-4 h-4 text-gray-500" />
                                                            </div>
                                                            {p.name}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium bg-gray-100 text-gray-700">
                                                                {p.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-medium ${p.quantity < 5 ? 'text-[#F43F5E]' : 'text-gray-600'}`}>
                                                                {p.quantity} Unit{p.quantity !== 1 ? 's' : ''}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <motion.button
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => deleteProduct(p.id)}
                                                                className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#FEE2E2] text-[#F43F5E] transition-all ml-auto focus:opacity-100"
                                                                title="Delete product"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </motion.button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Add Form Area */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 sticky top-24"
                        >
                            <div className="mb-6">
                                <h2 className="text-[17px] font-bold text-[#111827]">Add New Product</h2>
                                <p className="text-[13px] text-gray-500 mt-1">Fill in the details to add an item.</p>
                            </div>

                            <form onSubmit={addProduct} className="space-y-4">
                                <div className="space-y-1.5 focus-within:text-[#635BFF] transition-colors">
                                    <label className="text-[13px] font-semibold text-gray-600 transition-colors">Name</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. Apple Watch"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full h-10 px-3 text-[14px] bg-white border border-gray-200 rounded-lg outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 transition-all shadow-sm placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5 focus-within:text-[#635BFF] transition-colors">
                                    <label className="text-[13px] font-semibold text-gray-600 transition-colors">Category</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. Electronics"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full h-10 px-3 text-[14px] bg-white border border-gray-200 rounded-lg outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 transition-all shadow-sm placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5 focus-within:text-[#635BFF] transition-colors">
                                    <label className="text-[13px] font-semibold text-gray-600 transition-colors">Quantity Initial</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        className="w-full h-10 px-3 text-[14px] bg-white border border-gray-200 rounded-lg outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 transition-all shadow-sm placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.97 }}
                                        disabled={isLoading}
                                        type="submit"
                                        className={`w-full h-11 bg-[#111827] hover:bg-[#1F2937] text-white text-[15px] font-medium rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Save Product
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;