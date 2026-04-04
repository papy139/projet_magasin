const pool = require('../db/pool');

async function createOrder(req, res, next) {
  const { customer_name, customer_email, items } = req.body;

  if (!customer_name || !customer_email || !items || items.length === 0) {
    return res.status(400).json({ error: 'customer_name, customer_email et items sont requis' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Vérifier le stock et verrouiller les lignes (SELECT FOR UPDATE évite le TOCTOU)
    const productData = {};
    for (const item of items) {
      const result = await client.query(
        'SELECT name, stock, price FROM products WHERE id=$1 FOR UPDATE',
        [item.product_id]
      );
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Produit id=${item.product_id} introuvable` });
      }
      const product = result.rows[0];
      if (product.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Stock insuffisant pour ${product.name}` });
      }
      productData[item.product_id] = product;
    }

    // Créer la commande
    const orderResult = await client.query(
      'INSERT INTO orders (customer_name, customer_email) VALUES ($1, $2) RETURNING *',
      [customer_name, customer_email]
    );
    const order = orderResult.rows[0];

    // Créer les lignes et décrémenter le stock
    for (const item of items) {
      const { price: unit_price } = productData[item.product_id];

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, unit_price]
      );

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

async function getAllOrders(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price
      )) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getOrdersByEmail(req, res, next) {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Le paramètre email est requis' });
  }
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price
      )) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.customer_email = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'cancelled'];
  if (!status || !allowed.includes(status)) {
    return res.status(400).json({ error: `Statut invalide. Valeurs acceptées : ${allowed.join(', ')}` });
  }
  try {
    const result = await pool.query(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getAllOrders, getOrdersByEmail, updateOrderStatus };
