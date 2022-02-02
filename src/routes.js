import express from 'express';
import { rateCheck } from './rateLimiter.js';
import { checkJwt } from './services/auth.js';
import { createMovie, listMovies } from './services/movies.js';
import { validateCreateMovie } from './validations.js';

const router = express.Router()

router.post('/movies', checkJwt, rateCheck, validateCreateMovie, createMovie)
router.get('/movies', checkJwt, listMovies)

export default (app) => { app.use(router) }
