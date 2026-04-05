import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Tab, Nav } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const LegalCMS = () => {
    const router = useRouter();
    const { tab } = router.query;
    
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPage, setSelectedPage] = useState(null);
    const [sections, setSections] = useState([]);
    const [activeTab, setActiveTab] = useState('privacy');

    useEffect(() => {
        if (tab && ['privacy', 'terms', 'refund-cancellation', 'refund-policy'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [tab]);

    const [showSectionModal, setShowSectionModal] = useState(false);
    const [pageForm, setPageForm] = useState({ id: null, page_type: '', label: '', title: '', last_updated: '', is_active: 1 });
    const [sectionForm, setSectionForm] = useState({ id: null, page_id: null, heading: '', content: '', sort_order: 0, is_active: 1 });

    const fetchPageDetails = useCallback(async (type) => {
        try {
            const res = await fetchApi(`/admin/pages/legal/${type}`);
            if (res?.success) {
                setSelectedPage(res.data.page);
                setSections(res.data.sections);
                setPageForm(res.data.page);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch page details.');
        }
    }, []);

    const fetchLegalPages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/pages/legal');
            if (res?.success) {
                setPages(res.data);
                if (res.data.length > 0) {
                    const matchedPage = res.data.find(p => p.page_type === activeTab);
                    if (matchedPage) fetchPageDetails(matchedPage.page_type);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch legal pages index.');
        } finally {
            setLoading(false);
        }
    }, [activeTab, fetchPageDetails]);

    useEffect(() => { fetchLegalPages(); }, [fetchLegalPages]);

    useEffect(() => {
        if (pages.length > 0) fetchPageDetails(activeTab);
    }, [activeTab, pages, fetchPageDetails]);

    const handlePageSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi(`/admin/pages/legal/${pageForm.id}`, { method: 'PUT', body: JSON.stringify(pageForm) });
            alert("Page settings updated!");
            fetchLegalPages();
        } catch (error) { alert("Failed to save page settings."); }
    };

    const handleSectionShow = (item = null) => {
        setSectionForm(item ? item : { id: null, page_id: selectedPage.id, heading: '', content: '', sort_order: 0, is_active: 1 });
        setShowSectionModal(true);
    };

    const handleSectionSubmit = async (e) => {
        e.preventDefault();
        try {
            if (sectionForm.id) {
                await fetchApi(`/admin/pages/legal/sections/${sectionForm.id}`, { method: 'PUT', body: JSON.stringify(sectionForm) });
            } else {
                await fetchApi('/admin/pages/legal/sections', { method: 'POST', body: JSON.stringify(sectionForm) });
            }
            setShowSectionModal(false);
            fetchPageDetails(activeTab);
        } catch (error) { alert("Failed to save legal section."); }
    };

    const handleSectionDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetchApi(`/admin/pages/legal/sections/${id}`, { method: 'DELETE' });
            fetchPageDetails(activeTab);
        } catch (error) { alert("Failed to delete legal section."); }
    };


    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">Legal Pages Management</h2>

            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item><Nav.Link eventKey="privacy">Privacy Policy</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="terms">Terms of Service</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="refund-cancellation">Refund & Cancellation</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="refund-policy">Refund Policy</Nav.Link></Nav.Item>
                </Nav>

                <Tab.Content>
                    {loading ? (
                        <div className="py-5">
                            <LoadingSpinner text="Retrieving legal documents..." />
                        </div>
                    ) : (
                        <Tab.Pane eventKey={activeTab}>
                            {selectedPage && (
                                <>
                                    <Card className="mb-4">
                                        <Card.Header className="bg-primary text-white">
                                            <h5 className="mb-0">Settings for {selectedPage.title}</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Form onSubmit={handlePageSubmit}>
                                                <Row>
                                                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Badge Label</Form.Label><Form.Control type="text" value={pageForm.label} onChange={e => setPageForm({...pageForm, label: e.target.value})} /></Form.Group></Col>
                                                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Main Page Title</Form.Label><Form.Control type="text" value={pageForm.title} onChange={e => setPageForm({...pageForm, title: e.target.value})} /></Form.Group></Col>
                                                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Last Updated Date</Form.Label><Form.Control type="text" value={pageForm.last_updated} onChange={e => setPageForm({...pageForm, last_updated: e.target.value})} /></Form.Group></Col>
                                                </Row>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <Form.Check type="switch" label="Page Active & Visible" checked={pageForm.is_active === 1} onChange={e => setPageForm({...pageForm, is_active: e.target.checked ? 1 : 0})} />
                                                    <Button type="submit" variant="primary">Update Page Settings</Button>
                                                </div>
                                            </Form>
                                        </Card.Body>
                                    </Card>

                                    <Card>
                                        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Page Sections</h5>
                                            <Button variant="light" size="sm" onClick={() => handleSectionShow()}>Add Content Section</Button>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table hover responsive>
                                                <thead className="table-light">
                                                    <tr><th>Sort</th><th>Heading</th><th>Content Preview</th><th>Status</th><th>Actions</th></tr>
                                                </thead>
                                                <tbody>
                                                    {sections.map(s => (
                                                        <tr key={s.id}>
                                                            <td>{s.sort_order}</td>
                                                            <td>{s.heading}</td>
                                                            <td className="text-truncate" style={{maxWidth: '400px'}}>{s.content}</td>
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
                                </>
                            )}
                        </Tab.Pane>
                    )}
                </Tab.Content>
            </Tab.Container>

            {/* Legal Section Modal */}
            <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)}>
                <Modal.Header closeButton><Modal.Title>{sectionForm.id ? 'Edit' : 'Add'} Legal Section</Modal.Title></Modal.Header>
                <Form onSubmit={handleSectionSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Heading</Form.Label>
                            <Form.Control type="text" value={sectionForm.heading} onChange={e => setSectionForm({...sectionForm, heading: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Sort Order</Form.Label>
                            <Form.Control type="number" value={sectionForm.sort_order} onChange={e => setSectionForm({...sectionForm, sort_order: parseInt(e.target.value)})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Content Body</Form.Label>
                            <Form.Control as="textarea" rows={8} value={sectionForm.content} onChange={e => setSectionForm({...sectionForm, content: e.target.value})} required />
                        </Form.Group>
                        <Form.Check type="switch" label="Active" checked={sectionForm.is_active === 1} onChange={e => setSectionForm({...sectionForm, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSectionModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Content</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default LegalCMS;
