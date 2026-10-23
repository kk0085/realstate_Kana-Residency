require("dotenv").config();

const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

async function main() {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();

    try {
        const database = client.db();
        const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        await database.collection("User").updateOne(
            { email: process.env.ADMIN_EMAIL },
            {
                $set: {
                    name: "Admin",
                    email: process.env.ADMIN_EMAIL,
                    password,
                    role: "ADMIN",
                    updatedAt: new Date(),
                },
                $setOnInsert: {
                    createdAt: new Date(),
                },
            },
            { upsert: true }
        );

        const admin = await database.collection("User").findOne(
            { email: process.env.ADMIN_EMAIL },
            { projection: { email: 1, role: 1 } }
        );

        console.log(`Admin ready: ${admin.email} (${admin.role})`);
    } finally {
        await client.close();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
