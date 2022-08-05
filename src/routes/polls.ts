import { Router } from 'express';
import * as pollsController from '../controllers/polls';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/api/polls/', auth, pollsController.createPoll);
router.get('/api/polls/all', auth, pollsController.listAllPolls);
router.get('/api/polls/:id', auth, pollsController.getPollById);
router.post('/api/polls/start/:id', auth, pollsController.startPoll);
router.post('/api/polls/stop/:id', auth, pollsController.stopPoll);

export { router as pollsRouter };
