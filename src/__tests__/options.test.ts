import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

describe('POST /api/options', () => {
  it('return 401 with general user add options', async () => {
    await request(app)
      .post('/api/options')
      .send({
        pollId: 'xxxxx',
        option: 'xxxxx',
      })
      .expect(401);
  });

  it('return 400 with poll not found', async () => {
    await request(app)
      .post('/api/options')
      .set('Cookie', global.signin())
      .send({
        pollId: new mongoose.Types.ObjectId(),
      })
      .expect(400);
  });

  it('return 400 with option empty', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post('/api/options')
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        options: '',
      })
      .expect(400);
  });

  it('return 401 with general user', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post('/api/options')
      .set('Cookie', global.generalSignin())
      .send({
        pollId: body._id,
        option: 'option',
      })
      .expect(401);
  });

  it('return 200 with successful add option to poll', async () => {
    const { body } = await request(app)
      .post('/api/polls/')
      .set('Cookie', global.signin())
      .send({
        topic: 'test',
      })
      .expect(201);

    await request(app)
      .post('/api/options')
      .set('Cookie', global.signin())
      .send({
        pollId: body._id,
        option: 'option',
      })
      .expect(201);
  });
});
