import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { JWT_SECRET } from '../config/index.js';
import app from '../server.js';
import { authFactory, users } from '../services/auth.js';

chai.use(chaiHttp);
const auth = authFactory(JWT_SECRET);

describe('#createMovie', async () => {
    let tokenPremiumUser;
    let premiumUser;

    before(async () => {
        premiumUser = users.find((u) => u.username === 'premium-jim');
        tokenPremiumUser = auth(premiumUser.username, premiumUser.password);
    });

    it('It should throw error, auth token is not defined', async () => {
        const res = await chai.request(app)
            .post(`/movies`)

        expect(res).to.have.status(401);
        expect(res.text).to.be.eq('Invalid Authorization token.');
    });

    it('It should throw error, auth token is incorrect', async () => {
        const res = await chai.request(app)
            .post(`/movies`)
            .set('Authorization', `Bearer randomString`);

        expect(res).to.have.status(401);
        expect(res.text).to.be.eq('Invalid Token');
    });

    it('It should throw error, title is not defined', async () => {
        const res = await chai.request(app)
            .post(`/movies`)
            .set('Authorization', `Bearer ${tokenPremiumUser}`);

        expect(res).to.have.status(401);
        const errors = res.body.errors;
        expect(errors.title).to.be.an('array');
        expect(errors.title).to.includes('title is required');
    });

    it('It should throw error, title is not a string', async () => {
        const title = 123;
        const res = await chai.request(app)
            .post(`/movies`)
            .send({ title })
            .set('Authorization', `Bearer ${tokenPremiumUser}`);

        expect(res).to.have.status(401);
        const errors = res.body.errors;
        expect(errors.title).to.be.an('array');
        expect(errors.title).to.includes('title must be a string');
    });

    it('Should successfully create movie, even if title is invalid or doesn\'t exist', async () => {
        const title = 'random movie title';
        const res = await chai.request(app)
            .post(`/movies`)
            .send({ title })
            .set('Authorization', `Bearer ${tokenPremiumUser}`);

        expect(res).to.have.status(200);
        const { movie } = res.body;
        expect(movie).to.not.equal(undefined);
        expect(movie.released).to.equal(undefined);
        expect(movie.genre).to.equal(undefined);
        expect(movie.director).to.equal(undefined);

        expect(movie.title).to.equal(title);
    });

    it('Should successfully create movie', async () => {
        const title = 'Avatar';
        const res = await chai.request(app)
            .post(`/movies`)
            .send({ title })
            .set('Authorization', `Bearer ${tokenPremiumUser}`);

        expect(res).to.have.status(200);
        const { movie } = res.body;

        expect(movie).to.not.equal(undefined);
        expect(movie.released).to.equal('18 Dec 2009');
        expect(movie.genre).to.equal('Action, Adventure, Fantasy');
        expect(movie.director).to.equal('James Cameron');
        expect(movie.title).to.equal(title);
    });
});


describe('#listMovies', async () => {
    let tokenPremiumUser;
    let premiumUser;

    before(async () => {
        premiumUser = users.find((u) => u.username === 'premium-jim');
        tokenPremiumUser = auth(premiumUser.username, premiumUser.password);
    });

    it('It should throw error, auth token is not defined', async () => {
        const res = await chai.request(app)
            .get(`/movies`)

        expect(res).to.have.status(401);
        expect(res.text).to.be.eq('Invalid Authorization token.');
    });

    it('It should throw error, auth token is incorrect', async () => {
        const res = await chai.request(app)
            .get(`/movies`)
            .set('Authorization', `Bearer randomString`);

        expect(res).to.have.status(401);
        expect(res.text).to.be.eq('Invalid Token');
    });

    it('Should successfully create movie, as an premium user', async () => {
        const res = await chai.request(app)
            .get(`/movies`)
            .set('Authorization', `Bearer ${tokenPremiumUser}`);

        expect(res).to.have.status(200);
        const { movies } = res.body;
        expect(movies).to.be.an('array');
        expect(movies?.length).to.be.gte(3);

        movies?.forEach(movie => {
            expect(movie.title).to.not.equal(undefined);
        })
    });
})