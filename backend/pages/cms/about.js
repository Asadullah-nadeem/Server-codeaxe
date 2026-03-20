import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';

const AboutCMS = () => {
    const [data, setData] = useState({ header: {}, sections: [] });
    const [loading, setLoading] = useState(true);
    
    // modal states
    const [showSectionModal, setShowSectionModal] = useState(false);
    
    // form states
    const [headerForm, setHeaderForm] = useState({ label: '', title: '', description: '', cta_label: '', cta_link: '', is_active: 1 });
    const [sectionForm, setSectionForm] = useState({ id: null, title: '', content: '', sort_order: 0, is_active: 1 });

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/pages/about');
            if (res?.success) {
                setData(res.data);
                setHeaderForm(res.data.header || { label: '', title: '', description: '', cta_label: '', cta_link: '', is_active: 1 });
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch about data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAboutData(); }, []);

    const handleHeaderSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/pages/about/header', { method: 'PUT', body: JSON.stringify(headerForm) });
            alert("About header updated!");
            fetchAboutData();
        } catch (error) { alert("Failed to save header."); }
    };

    const handleSectionShow = (item = null) => {
        setSectionForm(item ? item : { id: null, title: '', content: '', sort_order: 0, is_active: 1 });
        setShowSectionModal(true);
    };

    const handleSectionSubmit = async (e) => {
        e.preventDefault();
        try {
            if (sectionForm.id) {
                await fetchApi(`/admin/pages/about/sections/${sectionForm.id}`, { method: 'PUT', body: JSON.stringify(sectionForm) });
            } else {
                await fetchApi('/admin/pages/about/sections', { method: 'POST', body: JSON.stringify(sectionForm) });
            }
            setShowSectionModal(false);
            fetchAboutData();
        } catch (error) { alert("Failed to save section."); }
    };

    const handleSectionDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this section?')) return;
        try {
            await fetchApi(`/admin/pages/about/sections/${id}`, { method: 'DELETE' });
            fetchAboutData();
        } catch (error) { alert("Failed to delete section."); }
    };

    if (loading) return <Container fluid className="p-4"><p>Loading about settings...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">About Us - Management</h2>

            <Card className="mb-4">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Page Header & Intro</h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleHeaderSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Badge Label</Form.Label>
                                    <Form.Control type="text" value={headerForm.label} onChange={e => setHeaderForm({...headerForm, label: e.target.value})} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Main Title</Form.Label>
                                    <Form.Control type="text" value={headerForm.title} onChange={e => setHeaderForm({...headerForm, title: e.target.value})} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Intro Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={headerForm.description} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} required />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CTA Button Label</Form.Label>
                                    <Form.Control type="text" value={headerForm.cta_label} onChange={e => setHeaderForm({...headerForm, cta_label: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CTA Button Link</Form.Label>
                                    <Form.Control type="text" value={headerForm.cta_link} onChange={e => setHeaderForm({...headerForm, cta_link: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary">Save Header Settings</Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">About Sections</h5>
                    <Button variant="light" size="sm" onClick={() => handleSectionShow()}>Add New Section</Button>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead className="table-light">
                            <tr>
                                <th>Sort</th>
                                <th>Title</th>
                                <th>Content Sneak Peek</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.sections.map(s => (
                                <tr key={s.id}>
                                    <td>{s.sort_order}</td>
                                    <td>{s.title}</td>
                                    <td className="text-truncate" style={{maxWidth: '300px'}}>{s.content}</td>
                                    <td><span className={`badge bg-${s.is_active ? 'success' : 'secondary'}`}>{s.is_active ? 'Active' : 'Hidden'}</span></td>
                                    <td>
                                        <Button size="sm" variant="info" className="me-2" onClick={() => handleSectionShow(s)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleSectionDelete(s.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Section Modal */}
            <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)}>
                <Modal.Header closeButton><Modal.Title>{sectionForm.id ? 'Edit' : 'Add'} About Section</Modal.Title></Modal.Header>
                <Form onSubmit={handleSectionSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Section Title</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Our Mission" value={sectionForm.title} onChange={e => setSectionForm({...sectionForm, title: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Sort Order</Form.Label>
                            <Form.Control type="number" value={sectionForm.sort_order} onChange={e => setSectionForm({...sectionForm, sort_order: parseInt(e.target.value)})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" rows={6} value={sectionForm.content} onChange={e => setSectionForm({...sectionForm, content: e.target.value})} required />
                        </Form.Group>
                        <Form.Check type="switch" label="Active" checked={sectionForm.is_active === 1} onChange={e => setSectionForm({...sectionForm, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSectionModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Section</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AboutCMS;
