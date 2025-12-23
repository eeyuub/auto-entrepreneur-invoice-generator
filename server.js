import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test connection and create table
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      type TEXT,
      clientName TEXT,
      date TEXT,
      total REAL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  client.query(createTableQuery, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Table "documents" is ready');
  });

  const createClientsTableQuery = `
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      ice TEXT,
      if_id TEXT,
      taxe_pro TEXT,
      phone TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  client.query(createClientsTableQuery, (err, result) => {
    release();
    if (err) {
      return console.error('Error creating clients table', err.stack);
    }
    console.log('Table "clients" is ready');
  });
});

// API Routes

// --- Clients API ---

// Get all clients with document counts
app.get('/api/clients', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        COUNT(CASE WHEN d.type = 'FACTURE' THEN 1 END) as invoices_count,
        COUNT(CASE WHEN d.type = 'DEVIS' THEN 1 END) as quotes_count
      FROM clients c
      LEFT JOIN documents d ON d.clientName = c.name
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const result = await pool.query(query);
    res.json({
      message: 'success',
      data: result.rows
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create new client
app.post('/api/clients', async (req, res) => {
  try {
    const { name, address, ice, if_id, taxe_pro, phone } = req.body;
    const sql = 'INSERT INTO clients (name, address, ice, if_id, taxe_pro, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const params = [name, address, ice, if_id, taxe_pro, phone];
    
    const result = await pool.query(sql, params);
    
    res.json({
      message: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, ice, if_id, taxe_pro, phone } = req.body;
    const sql = 'UPDATE clients SET name = $1, address = $2, ice = $3, if_id = $4, taxe_pro = $5, phone = $6 WHERE id = $7 RETURNING *';
    const params = [name, address, ice, if_id, taxe_pro, phone, id];
    
    const result = await pool.query(sql, params);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      message: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM clients WHERE id = $1';
    
    const result = await pool.query(sql, [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'deleted', changes: result.rowCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Documents API ---

// Get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, type, clientname as "clientName", date, total, created_at FROM documents ORDER BY created_at DESC');
    res.json({
      message: 'success',
      data: result.rows
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single document
app.get('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, type, clientname as "clientName", date, total, content, created_at FROM documents WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      message: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create new document
app.post('/api/documents', async (req, res) => {
  try {
    const { type, clientName, date, total, content } = req.body;
    const sql = 'INSERT INTO documents (type, clientName, date, total, content) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const params = [type, clientName, date, total, JSON.stringify(content)];
    
    const result = await pool.query(sql, params);
    
    res.json({
      message: 'success',
      data: { id: result.rows[0].id }
    });
  } catch (err) {
    console.error('Error in POST /api/documents:', err);
    res.status(400).json({ error: err.message });
  }
});

// Update existing document
app.put('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, clientName, date, total, content } = req.body;
    const sql = 'UPDATE documents SET type = $1, clientName = $2, date = $3, total = $4, content = $5 WHERE id = $6';
    const params = [type, clientName, date, total, JSON.stringify(content), id];
    
    const result = await pool.query(sql, params);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      message: 'updated',
      changes: result.rowCount
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM documents WHERE id = $1';
    
    const result = await pool.query(sql, [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'deleted', changes: result.rowCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).send('Internal Server Error');
});
