import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSiteSettings, updateSiteSettings } from "../services/api";

const emptyForm = {
    companyName: "DreamHome",
    logo: "",
    heroBadge: "Trusted Real Estate Partner",
    heroTitle: "Find a Place You'll Love to Call Home.",
    heroSubtitle: "Discover premium properties in the best locations. Your dream home is just a search away.",
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
    aboutTitle: "We Help You Find a Place You'll Love",
    aboutSubtitle: "DreamHome is a trusted real-estate partner helping families and investors discover exceptional properties.",
    aboutImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
    aboutText1: "Buying a property should feel exciting, not stressful.",
    aboutText2: "From your first property search to final possession, our team is with you at every step.",
    contactPhone: "+91 98765 4310",
    contactEmail: "hello@dreamhome.com",
    contactAddress: "Jaipur, Rajasthan, India",
    contactHours: "Mon - Sat, 9:00 AM - 7:00 PM",
    contactMapUrl: "",
    ctaTitle: "Your Next Address Starts Here.",
    ctaSubtitle: "Explore the best properties and make your move today.",
    ctaPrimaryLabel: "Browse Properties",
    ctaSecondaryLabel: "Talk to an Expert",
    whyChooseTitle: "Your Trusted Real Estate Partner",
    whyChooseText: "We make property buying, selling and renting simple, transparent and stress-free.",
    testimonialsTitle: "What Our Clients Say",
    testimonialsSubtitle: "Real stories from happy buyers, renters, and investors.",
    footerText: "Find your perfect place with DreamHome.",
    featuredPropertiesLabel: "FEATURED PROPERTIES",
    featuredPropertiesTitle: "Handpicked Homes for You",
    featuredPropertiesSubtitle: "Explore our most popular and premium properties.",
    propertyTypesLabel: "EXPLORE BY PROPERTY TYPE",
    propertyTypesTitle: "Find What Fits Your Lifestyle",
    featuredProjectsLabel: "FEATURED PROJECTS",
    featuredProjectsTitle: "Top Residential & Commercial Projects",
    aboutStoryLabel: "Our Story",
    aboutStoryTitle: "Your Trusted Real Estate Partner",
    aboutCtaLabel: "Talk to Our Team",
    contactTitle: "Let's Find Your DreamHome",
    contactSubtitle: "Have a question about a property, project or investment? Our team is ready to help.",
};

