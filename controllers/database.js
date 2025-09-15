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
        await knex('favorites')
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
        return res.json(favorites);
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