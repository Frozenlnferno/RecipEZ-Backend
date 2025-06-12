import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const env = process.env;

app.use(cors({
    origin: env.ORIGIN
}))

// app.get('/', () => {

//});

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});