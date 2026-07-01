import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Container, Spinner, Alert } from 'react-bootstrap';
import type { Track } from './TrackCard';
import { useTheme } from '../context/ThemeContext';
import { getTracks, createTrack, updateTrack, deleteTrack } from '../services/trackService';

const AdminTable: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState<Track>({
    id: 0,
    title: '',
    artist: '',
    image: '/assets/album_cover.png',
    price: 0,
    originalPrice: 0,
    stock: 0,
    category: 'Electronic'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTracks();
      setTracks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tracks. Please check json-server.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({ id: 0, title: '', artist: '', image: '/assets/album_cover.png', price: 0, originalPrice: 0, stock: 0, category: 'Electronic' });
  };

  const handleShowAdd = () => {
    setIsEditing(false);
    setFormData({ id: 0, title: '', artist: '', image: '/assets/album_cover.png', price: 0, originalPrice: 0, stock: 0, category: 'Electronic' });
    setShowModal(true);
  };

  const handleShowEdit = (track: Track) => {
    setIsEditing(true);
    setFormData({ ...track });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this track?")) {
      try {
        await deleteTrack(id);
        setTracks(tracks.filter(t => t.id !== id));
      } catch (err) {
        alert('Failed to delete track. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await updateTrack(formData.id, formData);
        setTracks(tracks.map(t => t.id === updated.id ? updated : t));
      } else {
        const { id, ...rest } = formData;
        const created = await createTrack(rest as Omit<Track, 'id'>);
        setTracks([...tracks, created]);
      }
      handleClose();
    } catch (err) {
      alert('Failed to save track.');
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={isDark ? "text-light m-0" : "text-dark m-0"}>Admin Dashboard</h2>
        <Button variant="primary" onClick={handleShowAdd}>+ Add New Track</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive rounded border border-secondary">
        <Table striped bordered hover variant={isDark ? "dark" : undefined} className="m-0 align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cover</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </td>
              </tr>
            ) : tracks.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-secondary">No tracks available.</td>
              </tr>
            ) : (
              tracks.map(track => (
                <tr key={track.id}>
                  <td>{track.id}</td>
                  <td>
                    <img src={track.image} alt={track.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td className="fw-semibold">{track.title}</td>
                  <td>{track.artist}</td>
                  <td><Badge bg="info">{track.category}</Badge></td>
                  <td>${track.price.toFixed(2)}</td>
                  <td>
                    <Badge bg={track.stock > 0 ? 'success' : 'danger'}>
                      {track.stock > 0 ? track.stock : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant={isDark ? "outline-light" : "outline-dark"} size="sm" className="me-2" onClick={() => handleShowEdit(track)}>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(track.id)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={handleClose} data-bs-theme={isDark ? "dark" : "light"} className={isDark ? "text-light" : "text-dark"}>
        <Modal.Header closeButton className="border-secondary border-bottom">
          <Modal.Title>{isEditing ? 'Edit Track' : 'Add New Track'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Artist</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.artist}
                onChange={e => setFormData({...formData, artist: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Electronic">Electronic</option>
                <option value="Synthwave">Synthwave</option>
                <option value="Lo-Fi">Lo-Fi</option>
                <option value="Ambient">Ambient</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Jazz">Jazz</option>
              </Form.Select>
            </Form.Group>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control 
                    type="number" 
                    required 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-secondary border-top">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Save Changes' : 'Add Track'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminTable;
