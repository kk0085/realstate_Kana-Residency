import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createVisit, getProperty } from "../services/api";
import {
    ArrowLeft,
    BedDouble,
    Bath,
    Maximize,
    MapPin,
    Heart,
    Share2,
    Phone,
    CalendarDays,
    CheckCircle2,
} from "lucide-react";

const fallbackImage =
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85";

const formatStatus = (status) => {
    if (!status) return "For Sale";

    const labels = {
        AVAILABLE: "For Sale",
        SOLD: "Sold",
        RENT: "For Rent",
        RENTED: "Rented",
    };

    return labels[status] || status;
};

export default function PropertyDetails() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [showVisitForm, setShowVisitForm] = useState(false);
    const [visitForm, setVisitForm] = useState({
        customer: "",
        phone: "",
        date: "",
        time: "",
    });
    const [visitSubmitted, setVisitSubmitted] = useState(false);
    const [visitError, setVisitError] = useState("");
    const [savingVisit, setSavingVisit] = useState(false);

    useEffect(() => {
        let active = true;

        setLoading(true);
        setLoadError("");

        getProperty(id)
            .then((item) => {
                if (!active) return;

                setProperty({
                    ...item,
                    type: formatStatus(item.status),
                    location: item.location || "-",
                    price: item.price || "-",
                    beds: Number(item.bedrooms || 0),
                    baths: Number(item.bathrooms || 0),
                    area: item.area || "-",
                    description: item.description || "Details for this property are not available yet.",
                    image: item.image || fallbackImage,
                    features: Array.isArray(item.features) ? item.features : [],
                });
            })
            .catch((error) => {
                if (!active) return;

                setProperty(null);
                setLoadError(error.message || "Unable to load property details");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const scheduleVisit = async (event) => {
        event.preventDefault();
        setSavingVisit(true);
        setVisitError("");

        try {
            await createVisit({
                ...visitForm,
                status: "SCHEDULED",
                propertyId: property.id,
                notes: `${property.title} - ${property.location}`,
            });
            setVisitSubmitted(true);
            setVisitForm({ customer: "", phone: "", date: "", time: "" });
        } catch (requestError) {
            setVisitError(requestError.message || "Unable to schedule visit");
        } finally {
            setSavingVisit(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020b1c] pt-[72px] text-white">
                <Navbar />

                <main className="mx-auto max-w-7xl px-5 py-8">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
                        Loading property details...
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-[#020b1c] pt-[72px] text-white">
                <Navbar />

                <main className="mx-auto max-w-7xl px-5 py-8">
                    <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">
                        <h1 className="text-2xl font-bold">Property not found</h1>

                        <p className="mt-2 text-sm text-red-300">
                            {loadError}
                        </p>

                        <Link
                            to="/properties"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 font-semibold"
                        >
                            <ArrowLeft size={17} />
                            Back to Properties
                        </Link>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020b1c] pt-[72px] text-white">
            <Navbar />
            {/* Header */}
            <header className="border-b border-white/10 bg-[#020b1c]/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-500">
                            🏠
                        </div>

                        <div>
                            <h1 className="text-xl font-bold">DreamHome</h1>
                            <p className="text-[10px] text-gray-400">
                                Find Your Perfect Place
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/properties"
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
                    >
                        <ArrowLeft size={17} />
                        Back to Properties
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-8">
                {/* Image */}
                <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-white/5">
                    <img
                        src={property.image}
                        alt={property.title}
                        loading="lazy"
                        onError={(event) => {
                            if (event.target.src !== fallbackImage) {
                                event.target.src = fallbackImage;
                            }
                        }}
                        className="h-[320px] w-full object-cover md:h-[720px]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020b1c]/80 via-transparent to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-sm font-semibold">
                        {property.type}
                    </div>

                    <div className="absolute right-5 top-5 flex gap-2">
                        <button className="rounded-full bg-black/50 p-3 backdrop-blur-md hover:bg-black/70">
                            <Heart size={19} />
                        </button>

                        <button className="rounded-full bg-black/50 p-3 backdrop-blur-md hover:bg-black/70">
                            <Share2 size={19} />
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Content */}
                    <section className="pt-8">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-400">
                            Premium Property
                        </p>

                        <h2 className="text-3xl font-bold md:text-5xl">
                            {property.title}
                        </h2>

                        <div className="mt-4 flex items-center gap-2 text-gray-400">
                            <MapPin size={18} className="text-purple-400" />
                            {property.location}
                        </div>

                        <div className="my-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {property.beds > 0 && (
                                <Info icon={<BedDouble />} label="Bedrooms" value={property.beds} />
                            )}

                            {property.baths > 0 && (
                                <Info icon={<Bath />} label="Bathrooms" value={property.baths} />
                            )}

                            <Info icon={<Maximize />} label="Area" value={property.area} />
                        </div>

                        <h3 className="text-2xl font-bold">About This Property</h3>

                        <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                            {property.description}
                        </p>

                        {property.features.length > 0 && (
                            <>
                                <h3 className="mt-10 text-2xl font-bold">Property Features</h3>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    {property.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                                        >
                                            <CheckCircle2 className="text-purple-400" size={19} />
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>

                    {/* Contact Card */}
                    <aside className="mt-8 h-fit rounded-3xl border border-purple-500/30 bg-[#07152d] p-6 lg:sticky lg:top-5">
                        <p className="text-sm text-gray-400">Property Price</p>

                        <h3 className="mt-2 text-3xl font-bold">{property.price}</h3>

                        <div className="my-6 h-px bg-white/10" />

                        <h4 className="font-semibold">Interested in this property?</h4>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Talk with our property expert and schedule a private visit.
                        </p>

                        <button type="button" onClick={() => { setShowVisitForm(true); setVisitSubmitted(false); setVisitError(""); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 py-4 font-semibold shadow-lg shadow-purple-900/30 hover:opacity-90">
                            <CalendarDays size={18} />
                            Schedule a Visit
                        </button>

                        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/40 py-4 font-semibold hover:bg-purple-500/10">
                            <Phone size={18} />
                            Contact Agent
                        </button>

                        <p className="mt-5 text-center text-xs text-gray-500">
                            Our team usually responds within a few minutes.
                        </p>
                    </aside>
                </div>
            </main>
            <Footer />

            {showVisitForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowVisitForm(false)}>
                    <form onSubmit={scheduleVisit} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#07152d] p-6 shadow-2xl">
                        <div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">Schedule a visit</h2><p className="mt-1 text-sm text-gray-400">{property.title}</p></div><button type="button" onClick={() => setShowVisitForm(false)} className="text-2xl text-gray-400 hover:text-white">&times;</button></div>
                        {visitSubmitted && <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">Visit request sent successfully.</div>}
                        {visitError && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{visitError}</div>}
                        <input required value={visitForm.customer} onChange={(event) => setVisitForm({ ...visitForm, customer: event.target.value })} placeholder="Your name" className="mt-5 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-purple-500" />
                        <input required value={visitForm.phone} onChange={(event) => setVisitForm({ ...visitForm, phone: event.target.value })} placeholder="Phone number" className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-purple-500" />
                        <div className="mt-3 grid grid-cols-2 gap-3"><input required type="date" value={visitForm.date} onChange={(event) => setVisitForm({ ...visitForm, date: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-gray-300 outline-none focus:border-purple-500" /><input required type="time" value={visitForm.time} onChange={(event) => setVisitForm({ ...visitForm, time: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-gray-300 outline-none focus:border-purple-500" /></div>
                        <button disabled={savingVisit} type="submit" className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 py-3 font-semibold disabled:opacity-60">{savingVisit ? "Sending..." : "Confirm visit request"}</button>
                    </form>
                </div>
            )}
        </div>
    );
}

function Info({ icon, label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 text-purple-400">{icon}</div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}
