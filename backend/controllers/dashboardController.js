const prisma = require("../prisma");

exports.getDashboard = async (req, res, next) => {
    try {
        const [
            totalProperties,
            totalProjects,
            totalLeads,
            upcomingVisits,
            availableProperties,
            soldProperties,
            pendingProperties,
            newLeads,
            contactedLeads,
            qualifiedLeads,
            recentLeads,
            recentProperties,
            recentProjects,
        ] = await Promise.all([
            prisma.property.count(),

            prisma.project.count(),

            prisma.lead.count(),

            prisma.visit.count({
                where: {
                    status: "SCHEDULED",
                },
            }),

            prisma.property.count({
                where: {
                    status: "AVAILABLE",
                },
            }),

            prisma.property.count({
                where: {
                    status: "SOLD",
                },
            }),

            prisma.property.count({
                where: {
                    status: "PENDING",
                },
            }),

            prisma.lead.count({
                where: {
                    status: "NEW",
                },
            }),

            prisma.lead.count({
                where: {
                    status: "CONTACTED",
                },
            }),

            prisma.lead.count({
                where: {
                    status: "QUALIFIED",
                },
            }),

            prisma.lead.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    property: true,
                    project: true,
                },
            }),

            prisma.property.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.project.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        res.json({
            stats: {
                totalProperties,
                totalProjects,
                totalLeads,
                upcomingVisits,
            },

            propertyOverview: {
                available: availableProperties,
                sold: soldProperties,
                pending: pendingProperties,
            },

            leadOverview: {
                new: newLeads,
                contacted: contactedLeads,
                qualified: qualifiedLeads,
            },

            recentLeads,
            recentProperties,
            recentProjects,
        });
    } catch (error) {
        next(error);
    }
};