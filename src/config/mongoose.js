import mongoose from 'mongoose';
import { MONGO_URL } from './index.js';

export default async function initMongoose() {
    mongoose.connect(MONGO_URL, { autoIndex: true });
}

export function closeMongoose() {
    return mongoose.connection.close();
}
