const mongoose = require('mongoose');

const TodoListItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  detail: { type: String },
  dateAdded: { type: Date, default: Date.now },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'TodoList', required: true }
});

module.exports = mongoose.model('TodoListItem', TodoListItemSchema);
