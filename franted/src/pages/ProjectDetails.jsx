import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createLead, getProject } from "../services/api";
import {
    ArrowLeft,
    MapPin,
    CheckCircle2,
    Phone,
    CalendarDays,
} from "lucide-react";

const projectData = {
    1: {
        title: "Skyline Residences",
        location: "Bangalore, Karnataka",
        price: "₹ 1.2 Cr",
        possession: "2026",
        image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    },
    2: {
        title: "The Grand Avenue",
        location: "Mumbai, Maharashtra",
        price: "₹ 2.5 Cr",
        possession: "2027",
        image:
            "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=85",
    },
    3: {
        title: "Green Valley Township",
        location: "Pune, Maharashtra",
        price: "₹ 80 Lakh",
        possession: "2025",
        image:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85",
    },
};

export default function ProjectDetails() {
    const { id } = useParams();
    const [remoteProject, setRemoteProject] = useState(null);
    const project = remoteProject || projectData[id] || projectData[1];
    const [form, setForm] = useState({ name: "", phone: "" });
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id || !id.match(/^[a-f0-9]{24}$/i)) return;

        getProject(id)
            .then((item) => setRemoteProject({
                ...item,
                title: item.name,
                status: item.status,
                image: item.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
            }))
            .catch(() => setRemoteProject(null));
    }, [id]);

    const amenities = [
        "Club House",
        "Swimming Pool",
        "Modern Gym",
        "Children's Play Area",
        "24x7 Security",
        "Landscaped Garden",
        "Covered Parking",
        "Power Backup",
    ];

    const handleRequest = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            await createLead({
                name: form.name,
                phone: form.phone,
                source: "Project details",
                message: `Request for details: ${project.title}`,
            });
            setSubmitted(true);
            setForm({ name: "", phone: "" });
        } catch (requestError) {
            setError(requestError.message || "Unable to send request");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020b1c] pt-[72px] text-white">
            <Navbar />
            <main>
                {/* Hero */}
                <section className="relative h-[480px] overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020b1c] via-[#020b1c]/40 to-black/20" />

                    <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-12">
                        <div>
                            <Link
                                to="/projects"
                                className="mb-6 flex items-center gap-2 text-sm text-gray-300"
                            >
                                <ArrowLeft size={17} />
                                All Projects
                            </Link>

                            <p className="mb-3 text-sm uppercase tracking-[4px] text-purple-400">
                                Premium Development
                            </p>

                            <h1 className="text-4xl font-bold md:text-6xl">
                                {project.title}
                            </h1>

                            <p className="mt-4 flex items-center gap-2 text-gray-300">
                                <MapPin size={18} className="text-purple-400" />
                                {project.location}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_350px]">
                    <section>
                        {/* Overview */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Stat title="Starting From" value={project.price} />
                            <Stat title="Possession" value={project.possession} />
                            <Stat title="Project Status" value="Ongoing" />
                        </div>

                        <h2 className="mt-10 text-3xl font-bold">Project Overview</h2>

                        <p className="mt-4 leading-8 text-gray-400">
                            {project.title} is a thoughtfully planned premium development
                            designed for families looking for comfort, connectivity and a
                            modern lifestyle. Every detail has been planned to provide a
                            better living experience.
                        </p>

                        {/* Amenities */}
                        <h2 className="mt-10 text-3xl font-bold">Amenities</h2>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {amenities.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                                >
                                    <CheckCircle2 size={18} className="text-purple-400" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Enquiry */}
                    <aside className="h-fit rounded-3xl border border-purple-500/30 bg-[#07152d] p-6 lg:sticky lg:top-6">
                        <h3 className="text-2xl font-bold">Interested?</h3>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Get project details, pricing and availability from our expert.
                        </p>

                        {submitted && (
                            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                                Request sent successfully. Our team will contact you soon.
                            </div>
                        )}

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRequest}>
                            <input
                                required
                                value={form.name}
                                onChange={(event) => setForm({ ...form, name: event.target.value })}
                                placeholder="Your Name"
                                className="mt-6 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-purple-500"
                            />

                            <input
                                required
                                value={form.phone}
                                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                                placeholder="Phone Number"
                                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-purple-500"
                            />

                            <button disabled={saving} type="submit" className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 py-4 font-semibold disabled:opacity-60">
                                {saving ? "Sending..." : "Request Details"}
                            </button>
                        </form>

                        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-4">
                            <CalendarDays size={17} />
                            Schedule Visit
                        </button>

                        <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                            <Phone className="text-purple-400" size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Talk to an expert</p>
                                <p className="font-semibold">+91 7023563094</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Stat({ title, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500">{title}</p>
            <p className="mt-2 font-bold">{value}</p>
        </div>
    );
}
