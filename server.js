import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import knex from "knex";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const env = process.env;

const db = knex({
    client: 'pg',
    connection: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        ssl: { rejectUnauthorized: false },
    },
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