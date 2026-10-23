import { useEffect, useState } from "react";
import { ShieldCheck, Users, KeyRound, CheckCircle2 } from "lucide-react";
import { getSiteSettings } from "../services/api";

const items = [
    [ShieldCheck, "Verified Properties", "100% genuine listings, no false promises."],
    [Users, "Expert Guidance", "Get advice from real estate professionals."],
    [KeyRound, "Transparent Pricing", "No hidden costs, complete clarity."],
    [CheckCircle2, "End-to-End Support", "From search to possession, we're with you."]
];

export default function WhyChooseUs() {
    const [settings, setSettings] = useState({
        whyChooseTitle: "Your Trusted Real Estate Partner",
        whyChooseText: "We make property buying, selling and renting simple, transparent and stress-free.",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({
                whyChooseTitle: data.whyChooseTitle || "Your Trusted Real Estate Partner",
                whyChooseText: data.whyChooseText || "We make property buying, selling and renting simple, transparent and stress-free.",
            }))
            .catch(() => setSettings({
                whyChooseTitle: "Your Trusted Real Estate Partner",
                whyChooseText: "We make property buying, selling and renting simple, transparent and stress-free.",
            }));
    }, []);

    return (
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
                <div>
                    <p className="text-[10px] font-bold tracking-[.18em] text-violet-400">WHY CHOOSE US</p>
                    <h2 className="mt-2 text-4xl font-black">
                        {settings.whyChooseTitle.split(" ").slice(0, 2).join(" ")}
                        <br />
                        <span className="gradient-text">{settings.whyChooseTitle.split(" ").slice(2).join(" ") || "Real Estate Partner"}</span>
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">{settings.whyChooseText}</p>
                </div>

                <div className="grid gap-7 sm:grid-cols-2">
                    {items.map(([Icon, title, text]) => (
                        <div key={title} className="flex gap-4">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600/20 text-violet-400">
                                <Icon size={19} />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold">{title}</h3>
                                <p className="mt-1 text-[10px] leading-5 text-slate-500">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}