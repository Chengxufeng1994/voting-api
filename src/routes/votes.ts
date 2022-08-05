import { Router } from 'express';
import * as votesController from '../controllers/votes';

const router = Router();

router.post('/api/votes/', votesController.addVote);
router.get('/api/votes/result/:id', votesController.getVoteResult);
router.get('/api/votes/current/:id', votesController.getCurrentVotes);
router.get('/api/votes/:id', votesController.getVoteById);
router.get('/api/votes/', votesController.listVotesByPollId);

export { router as votesRouter };
