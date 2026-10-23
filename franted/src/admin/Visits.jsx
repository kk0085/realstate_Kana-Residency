import { useEffect, useMemo, useState } from "react";
import { createVisit, deleteVisit, getVisits, updateVisit } from "../services/api";

const emptyForm = { customer: "", phone: "", property: "", location: "", date: "", time: "", status: "Scheduled" };
const statuses = ["All", "Scheduled", "Completed", "Cancelled"];
const statusStyles = { Scheduled: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200", Completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200", Cancelled: "border-rose-400/30 bg-rose-400/10 text-rose-200" };

const normalizeVisit = (visit) => ({
    ...visit,
    propertyDetail: visit.property || null,
    projectDetail: visit.project || null,
    leadDetail: visit.lead || null,
    property: visit.property?.title || visit.project?.name || visit.notes || "General visit",
    location: visit.property?.location || visit.project?.location || "-",
    displayDate: new Date(visit.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    status: visit.status.charAt(0) + visit.status.slice(1).toLowerCase(),
});

export default function Visits() {
    const [visits, setVisits] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [form, setForm] = useState(emptyForm);
    const [showModal, setShowModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadVisits = () => {
        setLoading(true);
        setError("");
        getVisits()
            .then((items) => setVisits(items.map(normalizeVisit)))
            .catch((requestError) => setError(requestError.message || "Unable to load visits"))
            .finally(() => setLoading(false));
    };

    useEffect(loadVisits, []);

    const filteredVisits = useMemo(() => visits.filter((visit) => {
        const query = search.toLowerCase();
        const matchesSearch = [visit.customer, visit.phone, visit.property, visit.location]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query));
        return matchesSearch && (statusFilter === "All" || visit.status === statusFilter);
    }), [visits, search, statusFilter]);

    const changeStatus = async (visit, status) => {
        try {
            await updateVisit(visit.id, { status: status.toUpperCase() });
            setVisits((current) => current.map((item) => item.id === visit.id ? { ...item, status } : item));
        } catch (requestError) {
            setError(requestError.message || "Unable to update visit");
        }
    };

    const scheduleVisit = async (event) => {
        event.preventDefault();
        if (!form.customer || !form.phone || !form.property || !form.date || !form.time) {
            setError("Customer, phone, property, date and time are required.");
            return;
        }
        setSaving(true);
        try {
            const visit = await createVisit({
                customer: form.customer,
                phone: form.phone,
                date: form.date,
                time: form.time,
                status: form.status.toUpperCase(),
                notes: `${form.property}${form.location ? ` - ${form.location}` : ""}`,
            });
            setVisits((current) => [normalizeVisit({ ...visit, notes: `${form.property}${form.location ? ` - ${form.location}` : ""}` }), ...current]);
            setForm(emptyForm);
            setShowModal(false);
            setError("");
        } catch (requestError) {
            setError(requestError.message || "Unable to schedule visit");
        } finally {
            setSaving(false);
        }
    };

    const removeVisit = async (id) => {
        if (!window.confirm("Delete this visit?")) return;
        try {
            await deleteVisit(id);
            setVisits((current) => current.filter((visit) => visit.id !== id));
        } catch (requestError) {
            setError(requestError.message || "Unable to delete visit");
        }
    };

    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6 md:px-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">Customer appointments</p><h1 className="mt-2 text-3xl font-semibold">Site visits</h1><p className="mt-1 text-sm text-slate-400">Schedule and track every property visit.</p></div><button type="button" onClick={() => setShowModal(true)} className="rounded-lg bg-rose-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-rose-200">+ Schedule visit</button></header>

                <section className="grid gap-3 sm:grid-cols-4"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Total</span><strong className="mt-1 block text-2xl">{visits.length}</strong></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Scheduled</span><strong className="mt-1 block text-2xl text-cyan-300">{visits.filter((item) => item.status === "Scheduled").length}</strong></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Completed</span><strong className="mt-1 block text-2xl text-emerald-300">{visits.filter((item) => item.status === "Completed").length}</strong></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Cancelled</span><strong className="mt-1 block text-2xl text-rose-300">{visits.filter((item) => item.status === "Cancelled").length}</strong></div></section>

                {error && <div className="flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100"><span>{error}</span><button type="button" onClick={loadVisits} className="font-semibold text-white">Retry</button></div>}

                <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10"><div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold">All visits</h2><p className="mt-1 text-sm text-slate-400">{filteredVisits.length} matching appointments</p></div><div className="flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or property" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300/50 sm:w-72" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#0d1b2e] px-3 py-2 text-sm text-white outline-none">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-white/10 bg-black/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Property</th><th className="px-5 py-4">Date & time</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{loading && <tr><td colSpan="5" className="px-5 py-12 text-center text-slate-400">Loading visits...</td></tr>}{!loading && filteredVisits.map((visit) => <tr key={visit.id} onClick={() => setSelectedVisit(visit)} className="cursor-pointer text-slate-300 transition hover:bg-white/[0.03]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-300/15 font-semibold text-rose-200">{visit.customer.charAt(0).toUpperCase()}</div><div><p className="font-medium text-white">{visit.customer}</p><p className="mt-1 text-xs text-slate-500">{visit.phone}</p></div></div></td><td className="px-5 py-4"><p className="font-medium text-slate-200">{visit.property}</p><p className="mt-1 text-xs text-slate-500">{visit.location}</p></td><td className="px-5 py-4"><p className="font-medium text-white">{visit.displayDate}</p><p className="mt-1 text-xs text-slate-400">{visit.time}</p></td><td className="px-5 py-4"><select value={visit.status} onClick={(event) => event.stopPropagation()} onChange={(event) => changeStatus(visit, event.target.value)} className={`rounded-full border px-2.5 py-1 text-xs outline-none ${statusStyles[visit.status] || "border-white/15 bg-white/5 text-slate-300"}`}>{statuses.slice(1).map((status) => <option key={status} className="bg-[#0d1b2e]">{status}</option>)}</select></td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><a href={`tel:${visit.phone}`} onClick={(event) => event.stopPropagation()} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:border-rose-300/40 hover:text-white">Call</a><button type="button" onClick={(event) => { event.stopPropagation(); removeVisit(visit.id); }} className="rounded-lg border border-red-400/20 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-400/10">Delete</button></div></td></tr>)}{!loading && filteredVisits.length === 0 && <tr><td colSpan="5" className="px-5 py-12 text-center text-slate-500">No visits match your search or filter.</td></tr>}</tbody></table></div></section>
            </div>

            {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowModal(false)}><form onSubmit={scheduleVisit} onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d1b2e] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">Schedule visit</h2><p className="mt-1 text-sm text-slate-400">Add an appointment to the database.</p></div><button type="button" onClick={() => setShowModal(false)} className="text-2xl text-slate-400 hover:text-white">&times;</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label><span className="mb-1 block text-xs text-slate-400">Customer *</span><input required value={form.customer} onChange={(event) => setForm({ ...form, customer: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-rose-300/50" placeholder="Customer name" /></label><label><span className="mb-1 block text-xs text-slate-400">Phone *</span><input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-rose-300/50" placeholder="+91 98765 43210" /></label><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Property or project *</span><input required value={form.property} onChange={(event) => setForm({ ...form, property: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" placeholder="Luxury 3 BHK Villa" /></label><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Location</span><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" placeholder="Vaishali Nagar, Jaipur" /></label><label><span className="mb-1 block text-xs text-slate-400">Date *</span><input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" /></label><label><span className="mb-1 block text-xs text-slate-400">Time *</span><input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" /></label><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"><option>Scheduled</option><option>Completed</option><option>Cancelled</option></select></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">Cancel</button><button disabled={saving} type="submit" className="rounded-lg bg-rose-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">{saving ? "Saving..." : "Save visit"}</button></div></form></div>}
            {selectedVisit && (
                <VisitDetailsModal
                    visit={selectedVisit}
                    onClose={() => setSelectedVisit(null)}
                    onStatusChange={(visit, status) => {
                        changeStatus(visit, status);
                        setSelectedVisit((current) => (current ? { ...current, status } : current));
                    }}
                />
            )}
        </main>
    );
}

