import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Badge, Tab, Nav, Accordion, ListGroup } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import MediaGallery from '../../components/MediaGallery';
import useMounted from 'hooks/useMounted';

const EmailTemplatesCMS = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const hasMounted = useMounted();
    
    // Modals
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);

    // Forms
    const [templateForm, setTemplateForm] = useState({ id: null, template_key: '', subject: '', headline: '', body_html: '', footer_text: '', brand_color: '#0a0a0a', accent_color: '#3b82f6', logo_url: '', is_active: 1 });
    const [sectionForm, setSectionForm] = useState({ id: null, template_id: null, section_name: '', content: '', sort_order: 0, is_active: 1 });

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/email/templates');
            if (res?.success) {
                setTemplates(res.data);
                if (res.data.length > 0 && !selectedTemplate) {
                    handleSelectTemplate(res.data[0]);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch templates.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTemplate = async (template) => {
        setSelectedTemplate(template);
        try {
            const res = await fetchApi(`/admin/email/templates/${template.id}`);
            if (res?.success) {
                setSections(res.data.sections);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchTemplates(); }, []);

    const handleTemplateSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = templateForm.id ? 'PUT' : 'POST';
            const url = templateForm.id ? `/admin/email/templates/${templateForm.id}` : '/admin/email/templates';
            const res = await fetchApi(url, { method, body: JSON.stringify(templateForm) });
            if (res?.success) {
                setShowTemplateModal(false);
                fetchTemplates();
                alert("Template saved!");
            }
        } catch (error) { alert("Failed to save template."); }
    };

    const handleSectionSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = sectionForm.id ? 'PUT' : 'POST';
            const url = sectionForm.id ? `/admin/email/sections/${sectionForm.id}` : '/admin/email/sections';
            // Ensure template_id is set
            const payload = { ...sectionForm, template_id: selectedTemplate.id };
            const res = await fetchApi(url, { method, body: JSON.stringify(payload) });
            if (res?.success) {
                setShowSectionModal(false);
                handleSelectTemplate(selectedTemplate);
                alert("Section saved!");
            }
        } catch (error) { alert("Failed to save section."); }
    };

    const handleSectionDelete = async (id) => {
        if (!confirm('Delete this template section?')) return;
        try {
            await fetchApi(`/admin/email/sections/${id}`, { method: 'DELETE' });
            handleSelectTemplate(selectedTemplate);
        } catch (error) { alert("Delete failed."); }
    };

    if (loading && !templates.length) return <Container fluid className="p-4"><p>Loading email templates...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Email Template Management</h2>
                <Button variant="primary" onClick={() => { setTemplateForm({ id: null, template_key: '', subject: '', headline: '', body_html: '', footer_text: '', brand_color: '#0a0a0a', accent_color: '#3b82f6', logo_url: '', is_active: 1 }); setShowTemplateModal(true); }}>Create New Template</Button>
            </div>

            <Row>
                <Col lg={4}>
                    <Card className="mb-4">
                        <Card.Header className="bg-dark text-white"><h5 className="mb-0 text-white">Templates</h5></Card.Header>
                        <ListGroup variant="flush">
                            {templates.map(t => (
                                <ListGroup.Item 
                                    key={t.id} 
                                    action 
                                    active={selectedTemplate?.id === t.id}
                                    onClick={() => handleSelectTemplate(t)}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{t.template_key}</strong>
                                        <div className="small text-muted">{t.subject}</div>
                                    </div>
                                    <Badge bg={t.is_active ? 'success' : 'secondary'}>{t.is_active ? 'Active' : 'Inactive'}</Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>

                <Col lg={8}>
                    {selectedTemplate ? (
                        <>
                            <Card className="mb-4">
                                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Configuration: {selectedTemplate.template_key}</h5>
                                    <div>
                                        <Button variant="light" size="sm" className="me-2" onClick={() => { setTemplateForm(selectedTemplate); setShowTemplateModal(true); }}>Edit Settings</Button>
                                        <a href={`${process.env.NEXT_PUBLIC_API_URL}/admin/email/templates/preview/${selectedTemplate.id}?admin_token=${hasMounted ? localStorage.getItem('admin_token') : ''}`} target="_blank" rel="noreferrer" className="btn btn-warning btn-sm">Preview Layout</a>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Subject:</strong> {selectedTemplate.subject}</p>
                                            <p><strong>Headline:</strong> {selectedTemplate.headline}</p>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex gap-2 mb-2">
                                                <strong>Colors:</strong>
                                                <div style={{width: 20, height: 20, background: selectedTemplate.brand_color, border: '1px solid #ccc'}} title="Brand"></div>
                                                <div style={{width: 20, height: 20, background: selectedTemplate.accent_color, border: '1px solid #ccc'}} title="Accent"></div>
                                            </div>
                                            <p><strong>Active:</strong> <Badge bg={selectedTemplate.is_active ? 'success' : 'danger'}>{selectedTemplate.is_active ? 'Yes' : 'No'}</Badge></p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Email Template Sections</h4>
                                <Button variant="success" size="sm" onClick={() => { setSectionForm({ id: null, template_id: selectedTemplate.id, section_name: '', content: '', sort_order: sections.length, is_active: 1 }); setShowSectionModal(true); }}>Add Section</Button>
                            </div>

                            <Accordion defaultActiveKey="0">
                                {sections.length > 0 ? sections.map((section, idx) => (
                                    <Accordion.Item eventKey={idx.toString()} key={section.id}>
                                        <Accordion.Header>
                                            <div className="d-flex justify-content-between w-100 pe-3">
                                                <span>{section.section_name}</span>
                                                <Badge bg={section.is_active ? 'info' : 'secondary'}>Order: {section.sort_order}</Badge>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="mb-3 p-3 bg-light border rounded" style={{whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto'}}>
                                                {section.content}
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { setSectionForm(section); setShowSectionModal(true); }}>Edit Section</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleSectionDelete(section.id)}>Delete</Button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )) : (
                                    <Card><Card.Body className="text-center py-4 text-muted">No sections found for this template. Use the "Add Section" button to create one.</Card.Body></Card>
                                )}
                            </Accordion>
                        </>
                    ) : (
                        <Card><Card.Body className="text-center py-5">Select a template from the left to manage its sections.</Card.Body></Card>
                    )}
                </Col>
            </Row>

            {/* Template Settings Modal */}
            <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>{templateForm.id ? 'Edit' : 'Create'} Email Template</Modal.Title></Modal.Header>
                <Form onSubmit={handleTemplateSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Template Key (Internal ID)</Form.Label>
                                    <Form.Control type="text" value={templateForm.template_key} onChange={e => setTemplateForm({...templateForm, template_key: e.target.value})} placeholder="e.g. welcome_user" required disabled={!!templateForm.id} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Subject</Form.Label>
                                    <Form.Control type="text" value={templateForm.subject} onChange={e => setTemplateForm({...templateForm, subject: e.target.value})} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Main Headline</Form.Label>
                            <Form.Control type="text" value={templateForm.headline} onChange={e => setTemplateForm({...templateForm, headline: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Base Body HTML (Variables: {'{name}'}, {'{email}'})</Form.Label>
                            <Form.Control as="textarea" rows={4} value={templateForm.body_html} onChange={e => setTemplateForm({...templateForm, body_html: e.target.value})} />
                            <Form.Text className="text-muted">You can define the core message here, or leave it empty and only use sections.</Form.Text>
                        </Form.Group>
                        <Row>
                            <Col md={3}><Form.Group className="mb-3"><Form.Label>Brand Color</Form.Label><Form.Control type="color" value={templateForm.brand_color} onChange={e => setTemplateForm({...templateForm, brand_color: e.target.value})} /></Form.Group></Col>
                            <Col md={3}><Form.Group className="mb-3"><Form.Label>Accent Color</Form.Label><Form.Control type="color" value={templateForm.accent_color} onChange={e => setTemplateForm({...templateForm, accent_color: e.target.value})} /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Logo URL</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control type="text" value={templateForm.logo_url} onChange={e => setTemplateForm({...templateForm, logo_url: e.target.value})} />
                                    <Button size="sm" variant="outline-dark" onClick={() => setShowGallery(true)}>Gallery</Button>
                                </div>
                            </Form.Group></Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Footer Text</Form.Label>
                            <Form.Control type="text" value={templateForm.footer_text} onChange={e => setTemplateForm({...templateForm, footer_text: e.target.value})} />
                        </Form.Group>
                        <Form.Check type="switch" label="Is Active" checked={templateForm.is_active === 1} onChange={e => setTemplateForm({...templateForm, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Section Modal */}
            <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>{sectionForm.id ? 'Edit' : 'Add'} Template Section</Modal.Title></Modal.Header>
                <Form onSubmit={handleSectionSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Section Name (Display only)</Form.Label>
                            <Form.Control type="text" value={sectionForm.section_name} onChange={e => setSectionForm({...sectionForm, section_name: e.target.value})} placeholder="e.g. Intro Text, Social Links, etc." required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Section Content (HTML & Variables allowed)</Form.Label>
                            <Form.Control as="textarea" rows={10} value={sectionForm.content} onChange={e => setSectionForm({...sectionForm, content: e.target.value})} required />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sort Order</Form.Label>
                                    <Form.Control type="number" value={sectionForm.sort_order} onChange={e => setSectionForm({...sectionForm, sort_order: parseInt(e.target.value)})} />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="d-flex align-items-center pt-3">
                                <Form.Check type="switch" label="Is Active" checked={sectionForm.is_active === 1} onChange={e => setSectionForm({...sectionForm, is_active: e.target.checked ? 1 : 0})} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSectionModal(false)}>Cancel</Button>
                        <Button type="submit" variant="success">Save Section</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <MediaGallery 
                show={showGallery} 
                onHide={() => setShowGallery(false)} 
                onSelect={(url) => { 
                    if (showTemplateModal) setTemplateForm({...templateForm, logo_url: url});
                    setShowGallery(false); 
                }} 
            />
        </Container>
    );
};

export default EmailTemplatesCMS;
