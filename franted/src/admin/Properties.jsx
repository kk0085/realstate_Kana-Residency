import { useEffect, useMemo, useState } from "react";
import { createProperty, deleteProperty, getProperties, updateProperty } from "../services/api";

const emptyForm = { title: "", location: "", type: "Apartment", price: "", bedrooms: "2", area: "", image: "", status: "Available" };
const types = ["All", "Apartment", "Villa", "House", "Plot"];
const statusStyles = { Available: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200", Pending: "border-amber-400/30 bg-amber-400/10 text-amber-200", Sold: "border-rose-400/30 bg-rose-400/10 text-rose-200" };

const normalizeProperty = (property) => ({
    ...property,
    status: property.status.charAt(0) + property.status.slice(1).toLowerCase(),
});

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [form, setForm] = useState(emptyForm);
    const [showModal, setShowModal] = useState(false);
    const [editingPropertyId, setEditingPropertyId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const resetForm = () => {
        setForm(emptyForm);
        setEditingPropertyId(null);
    };

    const openAddPropertyModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditPropertyModal = (property) => {
        setForm({
            title: property.title || "",
            location: property.location || "",
            type: property.type || "Apartment",
            price: property.price || "",
            bedrooms: String(property.bedrooms ?? "2"),
            area: property.area || "",
            image: property.image || "",
            status: property.status || "Available",
        });
        setEditingPropertyId(property.id);
        setShowModal(true);
    };

    const loadProperties = () => {
        setLoading(true);
        setError("");
        getProperties()
            .then((items) => setProperties(items.map(normalizeProperty)))
            .catch((requestError) => setError(requestError.message || "Unable to load properties"))
            .finally(() => setLoading(false));
    };

    useEffect(loadProperties, []);

    const filteredProperties = useMemo(() => properties.filter((property) => {
        const query = search.toLowerCase();
        const matchesSearch = property.title.toLowerCase().includes(query) || property.location.toLowerCase().includes(query);
        return matchesSearch && (typeFilter === "All" || property.type === typeFilter);
    }), [properties, search, typeFilter]);

    const saveProperty = async (event) => {
        event.preventDefault();
        if (!form.title || !form.location || !form.price) {
            setError("Title, location and price are required.");
            return;
        }
        setSaving(true);
        try {
            const payload = { ...form, bedrooms: Number(form.bedrooms), image: form.image || "", status: form.status.toUpperCase() };
            const property = editingPropertyId
                ? await updateProperty(editingPropertyId, payload)
                : await createProperty(payload);

            setProperties((current) => {
                const next = current.filter((item) => item.id !== property.id);
                return [normalizeProperty(property), ...next];
            });
            resetForm();
            setShowModal(false);
            setError("");
        } catch (requestError) {
            setError(requestError.message || (editingPropertyId ? "Unable to update property" : "Unable to create property"));
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((current) => ({ ...current, image: reader.result }));
            setError("");
        };
        reader.readAsDataURL(file);
    };

    const removeProperty = async (id) => {
        if (!window.confirm("Delete this property?")) return;
        try {
            await deleteProperty(id);
            setProperties((current) => current.filter((property) => property.id !== id));
        } catch (requestError) {
            setError(requestError.message || "Unable to delete property");
        }
    };

    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6 md:px-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Inventory control</p><h1 className="mt-2 text-3xl font-semibold">Properties</h1><p className="mt-1 text-sm text-slate-400">Manage listings, availability and pricing.</p></div><button type="button" onClick={openAddPropertyModal} className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200">+ Add property</button></header>

                <section className="grid gap-3 sm:grid-cols-4"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Total</span><strong className="mt-1 block text-2xl">{properties.length}</strong></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Available</span><strong className="mt-1 block text-2xl text-emerald-300">{properties.filter((item) => item.status === "Available").length}</strong></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Pending</span><strong className="mt-1 block text-2xl text-amber-300">{properties.filter((item) => item.status === "Pending").length}</strong></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">Sold</span><strong className="mt-1 block text-2xl text-rose-300">{properties.filter((item) => item.status === "Sold").length}</strong></div></section>

                {error && <div className="flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100"><span>{error}</span><button type="button" onClick={loadProperties} className="font-semibold text-white">Retry</button></div>}

                <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10"><div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold">All properties</h2><p className="mt-1 text-sm text-slate-400">{filteredProperties.length} matching listings</p></div><div className="flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or location" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50 sm:w-72" /><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#0d1b2e] px-3 py-2 text-sm text-white outline-none">{types.map((type) => <option key={type}>{type}</option>)}</select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-white/10 bg-black/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Property</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Details</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{loading && <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-400">Loading properties...</td></tr>}{!loading && filteredProperties.map((property) => <tr key={property.id} className="text-slate-300 transition hover:bg-white/[0.03]"><td className="px-5 py-4"><p className="font-medium text-white">{property.title}</p><p className="mt-1 text-xs text-slate-500">{property.location}</p></td><td className="px-5 py-4">{property.type}</td><td className="px-5 py-4 font-semibold text-white">{property.price}</td><td className="px-5 py-4 text-slate-400">{property.bedrooms > 0 ? `${property.bedrooms} BHK` : "Plot"}{property.area ? ` - ${property.area}` : ""}</td><td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs ${statusStyles[property.status] || "border-white/15 bg-white/5 text-slate-300"}`}>{property.status}</span></td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEditPropertyModal(property)} className="rounded-lg border border-cyan-400/30 px-2.5 py-1.5 text-xs text-cyan-300 hover:bg-cyan-400/10">Edit</button><button type="button" onClick={() => removeProperty(property.id)} className="rounded-lg border border-red-400/20 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-400/10">Delete</button></div></td></tr>)}{!loading && filteredProperties.length === 0 && <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-500">No properties match your search or filter.</td></tr>}</tbody></table></div></section>
            </div>

            {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowModal(false)}><form onSubmit={saveProperty} onClick={(event) => event.stopPropagation()} className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1b2e] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">{editingPropertyId ? "Update property" : "Add property"}</h2><p className="mt-1 text-sm text-slate-400">{editingPropertyId ? "Update this listing." : "Create a listing in the database."}</p></div><button type="button" onClick={() => setShowModal(false)} className="text-2xl text-slate-400 hover:text-white">&times;</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Title *</span><input required name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/50" placeholder="Luxury 3 BHK Villa" /></label><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Location *</span><input required name="location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/50" placeholder="Vaishali Nagar, Jaipur" /></label><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Property image</span><div className="space-y-2"><input type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/50" placeholder="https://example.com/property-image.jpg" /><input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950" /></div>{form.image && <img src={form.image} alt="Property preview" className="mt-3 h-32 w-full rounded-lg border border-white/10 bg-slate-900 object-contain p-1" />}</label><label><span className="mb-1 block text-xs text-slate-400">Type</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"><option>Apartment</option><option>Villa</option><option>House</option><option>Plot</option></select></label><label><span className="mb-1 block text-xs text-slate-400">Price *</span><input required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" placeholder="₹80 Lakh" /></label><label><span className="mb-1 block text-xs text-slate-400">Bedrooms</span><input type="number" min="0" value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" /></label><label><span className="mb-1 block text-xs text-slate-400">Area</span><input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" placeholder="1500 sq.ft" /></label><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"><option>Available</option><option>Pending</option><option>Sold</option></select></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">Cancel</button><button disabled={saving} type="submit" className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">{saving ? "Saving..." : editingPropertyId ? "Update property" : "Save property"}</button></div></form></div>}
        </main>
    );
}