const prisma = require("../prisma");
const { MongoClient, ObjectId } = require("mongodb");

const defaultSettings = {
    companyName: "DreamHome",
    logo: "",
    heroBadge: "Trusted Real Estate Partner",
    heroTitle: "Find a Place You'll Love to Call Home.",
    heroSubtitle: "Discover premium properties in the best locations. Your dream home is just a search away.",
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
    aboutTitle: "We Help You Find a Place You'll Love",
    aboutSubtitle: "DreamHome is a trusted real-estate partner helping families and investors discover exceptional properties.",
    aboutImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
    aboutText1: "Buying a property should feel exciting, not stressful.",
    aboutText2: "From your first property search to final possession, our team is with you at every step.",
    contactPhone: "+91 98765 4310",
    contactEmail: "hello@dreamhome.com",
    contactAddress: "Jaipur, Rajasthan, India",
    contactHours: "Mon - Sat, 9:00 AM - 7:00 PM",
    contactMapUrl: "",
    ctaTitle: "Your Next Address Starts Here.",
    ctaSubtitle: "Explore the best properties and make your move today.",
    ctaPrimaryLabel: "Browse Properties",
    ctaSecondaryLabel: "Talk to an Expert",
    whyChooseTitle: "Your Trusted Real Estate Partner",
    whyChooseText: "We make property buying, selling and renting simple, transparent and stress-free.",
    testimonialsTitle: "What Our Clients Say",
    testimonialsSubtitle: "Real stories from happy buyers, renters, and investors.",
    footerText: "Find your perfect place with DreamHome.",
    featuredPropertiesLabel: "FEATURED PROPERTIES",
    featuredPropertiesTitle: "Handpicked Homes for You",
    featuredPropertiesSubtitle: "Explore our most popular and premium properties.",
    propertyTypesLabel: "EXPLORE BY PROPERTY TYPE",
    propertyTypesTitle: "Find What Fits Your Lifestyle",
    featuredProjectsLabel: "FEATURED PROJECTS",
    featuredProjectsTitle: "Top Residential & Commercial Projects",
    aboutStoryLabel: "Our Story",
    aboutStoryTitle: "Your Trusted Real Estate Partner",
    aboutCtaLabel: "Talk to Our Team",
    contactTitle: "Let's Find Your DreamHome",
    contactSubtitle: "Have a question about a property, project or investment? Our team is ready to help.",
};

const editableFields = Object.keys(defaultSettings);

const pickEditableSettings = (data = {}) => editableFields.reduce((result, field) => {
    if (data[field] !== undefined) result[field] = data[field];
    return result;
}, {});

const normalizeSettings = (settings = {}) => ({
    id: settings.id || settings._id ? String(settings._id || settings.id) : undefined,
    ...defaultSettings,
    ...settings,
    ...(settings._id ? { id: String(settings._id) } : {}),
});

const getSettingsCollection = async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL is not configured");
    }

    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db();
    return { client, collection: db.collection("siteSettings") };
};

const readSettingsFromMongo = async () => {
    const { client, collection } = await getSettingsCollection();
    try {
        const record = await collection.findOne({});
        return record ? normalizeSettings(record) : normalizeSettings(defaultSettings);
    } finally {
        await client.close();
    }
};

const writeSettingsToMongo = async (data) => {
    const { client, collection } = await getSettingsCollection();
    try {
        const merged = { ...defaultSettings, ...pickEditableSettings(data) };
        const existing = await collection.findOne({});

        if (!existing) {
            const { insertedId } = await collection.insertOne(merged);
            const created = await collection.findOne({ _id: insertedId });
            return normalizeSettings(created || merged);
        }

        await collection.updateOne(
            { _id: existing._id },
            { $set: merged }
        );

        const updated = await collection.findOne({ _id: existing._id });
        return normalizeSettings(updated || merged);
    } finally {
        await client.close();
    }
};

exports.getSiteSettings = async (req, res, next) => {
    try {
        let settings = null;

        if (prisma && prisma.siteSettings && typeof prisma.siteSettings.findFirst === "function") {
            settings = await prisma.siteSettings.findFirst();
        }

        if (!settings) {
            const mongoSettings = await readSettingsFromMongo();
            settings = mongoSettings;
        }

        res.json(normalizeSettings(settings || defaultSettings));
    } catch (error) {
        next(error);
    }
};

exports.updateSiteSettings = async (req, res, next) => {
    try {
        const data = req.body || {};
        let settings = null;

        if (prisma && prisma.siteSettings && typeof prisma.siteSettings.findFirst === "function") {
            const existing = await prisma.siteSettings.findFirst();
            const editableData = pickEditableSettings(data);
            if (existing) {
                settings = await prisma.siteSettings.update({
                    where: { id: existing.id },
                    data: editableData,
                });
            } else {
                settings = await prisma.siteSettings.create({
                    data: { ...defaultSettings, ...editableData },
                });
            }
        }

        if (!settings) {
            settings = await writeSettingsToMongo(data);
        }

        res.json(normalizeSettings(settings));
    } catch (error) {
        next(error);
    }
};
