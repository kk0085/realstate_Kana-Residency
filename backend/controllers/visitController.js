const prisma = require("../prisma");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../mongo");

exports.getVisits = async (req, res, next) => {
    try {
        const { search, status } = req.query;

        const visits = await prisma.visit.findMany({
            where: {
                ...(search
                    ? {
                        OR: [
                            {
                                customer: {
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
                lead: true,
            },
            orderBy: [
                {
                    date: "asc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });

        res.json(visits);
    } catch (error) {
        next(error);
    }
};

exports.getVisit = async (req, res, next) => {
    try {
        const visit = await prisma.visit.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                property: true,
                project: true,
                lead: true,
            },
        });

        if (!visit) {
            return res.status(404).json({
                message: "Visit not found",
            });
        }

        res.json(visit);
    } catch (error) {
        next(error);
    }
};

exports.createVisit = async (req, res, next) => {
    try {
        const {
            customer,
            phone,
            date,
            time,
            status,
            notes,
            propertyId,
            projectId,
            leadId,
        } = req.body;

        if (!customer || !phone || !date || !time) {
            return res.status(400).json({
                message:
                    "Customer, phone, date and time are required",
            });
        }

        const database = await getDatabase();
        const now = new Date();
        const document = {
            _id: new ObjectId(),
            customer,
            phone,
            date: new Date(date),
            time,
            status: status || "SCHEDULED",
            notes,
            createdAt: now,
            updatedAt: now,
            ...(propertyId && ObjectId.isValid(propertyId)
                ? { propertyId: new ObjectId(propertyId) }
                : {}),
            ...(projectId && ObjectId.isValid(projectId)
                ? { projectId: new ObjectId(projectId) }
                : {}),
            ...(leadId && ObjectId.isValid(leadId)
                ? { leadId: new ObjectId(leadId) }
                : {}),
        };

        await database.collection("Visit").insertOne(document);

        const visit = {
            id: document._id.toHexString(),
            customer: document.customer,
            phone: document.phone,
            date: document.date,
            time: document.time,
            status: document.status,
            notes: document.notes,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            property: null,
            project: null,
        };

        res.status(201).json(visit);
    } catch (error) {
        next(error);
    }
};

exports.updateVisit = async (req, res, next) => {
    try {
        const visit = await prisma.visit.update({
            where: {
                id: req.params.id,
            },
            data: {
                customer: req.body.customer,
                phone: req.body.phone,
                date: req.body.date
                    ? new Date(req.body.date)
                    : undefined,
                time: req.body.time,
                status: req.body.status,
                notes: req.body.notes,
                propertyId:
                    req.body.propertyId !== undefined
                        ? req.body.propertyId
                        : undefined,
                projectId:
                    req.body.projectId !== undefined
                        ? req.body.projectId
                        : undefined,
                leadId:
                    req.body.leadId !== undefined
                        ? req.body.leadId
                        : undefined,
            },
        });

        res.json(visit);
    } catch (error) {
        next(error);
    }
};

exports.deleteVisit = async (req, res, next) => {
    try {
        await prisma.visit.delete({
            where: {
                id: req.params.id,
            },
        });

        res.json({
            message: "Visit deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};