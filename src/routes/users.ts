import { Router } from 'express';
import * as usersController from '../controllers/users';
import { currentUser } from '../middlewares/current-user';

const router = Router();

router.post('/api/users/signup', usersController.signup);
router.post('/api/users/signin', usersController.signin);
router.post('/api/users/signout', usersController.signout);
router.get('/api/users/currentuser', currentUser, usersController.currentUser);

export { router as usersRouter };
