import { Router } from 'express';
import { body } from 'express-validator';
import * as pollsController from '../controllers/polls';
import { auth } from '../middlewares/auth';
import { adminAuthorization } from '../middlewares/adminAuthorization';

const router = Router();

router.post(
  '/api/polls/',
  auth,
  [body('topic').notEmpty().withMessage('topic must be valid')],
  pollsController.createPoll
);
router.get('/api/polls/all', auth, pollsController.listAllPolls);
router.get('/api/polls/:id', auth, pollsController.getPollById);
router.post(
  '/api/polls/start/:id',
  auth,
  adminAuthorization,
  pollsController.startPoll
);
router.post(
  '/api/polls/stop/:id',
  auth,
  adminAuthorization,
  pollsController.stopPoll
);

export { router as pollsRouter };
