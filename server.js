import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken'; // For JWT authentication
import mongoose from 'mongoose'; // For MongoDB connection
import cors from 'cors';
import dotenv from 'dotenv';
import studentRouter from './routes/student.js';
import resultRouter from './routes/result.js';
import marksRouter from './routes/marks.js';

dotenv.config();
const app = express();

const PORT = 3000;
const JWT_SECRET = 'd3c6bb581976c311c5086e4da0ec613f281c807e4df1593202adf7462ead4ebe'; // CHANGE THIS IN PRODUCTION!

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/lab-exams-cia3';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Password validation function
function validatePassword(password) {
    // Regex for at least 8 characters, with at least one letter, one number, and one symbol
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
}

// Registration API endpoint
app.post('/api/register', async (req, res) => {
    const { email, password, role } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ 
            message: 'Password must be at least 8 characters long and contain at least one letter, one number, and one symbol.' 
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// Single Login API endpoint
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email, role });

        if (!user) {
            return res.status(404).json({ message: `${role} not found or incorrect role.` });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        const token = jwt.sign(
            { userId: user._id, userType: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful!', token, userType: user.role });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// A protected route to demonstrate JWT verification
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    if (!token) return res.status(401).json({ message: 'Token not formatted correctly.' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = decoded; // Add the decoded user payload to the request
        next();
    });
}

app.get('/api/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: `Welcome to your profile, ${req.user.userType}!`,
        user: req.user
    });
});

// Route middleware
app.use('/api/students', studentRouter);
app.use('/api/results', resultRouter);
app.use('/api/marks', marksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
