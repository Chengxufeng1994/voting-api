import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { usersRouter } from './routes/users';
import { activitiesRouter } from './routes/activities';

const app = express();

/**
 * traffic is being proxied by ingress nginx
 * instruct express to trust it
 */
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(bodyParser.json());
app.use(usersRouter);
app.use(activitiesRouter);

export { app };
