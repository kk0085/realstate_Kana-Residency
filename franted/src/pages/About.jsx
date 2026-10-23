import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSiteSettings } from "../services/api";
import {
    ShieldCheck,
    Users,
    Award,
    Handshake,
    ArrowRight,
} from "lucide-react";

export default function About() {
    const [settings, setSettings] = useState({
        companyName: "DreamHome",
        aboutTitle: "We Help You Find a Place You'll Love",
        aboutSubtitle: "DreamHome is a trusted real-estate partner helping families and investors discover exceptional properties.",
        aboutImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
        aboutText1: "Buying a property should feel exciting, not stressful.",
        aboutText2: "From your first property search to final possession, our team is with you at every step.",
        aboutStoryLabel: "Our Story",
        aboutStoryTitle: "Your Trusted Real Estate Partner",
        aboutCtaLabel: "Talk to Our Team",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({
                companyName: data.companyName || "DreamHome",
                aboutTitle: data.aboutTitle || "We Help You Find a Place You'll Love",
                aboutSubtitle: data.aboutSubtitle || "DreamHome is a trusted real-estate partner helping families and investors discover exceptional properties.",
                aboutImage: data.aboutImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
                aboutText1: data.aboutText1 || "Buying a property should feel exciting, not stressful.",
                aboutText2: data.aboutText2 || "From your first property search to final possession, our team is with you at every step.",
                aboutStoryLabel: data.aboutStoryLabel || "Our Story",
                aboutStoryTitle: data.aboutStoryTitle || "Your Trusted Real Estate Partner",
                aboutCtaLabel: data.aboutCtaLabel || "Talk to Our Team",
            }))
            .catch(() => setSettings({
                companyName: "DreamHome",
                aboutTitle: "We Help You Find a Place You'll Love",
                aboutSubtitle: "DreamHome is a trusted real-estate partner helping families and investors discover exceptional properties.",
                aboutImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
                aboutText1: "Buying a property should feel exciting, not stressful.",
                aboutText2: "From your first property search to final possession, our team is with you at every step.",
            }));
    }, []);

    return (
        <div className="min-h-screen bg-[#020b1c] pt-[72px] text-white">
            <Navbar />
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-20 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[4px] text-purple-400">
                        About {settings.companyName}
                    </p>

                    <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold md:text-6xl">
                        {settings.aboutTitle}
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
                        {settings.aboutSubtitle}
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-2 lg:items-center">
                <div className="overflow-hidden rounded-3xl border border-purple-500/20">
                    <img
                        src={settings.aboutImage}
                        alt={settings.companyName}
                        className="h-[400px] w-full object-cover"
                    />
                </div>

                <div>
                    <p className="text-sm uppercase tracking-widest text-purple-400">{settings.aboutStoryLabel}</p>

                    <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                        {settings.aboutStoryTitle}
                    </h2>

                    <p className="mt-5 leading-8 text-gray-400">
                        {settings.aboutText1}
                    </p>

                    <p className="mt-4 leading-8 text-gray-400">
                        {settings.aboutText2}
                    </p>

                    <Link
                        to="/contact"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 font-semibold"
                    >
                        {settings.aboutCtaLabel}
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="mx-auto max-w-7xl px-5 py-12">
                <div className="about-stats-grid grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat value="1,200+" label="Properties Listed" />
                    <Stat value="850+" label="Happy Clients" />
                    <Stat value="15+" label="Years Experience" />
                    <Stat value="25+" label="Prime Locations" />
                </div>
            </section>

            {/* Values */}
            <section className="mx-auto max-w-7xl px-5 py-16">
                <div className="text-center">
                    <p className="text-sm uppercase tracking-widest text-purple-400">
                        Why Kana Residency
                    </p>
                    <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                        Built on Trust
                    </h2>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <Value
                        icon={<ShieldCheck />}
                        title="Verified Properties"
                        text="Every listing goes through our verification process."
                    />

                    <Value
                        icon={<Users />}
                        title="Expert Guidance"
                        text="Get advice from experienced real estate professionals."
                    />

                    <Value
                        icon={<Award />}
                        title="Transparent Pricing"
                        text="Clear pricing with no hidden surprises."
                    />

                    <Value
                        icon={<Handshake />}
                        title="End-to-End Support"
                        text="From search to possession, we're with you."
                    />
                </div>
            </section>
            <Footer />
        </div>
    );
}

function Stat({ value, label }) {
    const [displayValue, setDisplayValue] = useState(0);
    const targetValue = Number(value.replace(/[^0-9]/g, ""));

    useEffect(() => {
        const duration = 900;
        const startTime = performance.now();
        let animationFrame;

        const updateValue = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(Math.floor(targetValue * easedProgress));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateValue);
            }
        };

        animationFrame = requestAnimationFrame(updateValue);

        return () => cancelAnimationFrame(animationFrame);
    }, [targetValue]);

    return (
        <div className="about-stat-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-[#07152d] p-7 text-center">
            <p className="text-3xl font-bold">{displayValue.toLocaleString()}+</p>
            <p className="mt-2 text-sm text-gray-400">{label}</p>
        </div>
    );
}

function Value({ icon, title, text }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-purple-500/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/15 text-purple-400">
                {icon}
            </div>

            <h3 className="mt-5 text-lg font-bold">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
        </div>
    );
}
