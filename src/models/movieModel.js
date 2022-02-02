import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: String,
    released: String,
    genre: String,
    director: String,
}, { timestamps: true });

export default mongoose.model('movie', movieSchema, 'movies');
