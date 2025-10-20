import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) { return res.status(401).json({ error: 'No token provided' }); }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) { return res.status(403).json({ error: 'Invalid token' }); } 
        req.user = user; // attach decoded user data
        next();
    });
}