function Detail({ label, value }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-medium text-white">{value}</p>
        </div>
    );
}

function VisitDetailsModal({ visit, onClose, onStatusChange }) {
    const property = visit.propertyDetail;
    const project = visit.projectDetail;
    const lead = visit.leadDetail;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4" onClick={onClose}>
            <div onClick={(event) => event.stopPropagation()} className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d1b2e] shadow-2xl">
                <div className="flex items-start justify-between border-b border-white/10 p-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">Visit details</p>
                        <h2 className="mt-1 text-xl font-semibold">{visit.customer}</h2>
                        <p className="mt-1 text-sm text-slate-400">{visit.displayDate} at {visit.time}</p>
                    </div>

                    <button type="button" onClick={onClose} className="text-2xl text-slate-400 hover:text-white">&times;</button>
                </div>

                <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Detail label="Customer" value={visit.customer} />
                        <Detail label="Phone" value={visit.phone} />
                        <Detail label="Date" value={visit.displayDate} />
                        <Detail label="Time" value={visit.time} />
                        <Detail label="Status" value={visit.status} />
                        <Detail label={property || project ? "Location" : "Reference"} value={visit.location} />
                    </div>

                    {visit.notes && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-xs text-slate-500">Notes</p>
                            <p className="mt-1 text-sm text-slate-200">{visit.notes}</p>
                        </div>
                    )}

                    {(property || project) && (
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <p className="bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-wider text-slate-500">
                                {property ? "Linked property" : "Linked project"}
                            </p>

                            {property && (
                                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                                    {property.image && (
                                        <img src={property.image} alt={property.title} className="h-32 w-full rounded-lg object-cover sm:w-52" />
                                    )}

                                    <div className="space-y-2 text-sm">
                                        <p className="text-base font-semibold text-white">{property.title}</p>
                                        <p className="text-slate-400">{property.location}</p>
                                        <p className="text-rose-200">{property.price}</p>
                                        <p className="text-xs text-slate-500">
                                            {[property.type, property.bedrooms ? `${property.bedrooms} Beds` : null, property.area].filter(Boolean).join(" | ")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {project && (
                                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                                    {project.image && (
                                        <img src={project.image} alt={project.name} className="h-32 w-full rounded-lg object-cover sm:w-52" />
                                    )}

                                    <div className="space-y-2 text-sm">
                                        <p className="text-base font-semibold text-white">{project.name}</p>
                                        <p className="text-slate-400">{project.location}</p>
                                        <p className="text-rose-200">{project.price}</p>
                                        <p className="text-xs text-slate-500">
                                            {[project.status, project.available ? `${project.available} available` : null].filter(Boolean).join(" | ")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {lead && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-xs text-slate-500">Linked lead</p>
                            <p className="mt-1 text-sm font-medium text-white">{lead.name}</p>
                            <p className="mt-1 text-xs text-slate-400">
                                {[lead.phone, lead.email, lead.status].filter(Boolean).join(" | ")}
                            </p>
                            {lead.message && <p className="mt-2 text-xs text-slate-400">{lead.message}</p>}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a href={`tel:${visit.phone}`} className="flex-1 rounded-lg bg-rose-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 hover:bg-rose-200">Call customer</a>

                        <select
                            value={visit.status}
                            onChange={(event) => onStatusChange(visit, event.target.value)}
                            className="rounded-lg border border-white/10 bg-[#0d1b2e] px-3 py-2.5 text-sm text-white outline-none"
                        >
                            {statuses.slice(1).map((status) => (
                                <option key={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}