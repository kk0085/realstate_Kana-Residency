import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSiteSettings } from "../services/api";

export default function CTA() {
    const [settings, setSettings] = useState({
        ctaTitle: "Your Next Address Starts Here.",
        ctaSubtitle: "Explore the best properties and make your move today.",
        ctaPrimaryLabel: "Browse Properties",
        ctaSecondaryLabel: "Talk to an Expert",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({
                ctaTitle: data.ctaTitle || "Your Next Address Starts Here.",
                ctaSubtitle: data.ctaSubtitle || "Explore the best properties and make your move today.",
                ctaPrimaryLabel: data.ctaPrimaryLabel || "Browse Properties",
                ctaSecondaryLabel: data.ctaSecondaryLabel || "Talk to an Expert",
            }))
            .catch(() => setSettings({
                ctaTitle: "Your Next Address Starts Here.",
                ctaSubtitle: "Explore the best properties and make your move today.",
                ctaPrimaryLabel: "Browse Properties",
                ctaSecondaryLabel: "Talk to an Expert",
            }));
    }, []);

    return (
        <section className="bg-gradient-to-r from-violet-700 via-violet-600 to-sky-600">
            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-9 md:flex-row md:items-center lg:px-8">
                <div>
                    <p className="text-[9px] font-bold tracking-[.2em]">READY TO TAKE THE NEXT STEP?</p>
                    <h2 className="mt-1 text-2xl font-black">{settings.ctaTitle}</h2>
                    <p className="text-[10px] text-white/70">{settings.ctaSubtitle}</p>
                </div>

                <div className="flex gap-2">
                    <Link to="/properties" className="rounded-full bg-white px-5 py-3 text-[10px] font-bold text-violet-700">
                        {settings.ctaPrimaryLabel} →
                    </Link>
                    <Link to="/contact" className="rounded-full border border-white/30 px-5 py-3 text-[10px] font-bold">
                        {settings.ctaSecondaryLabel} →
                    </Link>
                </div>
            </div>
        </section>
    );
}