import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "kk@gmail.com",
        password: "kk123",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await login(form.email, form.password);

            console.log("LOGIN RESPONSE:", response);

            // Login successful
            navigate("/admin", { replace: true });
        } catch (err) {
            console.error("LOGIN ERROR:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020b1c] px-5 py-16 text-white flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#07152d] p-8 shadow-2xl shadow-purple-900/20">

                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-2xl">
                        🏠
                    </div>

                    <h1 className="mt-5 text-3xl font-bold">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 py-3 font-semibold disabled:opacity-70"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
}