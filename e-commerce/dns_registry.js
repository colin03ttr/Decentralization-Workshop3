const express = require('express');
const app = express();

// Hardcoded server address (can be dynamic in a real system)
const ACTIVE_SERVER = "localhost:3001";

app.get('/getServer', (req, res) => {
    res.json({ code: 200, server: ACTIVE_SERVER });
});

// Start DNS registry server on port 4000
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`DNS Registry running on http://localhost:${PORT}`);
});
