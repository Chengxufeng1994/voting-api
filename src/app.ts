import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { usersRouter } from './routes/users';
import { pollsRouter } from './routes/polls';
import { optionRouter } from './routes/options';
import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';

const app = express();

/**
 * traffic is being proxied by ingress nginx
 * instruct express to trust it
 */
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(usersRouter);
app.use(pollsRouter);
app.use(optionRouter);

app.use(errorHandler);

export { app };
