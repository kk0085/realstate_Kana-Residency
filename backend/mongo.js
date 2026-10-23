const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DATABASE_URL);
let databasePromise;

const getDatabase = async () => {
    if (!databasePromise) {
        databasePromise = client.connect().then(() => client.db());
    }

    return databasePromise;
};

module.exports = { getDatabase };
