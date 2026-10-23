import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import { getSiteSettings } from "../services/api";

export default function Hero() {
    const [settings, setSettings] = useState({
        heroBadge: "Trusted Real Estate Partner",
        heroTitle: "Find a Place You'll Love to Call Home.",
        heroSubtitle: "Discover premium properties in the best locations. Your dream home is just a search away.",
        heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
    });

    useEffect(() => {
        getSiteSettings()
            .then((data) => setSettings({
                heroBadge: data.heroBadge || "Trusted Real Estate Partner",
                heroTitle: data.heroTitle || "Find a Place You'll Love to Call Home.",
                heroSubtitle: data.heroSubtitle || "Discover premium properties in the best locations. Your dream home is just a search away.",
                heroImage: data.heroImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
            }))
            .catch(() => setSettings({
                heroBadge: "Trusted Real Estate Partner",
                heroTitle: "Find a Place You'll Love to Call Home.",
                heroSubtitle: "Discover premium properties in the best locations. Your dream home is just a search away.",
                heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
            }));
    }, []);

    return (
        <section className="
      relative
      min-h-[720px]
      pt-20
      overflow-hidden
    ">

            <img
                src={settings.heroImage}
                alt="Luxury property"
                className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
            />

            <div className="
        absolute
        inset-0
        hero-overlay
      " />

            <div className="
        relative
        max-w-7xl
        mx-auto
        px-5
        lg:px-8
        pt-28
      ">

                <span className="
          glass
          inline-flex
          px-4
          py-2
          rounded-full
          text-[9px]
          font-bold
        ">
                    🛡 {settings.heroBadge}
                </span>

                <h1 className="
          mt-6
          text-5xl
          sm:text-6xl
          lg:text-[68px]
          font-black
          leading-[1.02]
          max-w-3xl
        ">

                    {settings.heroTitle}

                </h1>

                <p className="
          mt-5
          text-sm
          leading-6
          text-slate-300
          max-w-md
        ">
                    {settings.heroSubtitle}
                </p>

                <div className="
          mt-9
          max-w-5xl
        ">
                    <SearchBox />
                </div>

            </div>

        </section>
    );
}