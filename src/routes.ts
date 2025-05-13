import { Router, Request, Response } from 'express';
import { getCurrentInvoke } from '@codegenie/serverless-express';
import { healthEndpoint } from './libs/health';

const router = Router();

// Middleware
router.use((require('express')).json());
router.use((require('express')).urlencoded({ extended: true }));

// Routes
router.get('/api', (req: Request, res: Response): void => {
  const currentInvoke = getCurrentInvoke();
  const { event = {} } = currentInvoke;
  const { requestContext = {} } = event as any;
  const { domainName = 'localhost:7071' } = requestContext as any;
  const apiUrl = `https://${domainName}`;
  res.render('index', { apiUrl });
});

router.get('/api/data-direct/health', async (req: Request, res: Response): Promise<void> => {
  const health = await healthEndpoint();
  res.json(health)
});

export default router;