import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import PropertyTypes from "../components/PropertyTypes";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import ProjectCard from "../components/ProjectCard";
import { getProjects, getProperties, getSiteSettings } from "../services/api";

const fallbackImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=90";

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

const normalizeProject = (project) => ({
    id: project.id,
    name: project.name,
    city: project.location,
    price: project.price,
    possession: project.possession || "-",
    image: project.image || fallbackImage,
    status: project.status || "Project",
});

export default function Home() {
    const [properties, setProperties] = useState([]);
    const [projects, setProjects] = useState([]);
    const [settings, setSettings] = useState({
        featuredPropertiesLabel: "FEATURED PROPERTIES",
        featuredPropertiesTitle: "Handpicked Homes for You",
        featuredPropertiesSubtitle: "Explore our most popular and premium properties.",
        featuredProjectsLabel: "FEATURED PROJECTS",
        featuredProjectsTitle: "Top Residential & Commercial Projects",
    });

    useEffect(() => {
        getSiteSettings().then(setSettings).catch(() => { });

        getProperties()
            .then((items) => setProperties(items.slice(0, 4).map(normalizeProperty)))
            .catch(() => setProperties([]));

        getProjects()
            .then((items) => setProjects(items.slice(0, 3).map(normalizeProject)))
            .catch(() => setProjects([]));
    }, []);

    return (
        <>

            <Navbar />

            <main>

                <Hero />

                <Stats />

                {/* Properties */}

                <section className="
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
                        {settings.featuredPropertiesLabel}
                    </p>

                    <h2 className="
            mt-2
            text-3xl
            font-black
          ">
                        {settings.featuredPropertiesTitle}
                    </h2>

                    <p className="
            mt-2
            text-xs
            text-slate-500
          ">
                        {settings.featuredPropertiesSubtitle}
                    </p>

                    <div className="
            mt-7
            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          ">

                        {properties.map(property => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}

                    </div>

                </section>

                <PropertyTypes />

                <WhyChooseUs />

                {/* Projects */}

                <section className="
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
                        {settings.featuredProjectsLabel}
                    </p>

                    <h2 className="
            mt-2
            text-3xl
            font-black
          ">
                        {settings.featuredProjectsTitle}
                    </h2>

                    <div className="
            mt-7
            grid
            md:grid-cols-3
            gap-4
          ">

                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}

                    </div>

                </section>

                <Testimonials />

                <CTA />

            </main>

            <Footer />

        </>
    );
}