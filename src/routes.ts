import { Router, Request, Response } from 'express';
import { getCurrentInvoke } from '@codegenie/serverless-express';

const router = Router();

// User type
type User = {
  id: number;
  name: string;
};

// Ephemeral in-memory data store
const users: User[] = [
  { id: 1, name: 'Stejin' },
  { id: 2, name: 'Vibin' }
];
let userIdCounter = users.length;

const getUser = (userId: string): User | undefined =>
  users.find(u => u.id === parseInt(userId));
const getUserIndex = (userId: string): number =>
  users.findIndex(u => u.id === parseInt(userId));

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

router.get('/api/users', (req: Request, res: Response): void => {
  res.json(users);
});

router.get('/api/users/:userId', (req: Request, res: Response): void => {
  const user = getUser(req.params.userId);
  if (!user) {
    res.status(404).json({});
    return;
  }
  res.json(user);
});

router.post('/api/users', (req: Request, res: Response): void => {
  const user: User = {
    id: ++userIdCounter,
    name: req.body.name
  };
  users.push(user);
  res.status(201).json(user);
});

router.put('/api/users/:userId', (req: Request, res: Response): void => {
  const user = getUser(req.params.userId);
  if (!user) {
    res.status(404).json({});
    return;
  }
  user.name = req.body.name;
  res.json(user);
});

router.delete('/api/users/:userId', (req: Request, res: Response): void => {
  const userIndex = getUserIndex(req.params.userId);
  if (userIndex === -1) {
    res.status(404).json({});
    return;
  }
  users.splice(userIndex, 1);
  res.json(users);
});

router.get('/api/cookie', (req: Request, res: Response): void => {
  res.cookie('Foo', 'bar');
  res.cookie('Fizz', 'buzz');
  res.json({});
});

export default router;