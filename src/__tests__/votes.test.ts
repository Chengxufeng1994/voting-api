import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

describe('POST /api/votes', () => {
  it('return a 401 with no login', async () => {
    await request(app).post('/api/votes').expect(401);
  });

  it('return a 400 with pollId empty', async () => {
    const optionId = new mongoose.Types.ObjectId();
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionId,
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('return a 400 with optionId empty', async () => {
    const pollId = new mongoose.Types.ObjectId();

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: pollId,
        optionId: '',
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('return a 400 with poll empty and optionId empty', async () => {
    await await request(app)
      .post('/api/votes')
      .send({
        pollId: '',
        optionId: '',
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('return a 400 with pollId not found', async () => {
    const pollId = new mongoose.Types.ObjectId();

    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: pollId,
        optionId: optionBody._id,
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('return a 400 with option not found', async () => {
    const optionId = new mongoose.Types.ObjectId();

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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionId,
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('return a 400 with poll not yet started', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionBody } = await request(app)
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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionBody._id,
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('return a 400 with option not in poll', async () => {
    const { body: pollOneBody } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: pollTwoBody } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: pollTwoBody._id,
        option: 'test1',
      })
      .expect(201);

    await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: pollOneBody._id,
        option: 'test1',
      })
      .expect(201);

    await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: pollOneBody._id,
        option: 'test2',
      })
      .expect(201);

    await request(app)
      .post(`/api/polls/start/${pollOneBody._id}`)
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: pollOneBody._id,
        optionId: optionBody._id,
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('return a 400 with user vote twice', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionOneBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    const { body: optionTwoBody } = await request(app)
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

    const cookie = global.signin();

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', cookie)
      .expect(201);

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', cookie)
      .expect(400);
  });

  it('return a 201 with user successfully vote ', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionOneBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    const { body: optionTwoBody } = await request(app)
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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', global.signin())
      .expect(201);
  });
});

describe('GET /api/votes/result', () => {
  it('return 401 with general user', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionOneBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    const { body: optionTwoBody } = await request(app)
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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', global.signin())
      .expect(201);

    await await request(app)
      .get(`/api/votes/result/${body._id}`)
      .set('Cookie', global.generalSignin())
      .expect(401);
  });

  it('return 200 with admin get vote result', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionOneBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    const { body: optionTwoBody } = await request(app)
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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', global.signin())
      .expect(201);

    const { body: result } = await await request(app)
      .get(`/api/votes/result/${body._id}`)
      .set('Cookie', global.signin())
      .expect(200);

    expect(result.length).toEqual(1);
  });
});

describe('GET /api/votes/current', () => {
  it('return 200 with general user', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionOneBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    const { body: optionTwoBody } = await request(app)
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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', global.signin())
      .expect(201);

    await await request(app)
      .get(`/api/votes/current/${body._id}`)
      .set('Cookie', global.generalSignin())
      .expect(200);
  });

  it('return 400 with general user lookup realtime vote twice', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionOneBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    const { body: optionTwoBody } = await request(app)
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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', global.signin())
      .expect(201);

    const cookie = global.generalSignin();

    await await request(app)
      .get(`/api/votes/current/${body._id}`)
      .set('Cookie', cookie)
      .expect(200);

    await await request(app)
      .get(`/api/votes/current/${body._id}`)
      .set('Cookie', cookie)
      .expect(400);
  });

  it('return 200 with admin get vote result', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    const { body: optionOneBody } = await request(app)
      .post(`/api/options`)
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'test1',
      })
      .expect(201);

    const { body: optionTwoBody } = await request(app)
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

    await await request(app)
      .post('/api/votes')
      .send({
        pollId: body._id,
        optionId: optionOneBody._id,
      })
      .set('Cookie', global.signin())
      .expect(201);

    const { body: result } = await request(app)
      .get(`/api/votes/current/${body._id}`)
      .set('Cookie', global.signin())
      .expect(200);
  });
});
