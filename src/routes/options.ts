import { Router } from 'express';
import { body } from 'express-validator';
import * as optionController from '../controllers/options';
import { adminAuthorization } from '../middlewares/adminAuthorization';
import { auth } from '../middlewares/auth';

const router = Router();

router.post(
  '/api/options',
  auth,
  adminAuthorization,
  [body('option').trim().notEmpty().withMessage("Option must be valid")],
  optionController.addOption
);
router.get('/api/options/list', auth, optionController.listAllOptions);

export { router as optionRouter };
