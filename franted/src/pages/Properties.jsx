import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import { getProperties } from "../services/api";

const fallbackImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90";

const normalizeProperty = (property) => ({
    id: property.id,
    title: property.title,
    type: property.type,
    city: property.location,
    price: property.price,
    beds: Number(property.bedrooms || 0),
    baths: Number(property.bathrooms || 2),
    area: property.area || "-",
    tag: property.status === "SOLD" ? "Sold" : "For Sale",
    image: property.image || fallbackImage,
});

export default function Properties() {
    const [searchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProperties()
            .then((items) => setProperties(items.map(normalizeProperty)))
            .catch(() => setProperties([]))
            .finally(() => setLoading(false));
    }, [searchParams]);

    const mode = searchParams.get("mode")?.toLowerCase();
    const selectedType = searchParams.get("type")?.trim();

    const filteredProperties = properties.filter((property) => {
        const propertyType = (property.type || "").toLowerCase();
        const matchesType = !selectedType || propertyType === selectedType.toLowerCase();

        if (!matchesType) return false;
        if (!mode) return true;
        if (mode === "sell") return property.tag === "For Sale" || property.tag === "Sold";
        if (mode === "rent") return property.tag === "For Rent" || property.tag === "For Sale";
        return true;
    });

    return (
        <>
            <Navbar />

            <main className="
        max-w-7xl
        mx-auto
        px-5
        lg:px-8
        pt-32
        pb-20
      ">

                <p className="
          text-[10px]
          tracking-[.18em]
          text-violet-400
        ">
                    PROPERTY MARKETPLACE
                </p>

                <h1 className="
          mt-2
          text-5xl
          font-black
        ">
                    Explore Properties
                </h1>

                <p className="
          mt-3
          text-xs
          text-slate-500
        ">
                    Find your perfect home from our
                    verified listings.
                </p>

                {loading ? (
                    <div className="mt-10 text-center text-slate-400">Loading properties...</div>
                ) : filteredProperties.length === 0 ? (
                    <div className="mt-10 text-center text-slate-400">No properties available right now.</div>
                ) : (
                    <div className="
              mt-10
              grid
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
            ">

                        {filteredProperties.map(property => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}

                    </div>
                )}

            </main>

            <Footer />
        </>
    );
}