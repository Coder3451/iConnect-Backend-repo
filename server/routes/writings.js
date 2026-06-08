import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Writing } from '../models/Writing.js';

const router = Router();

router.use(requireAuth);

const DEFAULT_TEMPLATE = {
  time: Date.now(),
  blocks: [
    {
      type: 'header',
      data: { text: 'Start here', level: 2 },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Keep it short. One clear idea per section. No noise — just what matters.',
      },
    },
    {
      type: 'toggle',
      data: {
        title: 'Key point',
        body: 'Write the simplest version of this idea.',
      },
    },
    {
      type: 'list',
      data: {
        style: 'unordered',
        items: ['First clear step', 'Second clear step'],
      },
    },
  ],
};

router.get('/', async (req, res) => {
  try {
    const writings = await Writing.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt');

    res.json({ writings });
  } catch (err) {
    console.error('List writings:', err);
    res.status(500).json({ error: 'Failed to load writings' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    const writing = await Writing.create({
      userId: req.user._id,
      title: typeof title === 'string' && title.trim() ? title.trim() : 'Untitled',
      content: DEFAULT_TEMPLATE,
    });

    res.status(201).json({ writing });
  } catch (err) {
    console.error('Create writing:', err);
    res.status(500).json({ error: 'Failed to create writing' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const writing = await Writing.findOne({ _id: req.params.id, userId: req.user._id });
    if (!writing) {
      return res.status(404).json({ error: 'Writing not found' });
    }
    res.json({ writing });
  } catch (err) {
    console.error('Get writing:', err);
    res.status(500).json({ error: 'Failed to load writing' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const update = {};

    if (typeof title === 'string' && title.trim()) {
      update.title = title.trim();
    }
    if (content && typeof content === 'object' && Array.isArray(content.blocks)) {
      update.content = content;
    }

    const writing = await Writing.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: update },
      { new: true }
    );

    if (!writing) {
      return res.status(404).json({ error: 'Writing not found' });
    }

    res.json({ writing });
  } catch (err) {
    console.error('Update writing:', err);
    res.status(500).json({ error: 'Failed to save writing' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Writing.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) {
      return res.status(404).json({ error: 'Writing not found' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete writing:', err);
    res.status(500).json({ error: 'Failed to delete writing' });
  }
});

export default router;
