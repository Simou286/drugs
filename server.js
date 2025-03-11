const express = require('express');
const session = require('express-session');
const path = require('path');
const { registerUser, loginUser, getUserMedications, addMedication, deleteMedication } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
};

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };
        
        const user = await registerUser(userData);
        req.session.user = user;
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        req.session.user = user;
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

app.get('/api/user', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

app.get('/api/medications', isAuthenticated, async (req, res) => {
    try {
        const medications = await getUserMedications(req.session.user.id);
        res.json(medications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/medications', isAuthenticated, async (req, res) => {
    try {
        const medicationData = {
            userId: req.session.user.id,
            name: req.body.name,
            dosage: req.body.dosage,
            quantity: req.body.quantity,
            expirationDate: req.body.expirationDate,
            category: req.body.category,
            notes: req.body.notes
        };
        
        const medication = await addMedication(medicationData);
        res.status(201).json(medication);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/medications/:id', isAuthenticated, async (req, res) => {
    try {
        await deleteMedication(req.params.id, req.session.user.id);
        res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
