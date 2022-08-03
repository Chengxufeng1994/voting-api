import { Router } from 'express';
import * as activitiesController from '../controllers/activities';

const router = Router();

router.post('/api/activities/', activitiesController.addActivity);

export { router as activitiesRouter };