export default function Settings() {
    const navigate = useNavigate();
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getSiteSettings()
            .then((settings) => setForm({ ...emptyForm, ...settings }))
            .catch((requestError) => setError(requestError.message || "Unable to load settings"))
            .finally(() => setLoading(false));
    }, []);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleImageUpload = (field) => async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((current) => ({ ...current, [field]: reader.result }));
            setError("");
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            await updateSiteSettings(form);
            navigate("/admin");
        } catch (requestError) {
            setError(requestError.message || "Unable to save website settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6 md:px-10">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Website settings</p>
                        <h1 className="mt-2 text-3xl font-semibold">Edit site content</h1>
                    </div>
                    <button type="button" onClick={() => navigate("/admin")} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white">Back to dashboard</button>
                </header>

                {error && <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</div>}

                {loading ? <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-slate-400">Loading site settings...</div> : (
                    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10">
                        <section className="rounded-2xl border border-violet-500/20 bg-slate-950/40 p-4">
                            <h2 className="mb-4 text-lg font-semibold text-violet-200">Brand & homepage</h2>
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="Company name" value={form.companyName} onChange={(value) => updateField("companyName", value)} />
                                <ImageField label="Logo image" value={form.logo} onChange={(value) => updateField("logo", value)} onUpload={handleImageUpload("logo")} />
                                <Field label="Hero badge" value={form.heroBadge} onChange={(value) => updateField("heroBadge", value)} />
                                <Field label="Footer text" value={form.footerText} onChange={(value) => updateField("footerText", value)} />
                                <Field label="Hero title" value={form.heroTitle} onChange={(value) => updateField("heroTitle", value)} className="md:col-span-2" />
                                <TextArea label="Hero subtitle" value={form.heroSubtitle} onChange={(value) => updateField("heroSubtitle", value)} className="md:col-span-2" />
                                <ImageField label="Hero image" value={form.heroImage} onChange={(value) => updateField("heroImage", value)} onUpload={handleImageUpload("heroImage")} />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-4">
                            <h2 className="mb-4 text-lg font-semibold text-cyan-200">About & contact</h2>
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="About title" value={form.aboutTitle} onChange={(value) => updateField("aboutTitle", value)} className="md:col-span-2" />
                                <TextArea label="About subtitle" value={form.aboutSubtitle} onChange={(value) => updateField("aboutSubtitle", value)} className="md:col-span-2" />
                                <TextArea label="About text 1" value={form.aboutText1} onChange={(value) => updateField("aboutText1", value)} className="md:col-span-2" />
                                <TextArea label="About text 2" value={form.aboutText2} onChange={(value) => updateField("aboutText2", value)} className="md:col-span-2" />
                                <ImageField label="About image" value={form.aboutImage} onChange={(value) => updateField("aboutImage", value)} onUpload={handleImageUpload("aboutImage")} />
                                <Field label="Contact phone" value={form.contactPhone} onChange={(value) => updateField("contactPhone", value)} />
                                <Field label="Contact email" value={form.contactEmail} onChange={(value) => updateField("contactEmail", value)} />
                                <Field label="Contact address" value={form.contactAddress} onChange={(value) => updateField("contactAddress", value)} className="md:col-span-2" />
                                <Field label="Contact hours" value={form.contactHours} onChange={(value) => updateField("contactHours", value)} className="md:col-span-2" />
                                <Field label="Google Maps location URL" value={form.contactMapUrl} onChange={(value) => updateField("contactMapUrl", value)} className="md:col-span-2" />
                                <Field label="About story label" value={form.aboutStoryLabel} onChange={(value) => updateField("aboutStoryLabel", value)} />
                                <Field label="About story title" value={form.aboutStoryTitle} onChange={(value) => updateField("aboutStoryTitle", value)} />
                                <Field label="About button label" value={form.aboutCtaLabel} onChange={(value) => updateField("aboutCtaLabel", value)} />
                                <Field label="Contact page title" value={form.contactTitle} onChange={(value) => updateField("contactTitle", value)} />
                                <TextArea label="Contact page subtitle" value={form.contactSubtitle} onChange={(value) => updateField("contactSubtitle", value)} className="md:col-span-2" />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-emerald-500/20 bg-slate-950/40 p-4">
                            <h2 className="mb-4 text-lg font-semibold text-emerald-200">CTA & trust content</h2>
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="CTA title" value={form.ctaTitle} onChange={(value) => updateField("ctaTitle", value)} className="md:col-span-2" />
                                <TextArea label="CTA subtitle" value={form.ctaSubtitle} onChange={(value) => updateField("ctaSubtitle", value)} className="md:col-span-2" />
                                <Field label="Primary CTA label" value={form.ctaPrimaryLabel} onChange={(value) => updateField("ctaPrimaryLabel", value)} />
                                <Field label="Secondary CTA label" value={form.ctaSecondaryLabel} onChange={(value) => updateField("ctaSecondaryLabel", value)} />
                                <Field label="Why choose title" value={form.whyChooseTitle} onChange={(value) => updateField("whyChooseTitle", value)} className="md:col-span-2" />
                                <TextArea label="Why choose text" value={form.whyChooseText} onChange={(value) => updateField("whyChooseText", value)} className="md:col-span-2" />
                                <Field label="Testimonials title" value={form.testimonialsTitle} onChange={(value) => updateField("testimonialsTitle", value)} className="md:col-span-2" />
                                <TextArea label="Testimonials subtitle" value={form.testimonialsSubtitle} onChange={(value) => updateField("testimonialsSubtitle", value)} className="md:col-span-2" />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-amber-500/20 bg-slate-950/40 p-4">
                            <h2 className="mb-4 text-lg font-semibold text-amber-200">Homepage sections</h2>
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="Featured properties label" value={form.featuredPropertiesLabel} onChange={(value) => updateField("featuredPropertiesLabel", value)} />
                                <Field label="Featured properties title" value={form.featuredPropertiesTitle} onChange={(value) => updateField("featuredPropertiesTitle", value)} />
                                <TextArea label="Featured properties subtitle" value={form.featuredPropertiesSubtitle} onChange={(value) => updateField("featuredPropertiesSubtitle", value)} className="md:col-span-2" />
                                <Field label="Property types label" value={form.propertyTypesLabel} onChange={(value) => updateField("propertyTypesLabel", value)} />
                                <Field label="Property types title" value={form.propertyTypesTitle} onChange={(value) => updateField("propertyTypesTitle", value)} />
                                <Field label="Featured projects label" value={form.featuredProjectsLabel} onChange={(value) => updateField("featuredProjectsLabel", value)} />
                                <Field label="Featured projects title" value={form.featuredProjectsTitle} onChange={(value) => updateField("featuredProjectsTitle", value)} />
                            </div>
                        </section>

                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="rounded-lg bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-violet-900/30 disabled:opacity-60">{saving ? "Saving..." : "Save website settings"}</button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}

function Field({ label, value, onChange, className = "" }) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1 block text-xs text-slate-400">{label}</span>
            <input value={value || ""} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50" />
        </label>
    );
}

function TextArea({ label, value, onChange, className = "" }) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1 block text-xs text-slate-400">{label}</span>
            <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} rows="3" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50" />
        </label>
    );
}

function ImageField({ label, value, onChange, onUpload }) {
    return (
        <label className="block md:col-span-1">
            <span className="mb-1 block text-xs text-slate-400">{label}</span>
            <div className="space-y-2">
                <input value={value || ""} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50" placeholder="https://example.com/image.jpg" />
                <input type="file" accept="image/*" onChange={onUpload} className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-300 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950" />
            </div>
            {value && <img src={value} alt={label} className="mt-3 h-28 w-full rounded-lg border border-white/10 bg-slate-900 object-cover" />}
        </label>
    );
}
