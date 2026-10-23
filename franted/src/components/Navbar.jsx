import {
    ArrowUpRight,
    Menu,
    X,
} from "lucide-react";

import {
    Link,
    NavLink
} from "react-router-dom";

import { useEffect, useState } from "react";
import { getSiteSettings } from "../services/api";

export default function Navbar() {

    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState({
        companyName: "DreamHome",
        logo: "",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({ companyName: data.companyName || "DreamHome", logo: data.logo || "" }))
            .catch(() => setSettings({ companyName: "DreamHome", logo: "" }));
    }, []);

    const links = [
        ["Home", "/"],
        ["About", "/about"],
        ["Projects", "/projects"],
        ["Buy", "/properties"],
        ["Sell", "/properties?mode=sell"],
        ["Rent", "/properties?mode=rent"],
        ["Contact", "/contact"]
    ];

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#030817]/90 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="navbar-shell mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">

                <div className="navbar-logo h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-blue-950/30 transition group-hover:border-cyan-300/50">
                    <img
                        src={settings.logo || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80"}
                        alt={settings.companyName || "Home property logo"}
                        className="h-full w-full object-cover"
                    />
                </div>




                <nav className="navbar-desktop-nav hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 lg:flex">
                    {links.map(([name, url]) => (
                        <NavLink
                            key={name}
                            to={url}
                            end={url === "/"}
                            className={({ isActive }) =>
                                `rounded-full px-4 py-2 text-xs font-semibold transition ${isActive
                                    ? "border border-indigo-400/30 bg-gradient-to-r from-[#241044] via-[#172d63] to-[#07152d] text-white shadow-lg shadow-indigo-950/30"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            {name}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        to="/contact"
                        className="navbar-cta hidden items-center gap-2 rounded-full border border-indigo-400/30 bg-gradient-to-r from-[#241044] via-[#172d63] to-[#07152d] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:shadow-cyan-950/30 sm:flex"
                    >
                        Book a Consultation
                        <ArrowUpRight size={15} />
                    </Link>

                    <button
                        type="button"
                        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                        onClick={() => setOpen(!open)}
                        className="navbar-menu-button rounded-xl border border-white/10 p-2 text-slate-200 transition hover:bg-white/10 lg:hidden"
                    >
                        {open ? <X size={21} /> : <Menu size={21} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="navbar-mobile-panel border-t border-white/10 bg-[#050a1c] px-5 py-4 lg:hidden">
                    <nav className="mx-auto max-w-7xl">
                        {links.map(([name, url]) => (
                            <NavLink
                                key={name}
                                to={url}
                                end={url === "/"}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `block border-b border-white/5 py-3 text-sm font-medium ${isActive
                                        ? "rounded-xl border border-indigo-400/30 bg-gradient-to-r from-[#241044] via-[#172d63] to-[#07152d] px-4 text-white"
                                        : "text-slate-300"
                                    }`
                                }
                            >
                                {name}
                            </NavLink>
                        ))}
                        <Link
                            to="/contact"
                            onClick={() => setOpen(false)}
                            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-indigo-400/30 bg-gradient-to-r from-[#241044] via-[#172d63] to-[#07152d] px-4 py-3 text-sm font-bold shadow-lg shadow-indigo-950/30"
                        >
                            Book a Consultation
                            <ArrowUpRight size={16} />
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}