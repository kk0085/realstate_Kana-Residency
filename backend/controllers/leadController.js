const prisma = require("../prisma");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../mongo");

exports.getLeads = async (req, res, next) => {
    try {
        const { search, status } = req.query;

        const leads = await prisma.lead.findMany({
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
                                email: {
                                    contains: search,
                                },
                            },
                            {
                                phone: {
                                    contains: search,
                                },
                            },
                        ],
                    }
                    : {}),
                ...(status ? { status } : {}),
            },
            include: {
                property: true,
                project: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(leads);
    } catch (error) {
        next(error);
    }
};

exports.getLead = async (req, res, next) => {
    try {
        const lead = await prisma.lead.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                property: true,
                project: true,
                visits: true,
            },
        });

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.json(lead);
    } catch (error) {
        next(error);
    }
};

exports.createLead = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            source,
            message,
            propertyId,
            projectId,
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                message: "Name and phone are required",
            });
        }

        const database = await getDatabase();
        const now = new Date();
        const document = {
            _id: new ObjectId(),
            name,
            email,
            phone,
            source,
            message,
            status: "NEW",
            createdAt: now,
            updatedAt: now,
            ...(propertyId && ObjectId.isValid(propertyId)
                ? { propertyId: new ObjectId(propertyId) }
                : {}),
            ...(projectId && ObjectId.isValid(projectId)
                ? { projectId: new ObjectId(projectId) }
                : {}),
        };

        await database.collection("Lead").insertOne(document);

        const lead = {
            id: document._id.toHexString(),
            name: document.name,
            email: document.email,
            phone: document.phone,
            source: document.source,
            message: document.message,
            status: document.status,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            property: null,
            project: null,
        };

        res.status(201).json(lead);
    } catch (error) {
        next(error);
    }
};

exports.updateLead = async (req, res, next) => {
    try {
        const lead = await prisma.lead.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                source: req.body.source,
                message: req.body.message,
                status: req.body.status,
                propertyId:
                    req.body.propertyId !== undefined
                        ? req.body.propertyId
                        : undefined,
                projectId:
                    req.body.projectId !== undefined
                        ? req.body.projectId
                        : undefined,
            },
        });

        res.json(lead);
    } catch (error) {
        next(error);
    }
};

exports.deleteLead = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid lead id",
            });
        }

        const database = await getDatabase();
        const result = await database.collection("Lead").deleteOne({
            _id: new ObjectId(req.params.id),
        });

        if (!result.deletedCount) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.json({
            message: "Lead deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};