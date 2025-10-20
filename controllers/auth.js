import { generateToken } from "../middleware/jwt.js";

const handleSignUp = async (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;

  try {
    // Check if user already exists
    const existing = await db("users").where({ email }).first();
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Hash password
    const pw_hash = await bcrypt.hash(password, saltRounds);

    // Insert new user and return fields
    const [newUser] = await db("users")
      .insert({ name, pw_hash, email })
      .returning(["id", "email", "name"]);

    console.log(`✅ Signed up for ${email}`);

    // Create JWT
    const token = generateToken({ id: newUser.id, email });

    return res.json({
      token,
      user: newUser,
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    return res.status(500).json({ error: "Failed to register user." });
  }
};

const handleLogin = async (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await db("users")
      .select("email", "pw_hash", "name", "id")
      .where("email", "=", email)
      .first();

    if (!user) {
      return res.status(400).json({ error: "Incorrect email or password." });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.pw_hash);
    if (!isValid) {
      return res.status(400).json({ error: "Incorrect email or password." });
    }

    const { name, id } = user;
    console.log(`✅ Logged in for ${user.email}`);

    // Create JWT
    const token = generateToken({ id, email: user.email });

    return res.json({
      token,
      user: { id, email: user.email, name },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const auth = {
  signUp: handleSignUp,
  login: handleLogin,
};

export default auth;
