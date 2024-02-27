import express from 'express';
import { connectToDB } from './db';
import router from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 3000;

connectToDB();

app.use(router);

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});