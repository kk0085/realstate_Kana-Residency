import { useEffect, useState } from "react";
import { getSiteSettings } from "../services/api";

const defaultTestimonials = [
    { name: "Priya Sharma", city: "Bangalore", text: "The team was extremely helpful and guided us at every step. Found our dream home without any hassle!" },
    { name: "Rahul Mehta", city: "Mumbai", text: "Professional, transparent and reliable. Best real estate experience we've had." },
    { name: "Neha Kapoor", city: "Pune", text: "Amazing support from start to finish. Highly recommend their services!" }
];

export default function Testimonials() {
    const [settings, setSettings] = useState({
        testimonialsTitle: "What Our Clients Say",
        testimonialsSubtitle: "Real stories from happy buyers, renters, and investors.",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({
                testimonialsTitle: data.testimonialsTitle || "What Our Clients Say",
                testimonialsSubtitle: data.testimonialsSubtitle || "Real stories from happy buyers, renters, and investors.",
            }))
            .catch(() => setSettings({
                testimonialsTitle: "What Our Clients Say",
                testimonialsSubtitle: "Real stories from happy buyers, renters, and investors.",
            }));
    }, []);

    return (
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <p className="text-[10px] font-bold tracking-[.18em] text-violet-400">TESTIMONIALS</p>
            <h2 className="mt-2 text-3xl font-black">{settings.testimonialsTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">{settings.testimonialsSubtitle}</p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
                {defaultTestimonials.map((item) => (
                    <div key={item.name} className="rounded-xl border border-white/10 bg-[#071027] p-5">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-sky-400 font-bold">
                                {item.name[0]}
                            </div>
                            <div>
                                <b className="text-xs">{item.name}</b>
                                <p className="text-[9px] text-slate-500">{item.city}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-[10px] leading-5 text-slate-400">"{item.text}"</p>
                        <div className="mt-3 text-yellow-400">★★★★★</div>
                    </div>
                ))}
            </div>
        </section>
    );
}