require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Waitlist = require('./models/Waitlist');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then((conn) => console.log(`Connected to MongoDB: ${conn.connection.name} @ ${conn.connection.host}`))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/waitlist', async (req, res) => {
    const { email } = req.body;
    console.log(`\n[Waitlist] Incoming registration request for: ${email}`);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const existing = await Waitlist.findOne({ email });
        if (existing) {
            console.log(`[Waitlist] Registration failed: ${email} is already on the list.`);
            return res.status(400).json({ error: 'Email already registered' });
        }

        const entry = new Waitlist({ email });
        await entry.save();
        console.log(`[Waitlist] SUCCESS: ${email} saved to MongoDB collection 'waitlists' at ${process.env.MONGODB_URI.split('@').pop()}`);

        // Get new count
        const count = await Waitlist.countDocuments();

        res.status(201).json({
            message: 'Successfully joined the waitlist!',
            totalCount: 12450 + count // Adding base count for effect as requested
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/waitlist/count', async (req, res) => {
    try {
        const count = await Waitlist.countDocuments();
        res.json({ count: 12450 + count });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
