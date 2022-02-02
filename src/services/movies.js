import request from 'request';
import Movie from '../models/movieModel.js';
import { OMDB_API_KEY } from '../config/index.js';

export async function searchOMDBMovie({ title }) {
    const options = {
        url: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${title}`,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error || body?.errors) {
                return reject(error || body);
            }

            const statusCode = response?.statusCode;
            /* eslint-disable prefer-promise-reject-errors */
            if (statusCode && (statusCode < 200 || statusCode >= 300)) {
                return reject({
                    messages: body,
                    status: statusCode,
                });
            }
            return resolve(JSON.parse(body));
        });
    });
}

export const createMovie = async (req, res, next) => {
    const { title } = req.body;
    const data = { title };

    try {
        const omdbResponse = await searchOMDBMovie({ title });
        if (omdbResponse) {
            data.released = omdbResponse.Released;
            data.genre = omdbResponse.Genre;
            data.director = omdbResponse.Director;
        } else {
            return res.status(404).send('Movie title is not a valid one. Please try again more carefully.');
        }

        const movie = await Movie.create(data);
        return res.send({ movie })
    } catch (err) {
        return res.status(400).send('Error while trying to create a movie');
    }
};

export const listMovies = async (req, res, next) => {

    try {
        /* This returns all movies, in a real live env, we shouldn't use find with empty filter */
        const movies = await Movie.find({}).lean();
        return res.send({ movies })
    } catch (err) {
        return res.status(400).send('Error while trying to list movies');
    }
};

