import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProjects } from "../services/api";

const fallbackImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getProjects()
            .then(setProjects)
            .catch((requestError) => setError(requestError.message || "Unable to load projects"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#020b1c] pt-[72px] text-white">
            <Navbar />
            <div className="mx-auto max-w-7xl px-5 py-12">
                <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#0b1633] to-[#071127] px-6 py-14 md:px-12">
                    <p className="text-sm font-semibold uppercase tracking-[4px] text-purple-400">Featured Projects</p>
                    <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">Discover Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Dream Project</span></h1>
                    <p className="mt-5 max-w-2xl leading-7 text-gray-400">Explore projects added by our team with current pricing, availability and possession details.</p>
                </section>

                {error && <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
                {loading && <div className="mt-10 text-center text-gray-400">Loading projects...</div>}
                {!loading && !error && projects.length === 0 && <div className="mt-10 text-center text-gray-400">No projects available right now.</div>}

                <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <article key={project.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#07152d] transition hover:-translate-y-1 hover:border-purple-500/50">
                            <div className="relative">
                                <img src={project.image || fallbackImage} alt={project.name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                                <span className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold">{project.status || "Project"}</span>
                            </div>
                            <div className="p-5"><h2 className="text-xl font-bold">{project.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-gray-400"><MapPin size={15} className="text-purple-400" />{project.location}</p><div className="my-5 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center"><div><p className="text-sm font-bold">{project.price}</p><p className="text-[11px] text-gray-500">Starting</p></div><div><p className="text-sm font-bold">{project.possession || "-"}</p><p className="text-[11px] text-gray-500">Possession</p></div><div><p className="text-sm font-bold">{project.units}</p><p className="text-[11px] text-gray-500">Units</p></div></div><Link to={`/projects/${project.id}`} className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/50 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-600 hover:text-white">Explore Project<ArrowRight size={17} /></Link></div>
                        </article>
                    ))}
                </section>
            </div>
            <Footer />
        </div>
    );
}