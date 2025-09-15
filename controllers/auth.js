const handleSignUp = async (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;

    try {
        const pw_hash = await bcrypt.hash(password, saltRounds);
        const [newUser] = await db("users").insert({
            name,
            pw_hash,
            email,
        }).returning(['id', 'email', 'name']);

        console.log(`Signed up for ${email}!`);
        return res.json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(400).json(`Failed to register ${email}`);
    }
}

const handleLogin = async (req, res, db, bcrypt) => {
    const { inputEmail, inputPassword } = req.body;

    try {
        // Get user with email
        const [user] = await db.select("email", "pw_hash", "name", "id")
            .from("users")
            .where("email", "=", inputEmail);
        if (!user) {
            return res.status(400).json({ error: "Incorrect email or password." });
        }

        // Check password
        const isValid = await bcrypt.compare(inputPassword, user.pw_hash);
        if (!isValid) {
            return res.status(400).json({ error: "Incorrect email or password." });
        }

        // Only return safe user info
        const { email, name, id } = user;
        console.log(`Logged in for ${email}!`);
        return res.json({ id, email, name });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

const auth = {
    signUp: handleSignUp,
    login: handleLogin,
}

export default auth;