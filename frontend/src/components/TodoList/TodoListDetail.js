import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Form, ListGroup, Modal, Alert } from 'react-bootstrap';
import api from '../../api';

function TodoListDetail() {
  const { id } = useParams();
  const history = useHistory();
  const [list, setList] = useState(null);
  const [newItem, setNewItem] = useState({ title: '', detail: '' });
  const [showModal, setShowModal] = useState(false);
  const [editListName, setEditListName] = useState('');
  const [error, setError] = useState('');

  // Fetch the list and its items from the dashboard endpoint
  const fetchList = async () => {
    try {
      const res = await api.get('/todos');
      const foundList = res.data.find(l => l._id === id);
      if (!foundList) {
        setError('List not found');
      } else {
        setList(foundList);
        setEditListName(foundList.name);
      }
    } catch (err) {
      setError('Failed to fetch list details');
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, [id]);

  const handleAddItem = async () => {
    if (!newItem.title.trim()) return;
    try {
      const res = await api.post(`/todos/${id}/items`, newItem);
      setList({ ...list, items: [...list.items, res.data] });
      setNewItem({ title: '', detail: '' });
    } catch (err) {
      setError('Failed to add item');
    }
  };

  const handleEditListName = async () => {
    try {
      const res = await api.put(`/todos/${id}`, { name: editListName });
      setList({ ...list, name: res.data.name });
      setShowModal(false);
    } catch (err) {
      setError('Failed to update list name');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/todos/${id}/items/${itemId}`);
      setList({ ...list, items: list.items.filter(item => item._id !== itemId) });
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {list ? (
        <>
          <h2>{list.name}</h2>
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            Edit List Name
          </Button>
          <hr />
          <h4>Add New Item</h4>
          <Form>
            <Form.Group controlId="formItemTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter item title" 
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formItemDetail" className="mb-3">
              <Form.Label>Detail</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter item detail" 
                value={newItem.detail}
                onChange={(e) => setNewItem({ ...newItem, detail: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddItem}>
              Add Item
            </Button>
          </Form>
          <hr />
          <h4>Items</h4>
          {list.items && list.items.length > 0 ? (
            <ListGroup>
              {list.items.map(item => (
                <ListGroup.Item key={item._id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                      <small>{new Date(item.dateAdded).toLocaleString()}</small>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item._id)}>
                      Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No items found.</p>
          )}

          {/* Modal for editing list name */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit List Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="editListName">
                  <Form.Label>List Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleEditListName}>Save Changes</Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <p>Loading list details...</p>
      )}
      <Button variant="secondary" className="mt-3" onClick={() => history.push('/dashboard')}>
        Back to Dashboard
      </Button>
    </div>
  );
}

export default TodoListDetail;
