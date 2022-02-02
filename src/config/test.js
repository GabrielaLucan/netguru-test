import dotenv from 'dotenv';

dotenv.config();

export const {
    ENV,
    TEST_MONGO_URL: MONGO_URL,
    JWT_SECRET,
    OMDB_API_KEY
} = process.env;
