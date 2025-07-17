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
            return users[0];
        })

        return res.json(newUser);
    } catch (err) {
        console.log(err);
        res.status(400).json(`Failed to register ${email}`);
    }
}

const handleLogin = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    try {
        const users = db.select("email", "pw_hash")
            .from("users")
            .where("email", "=", email);
        if (users.length === 0) {
            return res.status(400).json("Incorrect email or password");
        }

        const isValid = await bcrypt.compare(password, users[0].pw_hash);
        if (!isValid) {
            return res.status(400).json("Incorrect email or password");
        }

        const user = db.select("email, name")
            .from("users")
            .where("email", "=", email);

        return res.json(user[0]);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal server error");
    }
}

const auth = {
    signUp: handleSignUp,
    login: handleLogin,
}

export default auth;