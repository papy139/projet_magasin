const pool = require('../db/pool');

async function getAllProducts(req, res, next) {
  try {
    const { search, category } = req.query;
    let query = `
      SELECT p.*, COALESCE(SUM(oi.quantity), 0)::int AS total_sold
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }
    if (category) {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }
    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ error: 'name et price sont requis' });
    }
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock || 0, category, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { name, description, price, image_url, category } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ error: 'name et price sont requis' });
    }
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, image_url=$4, category=$5 WHERE id=$6 RETURNING *',
      [name, description, price, image_url, category, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateStock(req, res, next) {
  try {
    const { stock } = req.body;
    if (stock == null || stock < 0) {
      return res.status(400).json({ error: 'stock doit être un entier >= 0' });
    }
    const result = await pool.query(
      'UPDATE products SET stock=$1 WHERE id=$2 RETURNING *',
      [stock, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({ error: 'Impossible de supprimer : ce produit est lié à des commandes existantes' });
    }
    next(err);
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, updateStock, deleteProduct };
