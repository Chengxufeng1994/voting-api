import request from 'supertest';
import { app } from '../app';

describe('POST /api/users/singip', () => {
  it('return a 201 on successful signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);
  });

  it('return a 400 with an invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'asdfgh',
      })
      .expect(400);
  });

  it('return a 400 with an invalid identity', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        identity: 'xxxxxxx',
        email: 'test@test.com',
      })
      .expect(400);
  });

  it('return a 400 with missing email and password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        password: 'password',
      })
      .expect(400);
  });

  it('disallows duplicate identity', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('POST /api/users/singin', function () {
  it('fails when a email that does not exist is supplied', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(400);
  });

  it('fails when a incorrect identity is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        identity: 'A123456',
        email: 'test@test.com',
      })
      .expect(400);
  });

  it('responds with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('POST /api/users/signout', function () {
  it('clears the cookie after signing out', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        identity: 'A123456(7)',
        email: 'test@test.com',
      })
      .expect(201);

    const response = await request(app).post('/api/users/signout').expect(200);

    expect(response.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});

describe('GET /api/users/currentuser', function () {
  it('responds with details about the current user', async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.currentUser.email).toEqual('admin@voting.io');
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
  });
});
