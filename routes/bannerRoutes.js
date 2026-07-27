import express from 'express';
import Banner from '../models/Banner.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.json(banners);
});

router.post('/', async (req, res) => {
  const banner = await Banner.create({ imageUrl: req.body.imageUrl });
  res.status(201).json(banner);
});

router.delete('/:id', async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;