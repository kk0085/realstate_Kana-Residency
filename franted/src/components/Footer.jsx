import {
    Link
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getSiteSettings } from "../services/api";

export default function Footer() {
    const [settings, setSettings] = useState({
        companyName: "DreamHome",
        footerText: "Find your perfect place with DreamHome.",
        contactPhone: "+91 98765 4310",
        contactEmail: "hello@dreamhome.com",
        contactAddress: "Jaipur, Rajasthan",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({
                companyName: data.companyName || "DreamHome",
                footerText: data.footerText || "Find your perfect place with DreamHome.",
                contactPhone: data.contactPhone || "+91 98765 4310",
                contactEmail: data.contactEmail || "hello@dreamhome.com",
                contactAddress: data.contactAddress || "Jaipur, Rajasthan",
            }))
            .catch(() => setSettings({
                companyName: "DreamHome",
                footerText: "Find your perfect place with DreamHome.",
                contactPhone: "+91 98765 4310",
                contactEmail: "hello@dreamhome.com",
                contactAddress: "Jaipur, Rajasthan",
            }));
    }, []);

    return (
        <footer className="
      bg-[#020612]
      border-t
      border-white/10
    ">

            <div className="
        max-w-7xl
        mx-auto
        px-5
        lg:px-8
        py-12
        grid
        sm:grid-cols-2
        lg:grid-cols-4
        gap-10
      ">

                <div>

                    <h2 className="
            text-xl
            font-black
          ">
                        🏠 {settings.companyName}
                    </h2>

                    <p className="
            mt-4
            text-xs
            text-slate-500
            leading-6
          ">
                        {settings.footerText}
                    </p>

                </div>

                <div>

                    <h3 className="text-xs font-bold">
                        Quick Links
                    </h3>

                    <div className="
            mt-4
            space-y-3
            text-xs
            text-slate-500
          ">

                        <Link className="block" to="/properties">
                            Buy
                        </Link>

                        <Link className="block" to="/properties?mode=rent">
                            Rent
                        </Link>

                        <Link className="block" to="/projects">
                            Projects
                        </Link>

                    </div>

                </div>

                <div>

                    <h3 className="text-xs font-bold">
                        Resources
                    </h3>

                    <div className="
            mt-4
            space-y-3
            text-xs
            text-slate-500
          ">
                        <p>Property Guide</p>
                        <p>FAQ</p>
                        <p>Terms & Conditions</p>
                        <p>Privacy Policy</p>
                    </div>

                </div>

                <div>

                    <h3 className="text-xs font-bold">
                        Contact Us
                    </h3>

                    <div className="
            mt-4
            space-y-3
            text-xs
            text-slate-500
          ">

                        <p>{settings.contactPhone}</p>
                        <p>{settings.contactEmail}</p>
                        <p>{settings.contactAddress}</p>

                    </div>

                </div>

            </div>

            <div className="
        border-t
        border-white/5
        py-5
        text-center
        text-[10px]
        text-slate-600
      ">
                © 2026 {settings.companyName}. All rights reserved.
            </div>

        </footer>
    );
}