import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, Card, Col, Form, Modal, ProgressBar, Row } from 'react-bootstrap';
import { fetchApi } from '../utils/api';

const MediaGallery = ({ show, onHide, onSelect }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ photo: null, storage_provider: 'imagekit', username: 'admin' });

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/admin/dms/media');
      if (res?.success) setMedia(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (show) fetchMedia(); }, [show]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.photo) return alert("Select a file first.");
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', uploadForm.photo);
      formData.append('storage_provider', uploadForm.storage_provider);
      formData.append('username', uploadForm.username);

      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dms/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        fetchMedia();
        setUploadForm({ ...uploadForm, photo: null });
      } else alert(result.message || "Upload failed.");
    } catch (error) { console.error(error); }
    finally { setUploading(false); }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable>
      <Modal.Header closeButton><Modal.Title>Media Gallery</Modal.Title></Modal.Header>
      <Modal.Body className="bg-light p-4">
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleUpload} className="d-flex gap-3 align-items-end">
              <Form.Group className="flex-grow-1"><Form.Label className="small">Quick Upload</Form.Label><Form.Control type="file" size="sm" onChange={e => setUploadForm({ ...uploadForm, photo: e.target.files[0] })} required accept="image/*" /></Form.Group>
              <Button type="submit" variant="primary" size="sm" disabled={uploading}>{uploading ? '...' : 'Upload'}</Button>
            </Form>
            {uploading && <ProgressBar animated now={100} className="mt-2" style={{ height: '3px' }} />}
          </Card.Body>
        </Card>

        {loading ? <p>Loading media...</p> : (
          <Row>
            {media.map(item => (
              <Col key={item.id} xs={4} md={3} lg={2} className="mb-3">
                <Card
                  className="h-100 shadow-sm border-0 cursor-pointer hover-shadow"
                  onClick={() => onSelect(item.path)}
                  style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                >
                  <div style={{ aspectRatio: '1/1', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                    <Image 
                      src={item.path} 
                      alt={item.file_name} 
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized 
                    />
                  </div>
                  <Card.Body className="p-1 px-2">
                    <p className="text-truncate x-small mb-0" style={{ fontSize: '10px' }}>{item.file_name}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer><Button variant="secondary" onClick={onHide}>Close</Button></Modal.Footer>
    </Modal>
  );
};

export default MediaGallery;
