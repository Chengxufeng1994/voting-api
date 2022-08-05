import { app } from './app';
import { connectDatabase } from './db';

const PORT = process.env.PORT || 3000;
const JWT_KEY = process.env.JWT_KEY;

const start = async () => {
  if (!JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  await connectDatabase();

  // require('./seeds/users');

  app.listen(PORT, () => {
    console.log(`Voting API listening on port ${PORT}`);
  });
};

start();
