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

const getRecipe = async (req, res) => {
    const id = req.params.id;
    
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${env.spoonApiKey}`);
        if (!response) {
            return res.status(response.status).json({error: "Failed to fetch recipe info"});
        }
        const data = await response.json();
        console.log(data);
        return res.json(data);
    } catch (err) {
        return res.status(400).json({ error: err});
    }
};

const spoon = {
    getRandomRecipes,
    getRecipe
};

export default spoon;
