import {
    Building2,
    Home,
    LandPlot,
    Store,
    Crown
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSiteSettings } from "../services/api";

const types = [
    [Building2, "Apartments", "Modern living spaces", "Apartment"],
    [Home, "Villas", "Luxury & privacy", "Villa"],
    [LandPlot, "Plots", "Build your future", "Plot"],
    [Store, "Commercial", "Grow your business", "Commercial"],
    [Crown, "Luxury Homes", "For a better tomorrow", "Villa"]
];

export default function PropertyTypes() {
    const [settings, setSettings] = useState({
        propertyTypesLabel: "EXPLORE BY PROPERTY TYPE",
        propertyTypesTitle: "Find What Fits Your Lifestyle",
    });

    useEffect(() => {
        getSiteSettings().then(setSettings).catch(() => { });
    }, []);

    return (
        <section className="
      border-y
      border-white/5
      bg-white/[.015]
    ">

            <div className="
        max-w-7xl
        mx-auto
        px-5
        lg:px-8
        py-16
      ">

                <p className="
          text-[10px]
          tracking-[.18em]
          text-violet-400
          font-bold
        ">
                    {settings.propertyTypesLabel}
                </p>

                <h2 className="
          mt-2
          text-3xl
          font-black
        ">
                    {settings.propertyTypesTitle}
                </h2>

                <div className="
          mt-8
          grid
          grid-cols-2
          md:grid-cols-5
          gap-3
        ">

                    {types.map(
                        ([Icon, title, subtitle, type]) => (

                            <Link
                                key={title}
                                to={`/properties?type=${type}`}
                                className="
                  rounded-xl
                  border
                  border-violet-500/30
                  bg-[#060c20]
                  p-6
                  text-center
                  hover:bg-violet-500/10
                  transition
                "
                            >

                                <Icon
                                    size={28}
                                    className="
                    mx-auto
                    text-violet-400
                  "
                                />

                                <h3 className="
                  mt-4
                  text-xs
                  font-bold
                ">
                                    {title}
                                </h3>

                                <p className="
                  mt-1
                  text-[9px]
                  text-slate-500
                ">
                                    {subtitle}
                                </p>

                            </Link>

                        )
                    )}

                </div>

            </div>

        </section>
    );
}