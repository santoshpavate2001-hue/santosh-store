// netlify/functions/inquiry.js
// POST /.netlify/functions/inquiry
// Body: { name, phone, email, product, message }

const { connectDB, getDB } = require('./lib/db');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, phone, email, product, message } = body;

    if (!name || !phone) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Name and phone are required' }),
      };
    }

    const client = await connectDB();
    const db = getDB(client);

    const doc = {
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      product: (product || '').trim(),
      message: (message || '').trim(),
      status: 'new',
      createdAt: new Date(),
    };

    const result = await db.collection('inquiries').insertOne(doc);

    return {
      statusCode: 201,
      headers: CORS,
      body: JSON.stringify({ success: true, id: result.insertedId }),
    };
  } catch (err) {
    console.error('inquiry error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Failed to save inquiry' }),
    };
  }
};
