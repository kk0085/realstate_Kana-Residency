import { useEffect, useMemo, useState } from "react";
import { deleteLead, getLeads, updateLead } from "../services/api";

const statusOptions = ["All", "New", "Contacted", "Qualified", "Closed"];

const normalizeLead = (lead) => ({
    ...lead,
    interest: lead.property?.title || lead.project?.name || "General enquiry",
    status: lead.status.charAt(0) + lead.status.slice(1).toLowerCase(),
});

const statusStyles = {
    New: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    Contacted: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    Qualified: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    Closed: "border-violet-400/30 bg-violet-400/10 text-violet-200",
};

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadLeads = () => {
        setLoading(true);
        setError("");
        getLeads()
            .then((items) => setLeads(items.map(normalizeLead)))
            .catch((requestError) => setError(requestError.message || "Unable to load leads"))
            .finally(() => setLoading(false));
    };

    useEffect(loadLeads, []);

    const filteredLeads = useMemo(() => leads.filter((lead) => {
        const query = search.toLowerCase();
        const matchesSearch = [lead.name, lead.email, lead.phone, lead.interest, lead.source]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query));
        return matchesSearch && (statusFilter === "All" || lead.status === statusFilter);
    }), [leads, search, statusFilter]);

    const changeStatus = async (lead, status) => {
        try {
            await updateLead(lead.id, { status: status.toUpperCase() });
            setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status } : item));
        } catch (requestError) {
            setError(requestError.message || "Unable to update lead");
        }
    };

    const removeLead = async (id) => {
        if (!window.confirm("Delete this lead?")) return;
        try {
            await deleteLead(id);
            setLeads((current) => current.filter((lead) => lead.id !== id));
        } catch (requestError) {
            setError(requestError.message || "Unable to delete lead");
        }
    };

    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6 md:px-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Customer pipeline</p><h1 className="mt-2 text-3xl font-semibold">Leads</h1><p className="mt-1 text-sm text-slate-400">Track enquiries and move each customer to the next step.</p></div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2"><strong className="block text-lg text-white">{leads.length}</strong><span className="text-slate-400">Total</span></div><div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2"><strong className="block text-lg text-cyan-300">{leads.filter((lead) => lead.status === "New").length}</strong><span className="text-slate-400">New</span></div><div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2"><strong className="block text-lg text-emerald-300">{leads.filter((lead) => lead.status === "Qualified").length}</strong><span className="text-slate-400">Qualified</span></div></div>
                </header>

                {error && <div className="flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100"><span>{error}</span><button type="button" onClick={loadLeads} className="font-semibold text-white">Retry</button></div>}

                <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
                    <div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold">All leads</h2><p className="mt-1 text-sm text-slate-400">{filteredLeads.length} matching records</p></div><div className="flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone or interest" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50 sm:w-72" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#0d1b2e] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/50">{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div></div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-white/10 bg-black/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Interest</th><th className="px-5 py-4">Source</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Received</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">
                            {loading && <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-400">Loading leads...</td></tr>}
                            {!loading && filteredLeads.map((lead) => <tr key={lead.id} className="text-slate-300 transition hover:bg-white/[0.03]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 font-semibold text-cyan-200">{lead.name.charAt(0).toUpperCase()}</div><div><p className="font-medium text-white">{lead.name}</p><p className="mt-1 text-xs text-slate-500">{lead.email || lead.phone}</p></div></div></td><td className="px-5 py-4 font-medium text-slate-200">{lead.interest}</td><td className="px-5 py-4"><span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">{lead.source || "Website"}</span></td><td className="px-5 py-4"><select value={lead.status} onChange={(event) => changeStatus(lead, event.target.value)} className={`rounded-full border px-2.5 py-1 text-xs outline-none ${statusStyles[lead.status] || "border-white/15 bg-white/5 text-slate-300"}`}>{statusOptions.slice(1).map((status) => <option key={status} className="bg-[#0d1b2e]">{status}</option>)}</select></td><td className="px-5 py-4 text-xs text-slate-400">{new Date(lead.createdAt).toLocaleDateString("en-IN")}</td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><a href={`tel:${lead.phone}`} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:border-cyan-300/40 hover:text-white">Call</a><button type="button" onClick={() => removeLead(lead.id)} className="rounded-lg border border-red-400/20 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-400/10">Delete</button></div></td></tr>)}
                            {!loading && filteredLeads.length === 0 && <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-500">No leads match your search or filter.</td></tr>}
                        </tbody></table>
                    </div>
                </section>
            </div>
        </main>
    );
}