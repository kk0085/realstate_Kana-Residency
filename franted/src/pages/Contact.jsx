import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createLead, getSiteSettings } from "../services/api";
import {
    MapPin,
    Phone,
    Mail,
    Clock3,
    Send,
    CheckCircle2,
} from "lucide-react";

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        companyName: "DreamHome",
        contactPhone: "+91 98765 4310",
        contactEmail: "hello@dreamhome.com",
        contactAddress: "Mumbai, Maharashtra, India",
        contactHours: "Mon - Sat, 9:00 AM - 7:00 PM",
        contactMapUrl: "",
        contactTitle: "Let's Find Your DreamHome",
        contactSubtitle: "Have a question about a property, project or investment? Our team is ready to help.",
    });
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        interest: "Buying a Property",
        message: "",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({
                companyName: data.companyName || "DreamHome",
                contactPhone: data.contactPhone || "+91 98765 4310",
                contactEmail: data.contactEmail || "hello@dreamhome.com",
                contactAddress: data.contactAddress || "Mumbai, Maharashtra, India",
                contactHours: data.contactHours || "Mon - Sat, 9:00 AM - 7:00 PM",
                contactMapUrl: data.contactMapUrl || "",
                contactTitle: data.contactTitle || "Let's Find Your DreamHome",
                contactSubtitle: data.contactSubtitle || "Have a question about a property, project or investment? Our team is ready to help.",
            }))
            .catch(() => setSettings({
                companyName: "DreamHome",
                contactPhone: "+91 98765 4310",
                contactEmail: "hello@dreamhome.com",
                contactAddress: "Mumbai, Maharashtra, India",
                contactHours: "Mon - Sat, 9:00 AM - 7:00 PM",
            }));
    }, []);

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await createLead({
                name: form.name,
                phone: form.phone,
                email: form.email,
                source: "Contact form",
                message: `${form.interest}: ${form.message}`,
            });
            setSubmitted(true);
            setForm({ name: "", phone: "", email: "", interest: "Buying a Property", message: "" });
        } catch (requestError) {
            setError(requestError.message || "Unable to submit enquiry");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020b1c] pt-[72px] text-white">
            <Navbar />
            <div className="mx-auto max-w-7xl px-5 py-14">
                {/* Heading */}
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-[4px] text-purple-400">
                        Contact Us
                    </p>

                    <h1 className="mt-4 text-4xl font-bold md:text-6xl">
                        {settings.contactTitle}{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {settings.companyName}
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-gray-400">
                        {settings.contactSubtitle}
                    </p>
                </div>

                <div className="mt-14 grid gap-8 lg:grid-cols-[380px_1fr]">
                    {/* Contact Info */}
                    <aside className="rounded-3xl border border-purple-500/20 bg-[#07152d] p-7">
                        <h2 className="text-2xl font-bold">Get in Touch</h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Connect with our property experts for personalized assistance.
                        </p>

                        <div className="mt-8 space-y-6">
                            <ContactItem
                                icon={<Phone />}
                                title="Call Us"
                                text={settings.contactPhone}
                            />

                            <ContactItem
                                icon={<Mail />}
                                title="Email"
                                text={settings.contactEmail}
                            />

                            <ContactItem
                                icon={<MapPin />}
                                title="Visit Us"
                                text={settings.contactAddress}
                            />

                            <ContactItem
                                icon={<Clock3 />}
                                title="Working Hours"
                                text={settings.contactHours}
                            />
                        </div>

                        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#0b1e42] to-purple-950">
                                <div className="text-center">
                                    <MapPin className="mx-auto text-purple-400" size={35} />
                                    <p className="mt-2 text-sm text-gray-300">
                                        {settings.companyName} Office
                                    </p>
                                    {settings.contactMapUrl && <a href={settings.contactMapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-purple-300 hover:text-white">Open location map</a>}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Form */}
                    <section className="rounded-3xl border border-white/10 bg-[#07152d] p-7 md:p-10">
                        <h2 className="text-2xl font-bold">Send Us a Message</h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Fill in your details and our team will contact you shortly.
                        </p>

                        {submitted && (
                            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
                                <CheckCircle2 size={20} />
                                Thank you! Your enquiry has been submitted.
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-7">
                            <div className="grid gap-5 md:grid-cols-2">
                                <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" />
                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="mt-5">
                                <Input
                                    label="Email Address"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="mt-5">
                                <label className="mb-2 block text-sm text-gray-300">
                                    I'm Interested In
                                </label>

                                <select name="interest" value={form.interest} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-[#020b1c] px-4 py-3 text-gray-300 outline-none focus:border-purple-500">
                                    <option>Buying a Property</option>
                                    <option>Renting a Property</option>
                                    <option>Selling a Property</option>
                                    <option>New Projects</option>
                                    <option>Investment</option>
                                </select>
                            </div>

                            <div className="mt-5">
                                <label className="mb-2 block text-sm text-gray-300">
                                    Message
                                </label>

                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Tell us what you're looking for..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-[#020b1c] px-4 py-3 text-gray-300 outline-none placeholder:text-gray-600 focus:border-purple-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 py-4 font-semibold shadow-lg shadow-purple-900/20 transition hover:opacity-90"
                            >
                                <Send size={18} />
                                {saving ? "Sending..." : "Send Enquiry"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function Input({ label, name, value, onChange, placeholder, type = "text" }) {
    return (
        <div>
            <label className="mb-2 block text-sm text-gray-300">{label}</label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-[#020b1c] px-4 py-3 text-gray-300 outline-none placeholder:text-gray-600 focus:border-purple-500"
            />
        </div>
    );
}

function ContactItem({ icon, title, text }) {
    return (
        <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600/15 text-purple-400">
                {icon}
            </div>

            <div>
                <p className="text-xs text-gray-500">{title}</p>
                <p className="mt-1 text-sm font-medium text-gray-200">{text}</p>
            </div>
        </div>
    );
}
