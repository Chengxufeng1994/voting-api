import { User } from '../models/users';

const users = [
  {
    identity: 'A123456(7)',
    email: 'admin@voting.io',
    remark: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    identity: 'A123456(7)',
    email: 'normal@voting.io',
    remark: '',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const seedDB = async () => {
  await User.insertMany(users);
};

seedDB();
