const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'root',
    port: 5432,
});

// ---------------------- PRODUCTS ROUTES ----------------------

// GET /products - Retrieve all products
app.get('/products', async (req, res) => {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
});

// GET /products/:id - Retrieve product by ID
app.get('/products/:id', async (req, res) => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
});

// POST /products - Add a new product
app.post('/products', async (req, res) => {
    const { name, description, price, stock } = req.body;
    const result = await pool.query(
        "INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, description, price, stock]
    );
    res.json(result.rows[0]);
});

// PUT /products/:id - Update a product
app.put('/products/:id', async (req, res) => {
    const { name, description, price, stock } = req.body;
    const result = await pool.query(
        "UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *",
        [name, description, price, stock, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
});

// DELETE /products/:id - Delete a product
app.delete('/products/:id', async (req, res) => {
    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.json({ message: "Product deleted successfully" });
});

// ---------------------- ORDERS ROUTES ----------------------

// POST /orders - Create a new order
app.post('/orders', async (req, res) => {
    const { user_id, total } = req.body;
    const result = await pool.query(
        "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
        [user_id, total]
    );
    res.json(result.rows[0]);
});

// GET /orders/:userId - Retrieve orders by user
app.get('/orders/:userId', async (req, res) => {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.params.userId]);
    res.json(result.rows);
});

// ---------------------- CART ROUTES ----------------------

// POST /cart/:userId - Add product to cart
app.post('/cart/:userId', async (req, res) => {
    const { product_id, quantity } = req.body;
    await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3",
        [req.params.userId, product_id, quantity]
    );
    res.json({ message: "Product added to cart" });
});

// GET /cart/:userId - Retrieve user's cart
app.get('/cart/:userId', async (req, res) => {
    const result = await pool.query("SELECT * FROM cart WHERE user_id = $1", [req.params.userId]);
    res.json(result.rows);
});

// DELETE /cart/:userId/item/:productId - Remove item from cart
app.delete('/cart/:userId/item/:productId', async (req, res) => {
    await pool.query("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [req.params.userId, req.params.productId]);
    res.json({ message: "Product removed from cart" });
});

// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`E-commerce API running on http://localhost:${PORT}`);
});
