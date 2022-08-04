import { Router } from 'express';
import * as optionController from '../controllers/options';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/api/options', auth, optionController.addOption);

export { router as optionRouter };
