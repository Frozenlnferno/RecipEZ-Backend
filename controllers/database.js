const addFavorite = async (req, res, db) => {
    const { user_id, recipe_id, recipe_title, recipe_image } = req.body;
    
    try {
        if (!user_id || !recipe_id || !recipe_title || !recipe_image) {
            return res.status(400).json('All fields are required');
        }
        await db('favorites').insert({ user_id, recipe_id, recipe_title, recipe_image });
        return res.json('Favorite added successfully');
    } catch (err) {
        console.error("Error adding favorite: ", err);
        return res.status(400).json('Error adding favorite');
    }
}

const removeFavorite = async (req, res, db) => {
    const { user_id, recipe_id } = req.body;
    try {
        if (!user_id || !recipe_id) {
            return res.status(400).json('User ID and Recipe ID are required');
        }
        await db('favorites')
            .where({ user_id, recipe_id })
            .del();
        return res.json('Favorite removed successfully');
    } catch (err) {
        console.error("Error removing favorite: ", err);
        return res.status(400).json('Error removing favorite');
    }
}

const getFavorites = async (req, res, db) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).json('User ID is required');
        }
        const favorites = await db('favorites').where({ user_id: id });
        // Map recipe_id -> id so front-end card components can use `id` directly
        const mapped = favorites.map(fav => {
            const { recipe_id, recipe_title, recipe_image, id, ...rest } = fav;
            return { id: recipe_id, title: recipe_title, image: recipe_image};
        });
        return res.json(mapped);
    } catch (err) {
        console.error("Error fetching favorites: ", err);
        return res.status(400).json('Error getting favorites');
    }
}

const database = {
    addFavorite,
    removeFavorite,
    getFavorites
}

export default database;