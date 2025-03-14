import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Form, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api';

function TodoLists() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState('');

  const fetchLists = async () => {
    try {
      const res = await api.get('/todos');
      setLists(res.data);
    } catch (err) {
      setError('Failed to fetch lists');
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    try {
      const res = await api.post('/todos', { name: newListName });
      setLists([...lists, res.data]);
      setNewListName('');
      setShowModal(false);
    } catch (err) {
      setError('Failed to add list');
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setLists(lists.filter(list => list._id !== id));
    } catch (err) {
      setError('Failed to delete list');
    }
  };

  return (
    <div>
      <h2>Your Todo Lists</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Add New List
      </Button>
      <ListGroup>
        {lists.map(list => (
          <ListGroup.Item key={list._id}>
            <div className="d-flex justify-content-between align-items-center">
              <Link to={`/list/${list._id}`}>{list.name}</Link>
              <Button variant="danger" size="sm" onClick={() => handleDeleteList(list._id)}>
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formListName">
              <Form.Label>List Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter list name" 
                value={newListName} 
                onChange={(e) => setNewListName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddList}>
            Add List
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TodoLists;
