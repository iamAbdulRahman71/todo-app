// frontend/src/tests/TodoItem.test.jsx
import { render, screen } from '@testing-library/react';
import TodoItem from '../components/TodoItem';

test('renders todo title', () => {
  const todo = { title: 'Sample Todo', detail: 'Details', dateAdded: new Date() };
  render(<TodoItem todo={todo} onEdit={() => {}} onDelete={() => {}} />);
  expect(screen.getByText(/Sample Todo/i)).toBeInTheDocument();
});
