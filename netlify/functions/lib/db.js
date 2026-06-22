// netlify/functions/lib/db.js
// Shared MongoDB client — reused across warm function invocations

const { MongoClient } = require('mongodb');

let cachedClient = null;

async function connectDB() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

function getDB(client) {
  return client.db('santoshstore');
}

module.exports = { connectDB, getDB };
