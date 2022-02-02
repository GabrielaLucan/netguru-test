import dotenv from 'dotenv';
import * as testConfig from './test.js';

dotenv.config();

export const {
    ENV,
    MONGO_URL,
    JWT_SECRET,
    OMDB_API_KEY,
} = (process.env.ENV === 'test' ? testConfig : process.env);
