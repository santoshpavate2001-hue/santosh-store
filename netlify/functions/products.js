// netlify/functions/products.js
// GET  /.netlify/functions/products         → all products
// GET  /.netlify/functions/products?cat=Audio → filter by category

const { connectDB, getDB } = require('./lib/db');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  try {
    const client = await connectDB();
    const db = getDB(client);

    const query = {};
    const cat = event.queryStringParameters?.cat;
    if (cat) query.category = cat;

    const products = await db
      .collection('products')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify(products),
    };
  } catch (err) {
    console.error('products error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Failed to fetch products' }),
    };
  }
};
