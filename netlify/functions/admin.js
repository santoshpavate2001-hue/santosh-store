// netlify/functions/admin.js
// POST   /.netlify/functions/admin  { action:'add',    product:{...}, password }
// POST   /.netlify/functions/admin  { action:'delete', id:'....',      password }
// POST   /.netlify/functions/admin  { action:'inquiries',              password }

const { connectDB, getDB } = require('./lib/db');
const { ObjectId } = require('mongodb');

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
    const { action, password } = body;

    // Password check
    if (password !== process.env.ADMIN_PASSWORD) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const client = await connectDB();
    const db = getDB(client);

    // --- ADD PRODUCT ---
    if (action === 'add') {
      const { product } = body;
      if (!product?.name || !product?.price || !product?.category) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'name, price, category required' }) };
      }
      const doc = {
        name: product.name.trim(),
        category: product.category.trim(),
        price: Number(product.price),
        description: (product.description || '').trim(),
        brand: (product.brand || '').trim(),
        inStock: product.inStock !== false,
        createdAt: new Date(),
      };
      const result = await db.collection('products').insertOne(doc);
      return { statusCode: 201, headers: CORS, body: JSON.stringify({ success: true, id: result.insertedId }) };
    }

    // --- DELETE PRODUCT ---
    if (action === 'delete') {
      const { id } = body;
      if (!id) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'id required' }) };
      await db.collection('products').deleteOne({ _id: new ObjectId(id) });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // --- GET INQUIRIES ---
    if (action === 'inquiries') {
      const inquiries = await db
        .collection('inquiries')
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
      return { statusCode: 200, headers: CORS, body: JSON.stringify(inquiries) };
    }

    // --- MARK INQUIRY DONE ---
    if (action === 'resolve') {
      const { id } = body;
      await db.collection('inquiries').updateOne({ _id: new ObjectId(id) }, { $set: { status: 'resolved' } });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    console.error('admin error:', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Server error' }) };
  }
};
