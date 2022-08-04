import { Router } from 'express';
import * as usersController from '../controllers/users';

const router = Router();

router.post('/api/users/signup', usersController.signup);
router.post('/api/users/signin', usersController.signin);
router.post('/api/users/signout', usersController.signout);
router.get('/api/users/currentuser', usersController.currentUser);

export { router as usersRouter };
