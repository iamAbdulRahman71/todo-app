const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const TodoList = require('../models/TodoList');
const TodoListItem = require('../models/TodoListItem');

// GET /api/todos - Get all todo lists for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const lists = await TodoList.find({ user: req.user.id }).populate('items');
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/todos - Create a new todo list
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const newList = new TodoList({
      name,
      user: req.user.id,
      items: []
    });
    const list = await newList.save();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/todos/:id - Update list details (e.g., name)
router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;
  try {
    let list = await TodoList.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    list.name = name;
    list = await list.save();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/todos/:id - Delete a todo list and its items
router.delete('/:id', auth, async (req, res) => {
  try {
    const list = await TodoList.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // Delete all associated items
    await TodoListItem.deleteMany({ list: list._id });
    await list.remove();
    res.json({ message: 'List removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/todos/:listId/items - Add a new item to a list
router.post('/:listId/items', auth, async (req, res) => {
  const { title, detail } = req.body;
  try {
    let list = await TodoList.findById(req.params.listId);
    if (!list) return res.status(404).json({ message: 'List not found' });
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const newItem = new TodoListItem({
      title,
      detail,
      list: list._id
    });
    const item = await newItem.save();
    list.items.push(item._id);
    await list.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/todos/:listId/items/:itemId - Edit a list item
router.put('/:listId/items/:itemId', auth, async (req, res) => {
  const { title, detail } = req.body;
  try {
    let list = await TodoList.findById(req.params.listId);
    if (!list) return res.status(404).json({ message: 'List not found' });
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    let item = await TodoListItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.title = title || item.title;
    item.detail = detail || item.detail;
    item = await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/todos/:listId/items/:itemId - Delete a list item
router.delete('/:listId/items/:itemId', auth, async (req, res) => {
  try {
    let list = await TodoList.findById(req.params.listId);
    if (!list) return res.status(404).json({ message: 'List not found' });
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const item = await TodoListItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.remove();
    // Remove item reference from the list
    list.items = list.items.filter(i => i.toString() !== req.params.itemId);
    await list.save();
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
