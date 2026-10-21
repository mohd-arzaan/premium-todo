const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Saare routes protect hain (login zaroori hai)
router.use(protect);

// 1. GET: Saare tasks fetch karo (us user ke)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 2. POST: Naya task banao
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title likhna zaroori hai' });
    }

    const task = await Task.create({
      user: req.user._id, // Middleware se aaya hai
      title,
      description,
      priority,
      category,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3. PUT: Task update karo (Edit, Complete, etc.)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task nahi mila' });
    }

    // Check karo ki task usi user ka hai
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Yeh task aapka nahi hai' });
    }

    // Update karo
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Updated document return kare
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4. DELETE: Task delete karo
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task nahi mila' });
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Yeh task aapka nahi hai' });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Task delete ho gaya' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;