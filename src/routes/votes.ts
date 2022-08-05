import { Router } from 'express';
import * as votesController from '../controllers/votes';
import { body } from 'express-validator';
import { auth } from '../middlewares/auth';
import { adminAuthorization } from '../middlewares/adminAuthorization';

const router = Router();

router.post(
  '/api/votes/',
  auth,
  [
    body('pollId').trim().notEmpty().withMessage('pollId must be valid'),
    body('optionId').trim().notEmpty().withMessage('optionId must be valid'),
  ],
  votesController.addVote
);
router.get(
  '/api/votes/result/:id',
  auth,
  adminAuthorization,
  votesController.getVoteResult
);
router.get('/api/votes/current/:id', auth, votesController.getCurrentVotes);
router.get(
  '/api/votes/:id',
  auth,
  adminAuthorization,
  votesController.getVoteById
);
router.get(
  '/api/votes/',
  auth,
  adminAuthorization,
  votesController.listVotesByPollId
);

export { router as votesRouter };
