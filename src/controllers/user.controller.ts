import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.model';
import { DataItem } from '../models/data.model';
import CacheService from '../services/cache.service';
import MessageService from '../services/message.service';

// In-memory DB
let users: User[] = [];
let dataItems: DataItem[] = [
  { id: '1', content: 'Sample Data 1', ownerId: 'admin-user-id' },
];

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: uuidv4(), username, password: hashedPassword, role };
  users.push(newUser);

  // Publish message to RabbitMQ
  await MessageService.publishWelcomeMessage(newUser.id);

  res.status(201).json({ message: 'User registered', userId: newUser.id });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

export const getData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  // Check cache
  const cachedData = await CacheService.get(`data:${id}`);
  if (cachedData) {
    const data: DataItem = JSON.parse(cachedData);
    if (role !== 'admin' && data.ownerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    return res.json(data);
  }

  // Fetch from DB
  const data = dataItems.find(d => d.id === id);
  if (!data) return res.status(404).json({ message: 'Data not found' });

  if (role !== 'admin' && data.ownerId !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Cache it
  await CacheService.set(`data:${id}`, JSON.stringify(data), 3600);

  res.json(data);
};