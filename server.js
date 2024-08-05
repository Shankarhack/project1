const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory user store (for demonstration purposes)
const users = [
    { id: 1, email: 'user@example.com', password: bcrypt.hashSync('password123', 8) }
];

// JWT Secret (keep this secure)
const JWT_SECRET = 'your_jwt_secret_key';

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error processing request' });
        }

        if (!result) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
