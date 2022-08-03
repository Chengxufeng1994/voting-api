import { app } from './app';
import { connectDatabase } from './db';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Poll API listening on port ${PORT}`);
  });
};

start();
