import express from 'express';
//import { QueryResult } from 'pg';
import { connectToDb } from './connection.js';

await connectToDb();

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// services

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});