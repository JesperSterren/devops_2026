const request = require('supertest');
const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbHandler = require('./db-handler');
const ContactModel = require('../models/contact.model');

app.use(require('../api-routes'));

// It's just so easy to connect to the MongoDB Memory Server
// By using mongoose.connect
beforeAll(async () => dbHandler.connect());
afterEach(async () => dbHandler.clearDatabase());
afterAll(async () => dbHandler.closeDatabase());

describe('ContactController', () => {
  it('should return empty array on empty database', async (done) => {
    const res = await request(app).get('/contacts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveLength(0);
    done();
  });

  it('should create contact', async (done) => {
    const firstName = 'henk';
    const res = await request(app)
      .post('/contacts')
      .send({ firstName, lastName: 'test2', mobile: '12345566' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.firstName).toBe(firstName);

    const foundContact = await ContactModel.find({ firstName });
    expect(foundContact).toHaveLength(1);
    expect(foundContact.lastName).toBe('test');

    done();
  });
});
