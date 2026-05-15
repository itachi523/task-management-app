const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

module.exports = function(io) {
  // Get all tasks for user
  router.get('/', auth, async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.json(tasks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // Add task
  router.post('/', auth, async (req, res) => {
    const { title, description, status } = req.body;
    try {
      const newTask = new Task({
        title,
        description,
        status: status || 'To Do',
        user: req.user.id
      });
      const task = await newTask.save();
      io.emit('taskUpdated', { type: 'CREATE', task });
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // Update task
  router.put('/:id', auth, async (req, res) => {
    const { title, description, status } = req.body;
    try {
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: 'Task not found' });
      if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status || task.status;

      task = await task.save();
      io.emit('taskUpdated', { type: 'UPDATE', task });
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // Delete task
  router.delete('/:id', auth, async (req, res) => {
    try {
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: 'Task not found' });
      if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

      await Task.findByIdAndDelete(req.params.id);
      io.emit('taskUpdated', { type: 'DELETE', taskId: req.params.id });
      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  return router;
};
