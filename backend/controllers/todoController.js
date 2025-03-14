// backend/controllers/todoController.js
const Todo = require('../models/TodoListItem.js');

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

exports.addTodo = async (req, res) => {
  try {
    const { title, detail } = req.body;
    const newTodo = await Todo.create({ title, detail, user: req.user.id });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding todo', error });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: req.user.id });
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
};
