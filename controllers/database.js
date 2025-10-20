// controllers/database.js
const addFavorite = async (req, res, db) => {
  try {
    const user_id = req.user?.id; // ✅ comes from decoded JWT
    const { recipe_id, recipe_title, recipe_image } = req.body;

    if (!user_id || !recipe_id || !recipe_title || !recipe_image) {
      return res.status(400).json("All fields are required");
    }

    await db("favorites").insert({ user_id, recipe_id, recipe_title, recipe_image });
    return res.json("Favorite added successfully");
  } catch (err) {
    console.error("Error adding favorite:", err);
    return res.status(500).json("Error adding favorite");
  }
};

const removeFavorite = async (req, res, db) => {
  try {
    const user_id = req.user?.id; // ✅ from token
    const { recipe_id } = req.body;

    if (!user_id || !recipe_id) {
      return res.status(400).json("User ID and Recipe ID are required");
    }

    await db("favorites")
      .where({ user_id, recipe_id })
      .del();

    return res.json("Favorite removed successfully");
  } catch (err) {
    console.error("Error removing favorite:", err);
    return res.status(500).json("Error removing favorite");
  }
};

const getFavorites = async (req, res, db) => {
  try {
    const user_id = req.user?.id; // ✅ from token
    if (!user_id) {
      return res.status(400).json("User ID is required");
    }

    const favorites = await db("favorites").where({ user_id });

    // Map recipe_id -> id for frontend compatibility
    const mapped = favorites.map(fav => ({
      id: fav.recipe_id,
      title: fav.recipe_title,
      image: fav.recipe_image,
    }));

    return res.json(mapped);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return res.status(500).json("Error getting favorites");
  }
};

const database = {
  addFavorite,
  removeFavorite,
  getFavorites,
};

export default database;
