const prisma = require("../prisma");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../mongo");

exports.getProjects = async (req, res, next) => {
    try {
        const { search, status } = req.query;

        const projects = await prisma.project.findMany({
            where: {
                ...(search
                    ? {
                        OR: [
                            {
                                name: {
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
                ...(status ? { status } : {}),
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(projects);
    } catch (error) {
        next(error);
    }
};

exports.getProject = async (req, res, next) => {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                leads: true,
                visits: true,
            },
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
};

exports.createProject = async (req, res, next) => {
    try {
        const {
            name,
            location,
            units,
            available,
            price,
            possession,
            description,
            image,
            status,
        } = req.body;

        if (!name || !location || !price) {
            return res.status(400).json({
                message: "Name, location and price are required",
            });
        }

        const database = await getDatabase();
        const now = new Date();
        const document = {
            _id: new ObjectId(),
            name,
            location,
            units: Number(units || 0),
            available: Number(available || 0),
            price,
            possession,
            description,
            image,
            status: status || "UPCOMING",
            createdAt: now,
            updatedAt: now,
        };

        await database.collection("Project").insertOne(document);

        const project = {
            id: document._id.toHexString(),
            ...document,
        };
        delete project._id;

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const project = await prisma.project.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name,
                location: req.body.location,
                units:
                    req.body.units !== undefined
                        ? Number(req.body.units)
                        : undefined,
                available:
                    req.body.available !== undefined
                        ? Number(req.body.available)
                        : undefined,
                price: req.body.price,
                possession: req.body.possession,
                description: req.body.description,
                image: req.body.image,
                status: req.body.status,
            },
        });

        res.json(project);
    } catch (error) {
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        await prisma.project.delete({
            where: {
                id: req.params.id,
            },
        });

        res.json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};