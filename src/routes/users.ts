import { Router } from 'express';
import { body } from 'express-validator';
import * as usersController from '../controllers/users';

const router = Router();

router.post(
  '/api/users/signup',
  [
    body('identity')
      .matches(/^[A-Z]{1,2}[0-9]{6}\([0-9A]\)$/)
      .withMessage('Identity must be valid.'),
    body('email').isEmail().withMessage('Email must be valid.'),
  ],
  usersController.signup
);
router.post('/api/users/signin', usersController.signin);
router.post('/api/users/signout', usersController.signout);
router.get('/api/users/currentuser', usersController.currentUser);

export { router as usersRouter };
