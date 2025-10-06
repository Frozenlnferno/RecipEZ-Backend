import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import knex from "knex";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const env = process.env;

const buildPgConnection = () => {
    // This part is for deployment. 
    if (process.env.DATABASE_URL) {
        const conn = { connectionString: process.env.DATABASE_URL };
        if (process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production') {
            conn.ssl = { rejectUnauthorized: false };
        }
        return conn;
    }
    //

    const conn = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    };

    if (process.env.DB_SSL === 'true') {
    conn.ssl = { rejectUnauthorized: false };
    }

    return conn;
};

const db = knex({
    client: 'pg',
    connection: buildPgConnection(),
    pool: { min: 0, max: 10 },
});

if (!db) {
    console.error("Failed to connect to the database!");
}

// Middleware
app.use(cors({
    origin: env.ORIGIN
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//

import spoon from "./controllers/spoonacular.js";
import auth from "./controllers/auth.js";
import database from "./controllers/database.js";

app.get('/', (req, res) => {
    res.send("Server is running");
});

// Routes
app.post('/auth/signup', async (req, res) => auth.signUp(req, res, db, bcrypt));
app.post('/auth/login', async (req, res) => auth.login(req, res, db, bcrypt));
app.get('/api/get_random_recipes/:count', async (req, res) => spoon.getRandomRecipes(req, res));
app.get('/api/get_recipe/:id', async (req, res) => spoon.getRecipeById(req, res));
app.post("/api/search_recipe", async (req, res) => spoon.complexRecipeSearch(req, res));
app.post("/db/get_favorites", async (req, res) => database.getFavorites(req, res, db));
app.post("/db/add_favorite", async (req, res) => database.addFavorite(req, res, db));
app.post("/db/remove_favorite", async (req, res) => database.removeFavorite(req, res, db));

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});