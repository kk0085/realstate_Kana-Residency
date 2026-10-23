const prisma = require("../prisma");

exports.getProperties = async (req, res, next) => {
    try {
        const { search, type, status } = req.query;

        const properties = await prisma.property.findMany({
            where: {
                ...(search
                    ? {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                },
                            },
                            {
                                location: {
                                    contains: search,
                                },
                            },
                        ],
                    }
                    : {}),
                ...(type ? { type } : {}),
                ...(status ? { status } : {}),
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(properties);
    } catch (error) {
        next(error);
    }
};

exports.getProperty = async (req, res, next) => {
    try {
        const property = await prisma.property.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                leads: true,
                visits: true,
            },
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        res.json(property);
    } catch (error) {
        next(error);
    }
};

exports.createProperty = async (req, res, next) => {
    try {
        const {
            title,
            location,
            type,
            price,
            bedrooms,
            area,
            description,
            image,
            status,
        } = req.body;

        if (!title || !location || !type || !price) {
            return res.status(400).json({
                message: "Title, location, type and price are required",
            });
        }

        const property = await prisma.property.create({
            data: {
                title,
                location,
                type,
                price,
                bedrooms: Number(bedrooms || 0),
                area,
                description,
                image,
                status: status || "AVAILABLE",
            },
        });

        res.status(201).json(property);
    } catch (error) {
        next(error);
    }
};

exports.updateProperty = async (req, res, next) => {
    try {
        const id = req.params.id;

        const {
            title,
            location,
            type,
            price,
            bedrooms,
            area,
            description,
            image,
            status,
        } = req.body;

        const property = await prisma.property.update({
            where: { id },
            data: {
                title,
                location,
                type,
                price,
                bedrooms:
                    bedrooms !== undefined
                        ? Number(bedrooms)
                        : undefined,
                area,
                description,
                image,
                status,
            },
        });

        res.json(property);
    } catch (error) {
        next(error);
    }
};

exports.deleteProperty = async (req, res, next) => {
    try {
        await prisma.property.delete({
            where: {
                id: req.params.id,
            },
        });

        res.json({
            message: "Property deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};