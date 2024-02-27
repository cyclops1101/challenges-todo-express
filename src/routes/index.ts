import { Router } from 'express';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import taskRoutes from './task.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/task', taskRoutes);

export default router;