const mongoose = require('mongoose');

const TodoListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TodoListItem' }]
});

module.exports = mongoose.model('TodoList', TodoListSchema);
