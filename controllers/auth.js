const handleSignUp = async (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;

    try {
        const pw_hash = await bcrypt.hash(password, saltRounds);
        const newUser = await db.transaction(async trx => {
            const users = await trx('users')
                .insert({
                    name,
                    pw_hash,
                    email,
                    joined: new Date()
                })
                .returning(['id', 'email', 'name', 'joined']);
            return (users[0]);
        })

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
        const users = await db.select("email", "pw_hash", "name")
            .from("users")
            .where("email", "=", inputEmail);
        if (!users || users.length === 0) {
            return res.status(400).json({ error: "Incorrect email or password." });
        }

        // Check password
        const isValid = await bcrypt.compare(inputPassword, users[0].pw_hash);
        if (!isValid) {
            return res.status(400).json({ error: "Incorrect email or password." });
        }

        // Only return safe user info
        const { email, name } = users[0];
        console.log(`Logged in for ${email}!`);
        return res.json({ email: email, name });
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