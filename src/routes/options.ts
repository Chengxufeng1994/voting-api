import { Router } from 'express';
import * as optionController from '../controllers/options';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/api/options', auth, optionController.addOption);
router.get('/api/options/list', auth, optionController.listAllOptions);

export { router as optionRouter };
