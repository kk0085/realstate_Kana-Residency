require("dotenv").config();

const bcrypt = require("bcryptjs");
const {
    PrismaClient,
} = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    const password = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
    );

    const existingAdmin = await prisma.user.findUnique({
        where: { email: process.env.ADMIN_EMAIL },
    });

    const admin = existingAdmin
        ? await prisma.user.update({
            where: { id: existingAdmin.id },
            data: { password, role: "ADMIN" },
        })
        : await prisma.user.create({
            data: {
                name: "Admin",
                email: process.env.ADMIN_EMAIL,
                password,
                role: "ADMIN",
            },
        });

    await prisma.visit.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.property.deleteMany();
    await prisma.project.deleteMany();

    const property1 = await prisma.property.create({
        data: {
            title: "Luxury 3 BHK Villa",
            location: "Vaishali Nagar, Jaipur",
            type: "Villa",
            price: "₹1.25 Cr",
            bedrooms: 3,
            area: "2200 sq.ft",
            description:
                "Premium luxury villa with modern amenities.",
            status: "AVAILABLE",
        },
    });

    const property2 = await prisma.property.create({
        data: {
            title: "Modern 3 BHK Apartment",
            location: "Mansarovar, Jaipur",
            type: "Apartment",
            price: "₹78 Lakh",
            bedrooms: 3,
            area: "1650 sq.ft",
            status: "AVAILABLE",
        },
    });

    const property3 = await prisma.property.create({
        data: {
            title: "Premium Residential Plot",
            location: "Jagatpura, Jaipur",
            type: "Plot",
            price: "₹52 Lakh",
            bedrooms: 0,
            area: "1800 sq.ft",
            status: "AVAILABLE",
        },
    });

    const property4 = await prisma.property.create({
        data: {
            title: "Royal 4 BHK House",
            location: "C-Scheme, Jaipur",
            type: "House",
            price: "₹2.10 Cr",
            bedrooms: 4,
            area: "2800 sq.ft",
            status: "SOLD",
        },
    });

    const project1 = await prisma.project.create({
        data: {
            name: "Green Valley Residency",
            location: "Jagatpura, Jaipur",
            units: 180,
            available: 74,
            price: "₹45 Lakh onwards",
            possession: "Dec 2027",
            status: "ONGOING",
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: "Royal Heights",
            location: "Mansarovar, Jaipur",
            units: 240,
            available: 38,
            price: "₹68 Lakh onwards",
            possession: "Jun 2027",
            status: "ONGOING",
        },
    });

    const project3 = await prisma.project.create({
        data: {
            name: "Palm Residency",
            location: "Vaishali Nagar, Jaipur",
            units: 120,
            available: 0,
            price: "₹92 Lakh onwards",
            possession: "Completed",
            status: "COMPLETED",
        },
    });

    const lead1 = await prisma.lead.create({
        data: {
            name: "Rahul Sharma",
            email: "rahul@gmail.com",
            phone: "+91 98765 43210",
            source: "Website",
            status: "NEW",
            propertyId: property1.id,
            assignedToId: admin.id,
        },
    });

    const lead2 = await prisma.lead.create({
        data: {
            name: "Priya Verma",
            email: "priya@gmail.com",
            phone: "+91 98765 12345",
            source: "Google",
            status: "CONTACTED",
            propertyId: property2.id,
            assignedToId: admin.id,
        },
    });

    const lead3 = await prisma.lead.create({
        data: {
            name: "Amit Singh",
            email: "amit@gmail.com",
            phone: "+91 99887 66554",
            source: "Facebook",
            status: "QUALIFIED",
            projectId: project1.id,
            assignedToId: admin.id,
        },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.visit.create({
        data: {
            customer: "Rahul Sharma",
            phone: "+91 98765 43210",
            date: tomorrow,
            time: "11:00 AM",
            status: "SCHEDULED",
            propertyId: property1.id,
            leadId: lead1.id,
            assignedToId: admin.id,
        },
    });

    await prisma.visit.create({
        data: {
            customer: "Priya Verma",
            phone: "+91 98765 12345",
            date: tomorrow,
            time: "02:30 PM",
            status: "SCHEDULED",
            propertyId: property2.id,
            leadId: lead2.id,
            assignedToId: admin.id,
        },
    });

    await prisma.visit.create({
        data: {
            customer: "Amit Singh",
            phone: "+91 99887 66554",
            date: new Date(),
            time: "12:00 PM",
            status: "COMPLETED",
            projectId: project1.id,
            leadId: lead3.id,
            assignedToId: admin.id,
        },
    });

    console.log("Seed completed.");
    console.log("");
    console.log("Admin Login:");
    console.log("Email: admin@realestate.com");
    console.log("Password: admin123");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });