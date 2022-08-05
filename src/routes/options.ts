import { Router } from 'express';
import * as optionController from '../controllers/options';
import { adminAuthorization } from '../middlewares/adminAuthorization';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/api/options', auth, adminAuthorization, optionController.addOption);
router.get('/api/options/list', auth, optionController.listAllOptions);

export { router as optionRouter };
