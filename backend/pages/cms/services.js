import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ServicesCMS = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const defaultData = { id: null, icon: '', title: '', description: '', points: '[]' };
    const [formData, setFormData] = useState(defaultData);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await fetchApi('/admin/services');
            setServices(data?.services || []);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch services.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setFormData(defaultData);
    };

    const handleShow = (item = null) => {
        if (item) {
            setFormData(item);
        } else {
            setFormData(defaultData);
        }
        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await fetchApi(`/admin/services/${formData.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData),
                });
            } else {
                await fetchApi('/admin/services', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
            }
            handleClose();
            fetchServices();
        } catch (error) {
            alert(error.message || 'Failed to save service.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await fetchApi(`/admin/services/${id}`, { method: 'DELETE' });
            fetchServices();
        } catch (error) {
            alert(error.message || 'Failed to delete service.');
        }
    };

    return (
        <Container fluid className="px-6 py-4">
            <Row className="mb-4">
                <Col className="d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Services Management</h2>
                    <Button variant="primary" onClick={() => handleShow()}>Add New Service</Button>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            {loading ? (
                                <LoadingSpinner text="Loading services..." fluid={false} />
                            ) : (
                                <Table responsive hover>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Icon</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Points (JSON)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.length === 0 ? (
                                            <tr><td colSpan="5">No services found.</td></tr>
                                        ) : services.map(item => (
                                            <tr key={item.id}>
                                                <td><i className={item.icon} style={{ fontSize: '1.5rem'}}></i> ({item.icon})</td>
                                                <td>{item.title}</td>
                                                <td className="text-truncate" style={{ maxWidth: '200px' }}>{item.description}</td>
                                                <td className="text-truncate" style={{ maxWidth: '150px' }}>{item.points}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => handleShow(item)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{formData.id ? 'Edit Service' : 'Add New Service'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Icon Class</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="icon" 
                                required 
                                value={formData.icon} 
                                onChange={handleChange} 
                                placeholder="e.g. ti-layout-grid2" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title" 
                                required 
                                value={formData.title} 
                                onChange={handleChange} 
                                placeholder="e.g. Graphic Design" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                name="description" 
                                required 
                                value={formData.description} 
                                onChange={handleChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Points (JSON Array)</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={2}
                                name="points" 
                                value={formData.points} 
                                onChange={handleChange} 
                                placeholder='["Logo Design", "Branding"]'
                            />
                            <Form.Text className="text-muted">Must be a valid JSON array of strings.</Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Service</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ServicesCMS;
