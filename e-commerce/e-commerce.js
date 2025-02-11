const express = require('express');
const app = express();
app.use(express.json());  // Middleware to parse JSON

// Mock Database
let products = [];
let orders = [];
let carts = {};

// ---------------------- PRODUCTS ROUTES ----------------------

// GET /products - Retrieve all products
app.get('/products', (req, res) => {
    res.json(products);
});

// GET /products/:id - Retrieve product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
});

// POST /products - Add a new product
app.post('/products', (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    res.json(newProduct);
});

// PUT /products/:id - Update a product
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found" });

    Object.assign(product, req.body);
    res.json(product);
});

// DELETE /products/:id - Delete a product
app.delete('/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.json({ message: "Product deleted successfully" });
});

// ---------------------- ORDERS ROUTES ----------------------

// POST /orders - Create a new order
app.post('/orders', (req, res) => {
    const order = {
        id: orders.length + 1,
        items: req.body.items,
        total: req.body.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "Processing"
    };
    orders.push(order);
    res.json(order);
});

// GET /orders/:userId - Retrieve orders by user
app.get('/orders/:userId', (req, res) => {
    const userOrders = orders.filter(o => o.userId === parseInt(req.params.userId));
    res.json(userOrders);
});

// ---------------------- CART ROUTES ----------------------

// POST /cart/:userId - Add product to cart
app.post('/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    if (!carts[userId]) carts[userId] = [];

    carts[userId].push(req.body);
    res.json(carts[userId]);
});

// GET /cart/:userId - Retrieve user's cart
app.get('/cart/:userId', (req, res) => {
    res.json(carts[req.params.userId] || []);
});

// DELETE /cart/:userId/item/:productId - Remove item from cart
app.delete('/cart/:userId/item/:productId', (req, res) => {
    const userId = req.params.userId;
    if (!carts[userId]) return res.status(404).json({ error: "Cart not found" });

    carts[userId] = carts[userId].filter(item => item.id !== parseInt(req.params.productId));
    res.json(carts[userId]);
});

// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`E-commerce API running on http://localhost:${PORT}`);
});
