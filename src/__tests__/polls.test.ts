import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

describe('POST /api/polls/', () => {
  it('return 401 with not login', async () => {
    await request(app)
      .post('/api/polls/')
      .send({
        topic: 'test',
      })
      .expect(401);
  });

  it('return 400 with empty topic', async () => {
    await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: '',
      })
      .expect(400);
  });

  it('return 201 on successful create poll', async () => {
    await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);
  });
});
describe('POST /api/polls/start/:id', () => {
  it('return 400 with options small than two', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post(`/api/polls/start/${body._id}`)
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(400);
  });

  it('return 401 with general user to start', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.generalSignin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post(`/api/polls/start/${body._id}`)
      .set('Cookie', global.generalSignin())
      .send({
        topic: 'test',
      })
      .expect(401);
  });

  it('return 400 with poll not found', async () => {
    const pollId = new mongoose.Types.ObjectId();

    await request(app)
      .post(`/api/polls/start/${pollId}`)
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(400);
  });

  it('return 200 with start poll', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test2',
      })
      .expect(201);

    await request(app)
      .post(`/api/polls/start/${body._id}`)
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);
  });
});
describe('POST /api/polls/stop/:id', () => {
  it('return 401 with general user to stop', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.generalSignin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post(`/api/polls/stop/${body._id}`)
      .set('Cookie', global.generalSignin())
      .send({
        topic: 'test',
      })
      .expect(401);
  });

  it('return 400 with poll not found', async () => {
    const pollId = new mongoose.Types.ObjectId();

    await request(app)
      .post(`/api/polls/stop/${pollId}`)
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(400);
  });

  it('return 200 with stop poll', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test2',
      })
      .expect(201);

    await request(app)
      .post(`/api/polls/start/${body._id}`)
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post(`/api/polls/stop/${body._id}`)
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);
  });
});
