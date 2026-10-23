import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getDashboard } from "../services/api";

const cards = [
    ["totalProperties", "Total properties", "PROPERTIES", "text-cyan-300", "/admin/properties"],
    ["totalProjects", "Total projects", "PROJECTS", "text-amber-300", "/admin/projects"],
    ["totalLeads", "Total leads", "LEADS", "text-emerald-300", "/admin/leads"],
    ["upcomingVisits", "Upcoming visits", "VISITS", "text-rose-300", "/admin/visits"],
];

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value))
    : "-";

const statusClass = {
    NEW: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    CONTACTED: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    QUALIFIED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    CLOSED: "border-violet-400/30 bg-violet-400/10 text-violet-200",
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        getDashboard()
            .then((result) => mounted && setData(result))
            .catch((requestError) => {
                if (!mounted) return;
                if (requestError.message.toLowerCase().includes("unauthorized")) {
                    clearAuth();
                    navigate("/admin/login", { replace: true });
                    return;
                }
                setError(requestError.message || "Unable to load dashboard");
            });
        return () => { mounted = false; };
    }, [navigate]);

    const logout = () => {
        clearAuth();
        navigate("/admin/login", { replace: true });
    };

    if (!data && !error) {
        return <main className="min-h-screen bg-[#07111f] p-6 text-white"><div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-20 rounded-2xl bg-white/5" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-36 rounded-2xl bg-white/5" />)}</div><div className="h-96 rounded-2xl bg-white/5" /></div></main>;
    }

    if (error) {
        return <main className="flex min-h-screen items-center justify-center bg-[#07111f] p-6 text-white"><div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-center"><h1 className="text-xl font-semibold">Dashboard unavailable</h1><p className="mt-2 text-sm text-red-100/80">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900">Try again</button></div></main>;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { stats, propertyOverview, leadOverview, recentLeads } = data;

    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-5 text-white sm:px-6 md:px-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Real estate control room</p><h1 className="mt-2 text-3xl font-semibold">Dashboard</h1><p className="mt-1 text-sm text-slate-400">Live overview from your database.</p></div>
                    <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user.name || "Admin"}</p><p className="text-xs text-slate-400">{user.email || "Administrator"}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300 font-bold text-slate-950">{(user.name || "A").charAt(0).toUpperCase()}</div><button type="button" onClick={logout} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-300 hover:border-white/30 hover:text-white">Logout</button></div>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([key, label, marker, color, path]) => <button key={key} type="button" onClick={() => navigate(path)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-cyan-300/40"><div className="flex justify-between"><span className={`text-xs font-bold tracking-widest ${color}`}>{marker}</span><span className="text-xs text-emerald-300">LIVE</span></div><p className="mt-6 text-3xl font-semibold">{stats[key]}</p><p className="mt-1 flex items-center justify-between text-sm text-slate-400"><span>{label}</span><span className="text-cyan-300">-&gt;</span></p></button>)}</section>

                <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                    <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Recent leads</h2><p className="mt-1 text-sm text-slate-400">Latest enquiries received by the website.</p></div><button type="button" onClick={() => navigate("/admin/leads")} className="text-sm font-semibold text-cyan-300">View all</button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Interest</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Date</th></tr></thead><tbody className="divide-y divide-white/5">{recentLeads.length ? recentLeads.map((lead) => { const interest = lead.property?.title || lead.project?.name || "General enquiry"; return <tr key={lead.id} className="text-slate-300"><td className="py-4 pr-4"><p className="font-medium text-white">{lead.name}</p><p className="mt-1 text-xs text-slate-500">{lead.phone}</p></td><td className="py-4 pr-4">{interest}</td><td className="py-4 pr-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${statusClass[lead.status] || "border-white/15 bg-white/5 text-slate-300"}`}>{lead.status || "Unknown"}</span></td><td className="py-4 text-xs text-slate-400">{formatDate(lead.createdAt)}</td></tr>; }) : <tr><td colSpan="4" className="py-8 text-center text-slate-500">No leads found yet.</td></tr>}</tbody></table></div></article>

                    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><h2 className="text-lg font-semibold">Quick actions</h2><p className="mt-1 text-sm text-slate-400">Jump to the work that needs attention.</p><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{[["Add property", "/admin/properties"], ["Add project", "/admin/projects"], ["Manage leads", "/admin/leads"], ["Manage visits", "/admin/visits"], ["Website settings", "/admin/settings"]].map(([label, path]) => <button key={path} type="button" onClick={() => navigate(path)} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-left hover:border-cyan-300/40"><span className="text-sm font-medium">{label}</span><span className="text-cyan-300">-&gt;</span></button>)}</div></article>
                </section>

                <section className="grid gap-6 md:grid-cols-2"><article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><h2 className="text-lg font-semibold">Property overview</h2><div className="mt-5 space-y-4">{[["Available", propertyOverview.available, "bg-emerald-400"], ["Sold", propertyOverview.sold, "bg-rose-400"], ["Pending", propertyOverview.pending, "bg-amber-400"]].map(([label, value, color]) => { const total = Math.max(stats.totalProperties, 1); return <div key={label}><div className="flex justify-between text-sm"><span className="text-slate-300">{label}</span><strong>{value}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full ${color}`} style={{ width: `${Math.min((value / total) * 100, 100)}%` }} /></div></div>; })}</div></article><article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><h2 className="text-lg font-semibold">Lead pipeline</h2><p className="mt-1 text-sm text-slate-400">Current lead status distribution.</p><div className="mt-5 grid grid-cols-3 gap-3 text-center">{[["New", leadOverview.new, "text-cyan-300"], ["Contacted", leadOverview.contacted, "text-amber-300"], ["Qualified", leadOverview.qualified, "text-emerald-300"]].map(([label, value, color]) => <div key={label} className="rounded-xl border border-white/10 bg-black/10 p-4"><p className={`text-2xl font-semibold ${color}`}>{value}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>)}</div></article></section>
            </div>
        </main>
    );
}