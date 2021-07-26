const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user'); //Object destructuring
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
       await Genre.remove({});
       await server.close();
    });
    describe('GET /', () => {
    it('should return all genres', async () => {
        await Genre.collection.insertMany([
            { genre: 'genre1' },
            { genre: 'genre2' },
        ]);

        const res = await request(server).get('/api/genres');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body.some(g => g.genre === 'genre1')).toBeTruthy();
        expect(res.body.some(g => g.genre === 'genre2')).toBeTruthy();
    });
    });

    describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
        const genre = new Genre({ genre: 'genre1'});
        await genre.save();
        
        const res = await request(server).get('/api/genres/' + genre._id);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('genre', genre.genre);
    });

    it('should return 404 if invalid id is passed', async () => {
        const res = await request(server).get('/api/genres/1234');

        expect(res.status).toBe(404);
    });
    
    it('should return 404 if no genre with the give id exists', async () => {
        const id = mongoose.Types.ObjectId();
        const res = await request(server).get('/api/genres/' + id);

        expect(res.status).toBe(404);
    });
    });

    describe('POST /', () => {

        //Define the happy path, and then in each test , we change
        //one parameter that clearly aligns with the name of the
        //test.
        let token;
        let genre;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ genre });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            genre = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            genre = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        
        it('should return 400 if genre is more than 50 characters', async () => {
            genre = new Array(100).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        
        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('genre', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        let token;
        let genre;
        let genreName;

        const exec = async () => {
            return await request(server).put('/api/genres/' + genre._id)
                .set('x-auth-token', token)
                .send({ genre: genreName });
        }

        beforeEach(async () => {
            token = new User().generateAuthToken();
            genreName = 'genre2';
            genre = new Genre({ genre: 'genre1' });
            await genre.save();
        });

        it('should return 400 if invalid genre name is passed', async () => {
            genreName = 'a';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if genre ID not found', async () => {
            genre._id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 200 if genre was found and updated', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let genre;
        let genreName;

        const exec = async () => {
            return await request(server).delete('/api/genres/' + genre._id)
                .set('x-auth-token', token)
                .send({ genre: genreName });
        }

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            genre = new Genre({ genre: 'genre1' });
            await genre.save();
        });

        it('should return 404 if genre with the given ID was not found', async () => {
            genre._id = mongoose.Types.ObjectId().toHexString();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 403 if user is not authorized', async () => {
            token = User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should return 200 if genre was found and deleted', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });
});