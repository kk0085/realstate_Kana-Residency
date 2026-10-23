import { useEffect, useMemo, useState } from "react";
import { createProject, deleteProject, getProjects, updateProject } from "../services/api";

const emptyForm = { name: "", location: "", image: "", units: "", available: "", price: "", possession: "", status: "Upcoming" };
const statuses = ["All", "Upcoming", "Ongoing", "Completed"];

const normalizeProject = (project) => ({
    ...project,
    status: project.status.charAt(0) + project.status.slice(1).toLowerCase(),
});

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [form, setForm] = useState(emptyForm);
    const [showModal, setShowModal] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const resetForm = () => {
        setForm(emptyForm);
        setEditingProjectId(null);
    };

    const openAddProjectModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditProjectModal = (project) => {
        setForm({
            name: project.name || "",
            location: project.location || "",
            image: project.image || "",
            units: String(project.units ?? ""),
            available: String(project.available ?? ""),
            price: project.price || "",
            possession: project.possession || "",
            status: project.status || "Upcoming",
        });
        setEditingProjectId(project.id);
        setShowModal(true);
    };

    const loadProjects = () => {
        setLoading(true);
        setError("");
        getProjects().then((items) => setProjects(items.map(normalizeProject))).catch((requestError) => setError(requestError.message || "Unable to load projects")).finally(() => setLoading(false));
    };

    useEffect(loadProjects, []);

    const filteredProjects = useMemo(() => projects.filter((project) => {
        const query = search.toLowerCase();
        return (project.name.toLowerCase().includes(query) || project.location.toLowerCase().includes(query)) && (statusFilter === "All" || project.status === statusFilter);
    }), [projects, search, statusFilter]);

    const saveProject = async (event) => {
        event.preventDefault();
        if (!form.name || !form.location || !form.price) {
            setError("Name, location and price are required.");
            return;
        }
        setSaving(true);
        try {
            const payload = { ...form, units: Number(form.units || 0), available: Number(form.available || 0), status: form.status.toUpperCase() };
            const project = editingProjectId
                ? await updateProject(editingProjectId, payload)
                : await createProject(payload);

            setProjects((current) => {
                const next = current.filter((item) => item.id !== project.id);
                return [normalizeProject(project), ...next];
            });
            resetForm();
            setShowModal(false);
            setError("");
        } catch (requestError) {
            setError(requestError.message || (editingProjectId ? "Unable to update project" : "Unable to create project"));
        } finally {
            setSaving(false);
        }
    };

    const removeProject = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await deleteProject(id);
            setProjects((current) => current.filter((project) => project.id !== id));
        } catch (requestError) {
            setError(requestError.message || "Unable to delete project");
        }
    };

    const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

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

    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6 md:px-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Development portfolio</p><h1 className="mt-2 text-3xl font-semibold">Projects</h1><p className="mt-1 text-sm text-slate-400">Manage developments, units and possession timelines.</p></div><button type="button" onClick={openAddProjectModal} className="rounded-lg bg-amber-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-200">+ Add project</button></header>
                <section className="grid gap-3 sm:grid-cols-4"><Summary label="Total" value={projects.length} /><Summary label="Upcoming" value={projects.filter((item) => item.status === "Upcoming").length} color="text-cyan-300" /><Summary label="Ongoing" value={projects.filter((item) => item.status === "Ongoing").length} color="text-amber-300" /><Summary label="Completed" value={projects.filter((item) => item.status === "Completed").length} color="text-emerald-300" /></section>
                {error && <div className="flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100"><span>{error}</span><button type="button" onClick={loadProjects} className="font-semibold text-white">Retry</button></div>}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10"><div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold">All projects</h2><p className="mt-1 text-sm text-slate-400">{filteredProjects.length} matching developments</p></div><div className="flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or location" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 sm:w-72" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#0d1b2e] px-3 py-2 text-sm text-white outline-none">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-white/10 bg-black/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Project</th><th className="px-5 py-4">Units</th><th className="px-5 py-4">Available</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Possession</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{loading && <tr><td colSpan="7" className="px-5 py-12 text-center text-slate-400">Loading projects...</td></tr>}{!loading && filteredProjects.map((project) => <tr key={project.id} className="text-slate-300 hover:bg-white/[0.03]"><td className="px-5 py-4"><p className="font-medium text-white">{project.name}</p><p className="mt-1 text-xs text-slate-500">{project.location}</p></td><td className="px-5 py-4">{project.units}</td><td className="px-5 py-4 font-semibold text-white">{project.available}</td><td className="px-5 py-4">{project.price}</td><td className="px-5 py-4 text-slate-400">{project.possession || "-"}</td><td className="px-5 py-4"><span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs">{project.status}</span></td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEditProjectModal(project)} className="rounded-lg border border-cyan-400/30 px-2.5 py-1.5 text-xs text-cyan-300 hover:bg-cyan-400/10">Edit</button><button type="button" onClick={() => removeProject(project.id)} className="rounded-lg border border-red-400/20 px-2.5 py-1.5 text-xs text-red-300">Delete</button></div></td></tr>)}{!loading && filteredProjects.length === 0 && <tr><td colSpan="7" className="px-5 py-12 text-center text-slate-500">No projects match your search or filter.</td></tr>}</tbody></table></div></section>
            </div>
            {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowModal(false)}><form onSubmit={saveProject} onClick={(event) => event.stopPropagation()} className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1b2e] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">{editingProjectId ? "Update project" : "Add project"}</h2><p className="mt-1 text-sm text-slate-400">{editingProjectId ? "Update this development." : "Create a development in the database."}</p></div><button type="button" onClick={() => setShowModal(false)} className="text-2xl text-slate-400">&times;</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Name *" required value={form.name} onChange={(value) => updateField("name", value)} placeholder="Green Valley Residency" full /><Field label="Location *" required value={form.location} onChange={(value) => updateField("location", value)} placeholder="Jagatpura, Jaipur" full /><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Project image</span><div className="space-y-2"><input type="url" value={form.image} onChange={(event) => updateField("image", event.target.value)} placeholder="https://example.com/project-image.jpg" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-amber-300/50" /><input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950" /></div>{form.image && <img src={form.image} alt="Project preview" className="mt-3 h-32 w-full rounded-lg border border-white/10 bg-slate-900 object-contain p-1" />}</label><Field label="Total units" type="number" value={form.units} onChange={(value) => updateField("units", value)} /><Field label="Available units" type="number" value={form.available} onChange={(value) => updateField("available", value)} /><Field label="Price *" required value={form.price} onChange={(value) => updateField("price", value)} placeholder="₹45 Lakh onwards" /><Field label="Possession" value={form.possession} onChange={(value) => updateField("possession", value)} placeholder="Dec 2027" /><label className="sm:col-span-2"><span className="mb-1 block text-xs text-slate-400">Status</span><select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"><option>Upcoming</option><option>Ongoing</option><option>Completed</option></select></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">Cancel</button><button disabled={saving} type="submit" className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">{saving ? "Saving..." : editingProjectId ? "Update project" : "Save project"}</button></div></form></div>}
        </main>
    );
}

function Summary({ label, value, color = "text-white" }) { return <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs text-slate-400">{label}</span><strong className={`mt-1 block text-2xl ${color}`}>{value}</strong></div>; }

function Field({ label, value, onChange, placeholder, type = "text", required = false, full = false }) { return <label className={full ? "sm:col-span-2" : ""}><span className="mb-1 block text-xs text-slate-400">{label}</span><input required={required} type={type} min={type === "number" ? "0" : undefined} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-amber-300/50" /></label>; }