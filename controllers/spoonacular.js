import queryHelper from "../utils/queryHelper.js"; 
const env = process.env;

const getRandomRecipes = async (req, res) => {
    const count = req.params.count || 1;

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/random?apiKey=${env.spoonApiKey}&number=${count}`
        );

        if (!response.ok) {
            // handle HTTP errors (like 401, 403, 500)
            return res.status(response.status).json({ error: "Failed to fetch recipes" });
        }

        const data = await response.json();
        return res.json(data); 

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getRecipeById = async (req, res) => {
    const id = req.params.id;
    
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${env.spoonApiKey}`);
        if (!response) {
            return res.status(response.status).json({error: "Failed to fetch recipe info"});
        }
        const data = await response.json();
        return res.json(data);
    } catch (err) {
        console.log({ 
            source: "spoonacular.js",
            error: err
        })
        return res.status(400).json({ error: err});
    }
};

const complexRecipeSearch = async (req, res) => {
    const { filters } = req.body;
    const { query, type, cuisine, diet, intolerances, maxReadyTime } = filters;
    
    try {
        const response = await fetch(queryHelper.buildSpoonUrl(
            "https://api.spoonacular.com/recipes/complexSearch", 
            env.spoonApiKey, 
            filters
        ));
        if (!response) {
            return res.status(response.status).json({error: "Failed to fetch recipe info"});
        }
        const data = await response.json();
        return res.json(data.results);
    } catch (err) {
        console.log({ 
            source: "spoonacular.js",
            error: err
        })
        return res.status(400).json({ error: err});
    }
};

const spoon = {
    getRandomRecipes,
    getRecipeById,
    complexRecipeSearch
};

export default spoon;
