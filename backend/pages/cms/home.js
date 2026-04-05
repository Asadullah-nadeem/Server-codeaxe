import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Nav, Tab, InputGroup } from 'react-bootstrap';
import Image from 'next/image';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const HomeCMS = () => {
    const [data, setData] = useState({ hero: {}, services: [], projects: [], stats: [], headers: [], cta: {}, principles: [], technologies: [], system_status: [], partners: [] });
    const [loading, setLoading] = useState(true);
    
    // modal states
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showStatModal, setShowStatModal] = useState(false);
    const [showHeaderModal, setShowHeaderModal] = useState(false);
    const [showPrincipleModal, setShowPrincipleModal] = useState(false);
    const [showTechnologyModal, setShowTechnologyModal] = useState(false);
    const [showSystemStatusModal, setShowSystemStatusModal] = useState(false);
    const [showPartnerModal, setShowPartnerModal] = useState(false);
    
    // form states
    const [heroForm, setHeroForm] = useState({ badge: '', title: '', description: '' });
    const [ctaForm, setCtaForm] = useState({ badge: '', title: '', description: '', button_label: '', button_link: '' });
    const [headerForm, setHeaderForm] = useState({ section_key: '', section_index: '', label: '', title: '', description: '' });
    const [serviceForm, setServiceForm] = useState({ id: null, index_number: '', title: '', description: '', icon: '' });
    const [projectForm, setProjectForm] = useState({ id: null, title: '', description: '', year: '', tags: '', image_url: '', project_url: '' });
    const [statForm, setStatForm] = useState({ id: null, value: '', label: '' });
    const [principleForm, setPrincipleForm] = useState({ id: null, title: '', description: '', icon: '' });
    const [technologyForm, setTechnologyForm] = useState({ id: null, name: '', src: '' });
    const [systemStatusForm, setSystemStatusForm] = useState({ id: null, label: '', status: '', ping: '' });
    const [partnerForm, setPartnerForm] = useState({ id: null, name: '', src: '' });
    // ── Media Selector ──
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaItems, setMediaItems] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaTarget, setMediaTarget] = useState(null); // { type: 'service'|'project'|..., field: 'icon'|'image_url'|... }

    const fetchMediaItems = async () => {
        try {
            setMediaLoading(true);
            const res = await fetchApi('/admin/dms/media');
            if (res?.success) setMediaItems(res.data);
        } catch (error) { console.error(error); }
        finally { setMediaLoading(false); }
    };

    const handleMediaSelect = (path) => {
        if (!mediaTarget) return;
        const { type, field } = mediaTarget;
        if (type === 'service') setServiceForm(prev => ({ ...prev, [field]: path }));
        if (type === 'project') setProjectForm(prev => ({ ...prev, [field]: path }));
        if (type === 'principle') setPrincipleForm(prev => ({ ...prev, [field]: path }));
        if (type === 'tech') setTechnologyForm(prev => ({ ...prev, [field]: path }));
        if (type === 'partner') setPartnerForm(prev => ({ ...prev, [field]: path }));
        setShowMediaModal(false);
    };

    const openMediaPicker = (type, field) => {
        setMediaTarget({ type, field });
        fetchMediaItems();
        setShowMediaModal(true);
    };

    const fetchHomeData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/home');
            const d = res?.data || {};
            setData({
                hero: d.hero || {},
                services: d.services || [],
                projects: d.projects || [],
                stats: d.stats || [],
                headers: Object.values(d.section_headers || {}),
                cta: d.cta || {},
                principles: d.principles || [],
                technologies: d.technologies || [],
                system_status: d.system_status || [],
                partners: d.partners || []
            });
            setHeroForm(d.hero || { badge: '', title: '', description: '' });
            setCtaForm(d.cta || { badge: '', title: '', description: '', button_label: '', button_link: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to fetch home data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchHomeData(); }, [fetchHomeData]);

    const handleHeroSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/home/hero', { method: 'POST', body: JSON.stringify(heroForm) });
            alert("Hero section updated!");
            fetchHomeData();
        } catch (error) { alert("Failed to save hero."); }
    };

    const handleCtaSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/home/cta', { method: 'POST', body: JSON.stringify(ctaForm) });
            alert("CTA section updated!");
            fetchHomeData();
        } catch (error) { alert("Failed to save CTA."); }
    };

    const handleHeaderShow = (item) => {
        setHeaderForm(item);
        setShowHeaderModal(true);
    };

    const handleHeaderSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi(`/admin/home/headers/${headerForm.section_key}`, { method: 'PUT', body: JSON.stringify(headerForm) });
            setShowHeaderModal(false);
            fetchHomeData();
        } catch (error) { alert("Failed to save header."); }
    };

    // Generic CRUD Generator
    const createCrudHandlers = (endpoint, formState, setFormState, setShowModal) => {
        return {
            handleShow: (item = null) => {
                setFormState(item ? item : formState);
                setShowModal(true);
            },
            handleSubmit: async (e, currentFormVal) => {
                e.preventDefault();
                try {
                    if (currentFormVal.id) await fetchApi(`/admin/home/${endpoint}/${currentFormVal.id}`, { method: 'PUT', body: JSON.stringify(currentFormVal) });
                    else await fetchApi(`/admin/home/${endpoint}`, { method: 'POST', body: JSON.stringify(currentFormVal) });
                    setShowModal(false);
                    fetchHomeData();
                } catch (error) { alert(`Failed to save ${endpoint}.`); }
            },
            handleDelete: async (id) => {
                if (!confirm('Are you sure?')) return;
                await fetchApi(`/admin/home/${endpoint}/${id}`, { method: 'DELETE' });
                fetchHomeData();
            }
        };
    };

    const serviceCrud = createCrudHandlers('services', { id: null, index_number: '', title: '', description: '', icon: '' }, setServiceForm, setShowServiceModal);
    const statCrud = createCrudHandlers('stats', { id: null, value: '', label: '' }, setStatForm, setShowStatModal);
    const principleCrud = createCrudHandlers('principles', { id: null, title: '', description: '', icon: '' }, setPrincipleForm, setShowPrincipleModal);
    const techCrud = createCrudHandlers('technologies', { id: null, name: '', src: '' }, setTechnologyForm, setShowTechnologyModal);
    const statusCrud = createCrudHandlers('system_status', { id: null, label: '', status: '', ping: '' }, setSystemStatusForm, setShowSystemStatusModal);
    const partnerCrud = createCrudHandlers('partners', { id: null, name: '', src: '' }, setPartnerForm, setShowPartnerModal);

    // Projects has special tags JSON logic
    const handleProjectShow = (item = null) => {
        setProjectForm(item ? { ...item, tags: JSON.stringify(item.tags || []) } : { id: null, title: '', description: '', year: '', tags: '[]', image_url: '', project_url: '' });
        setShowProjectModal(true);
    };
    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            let payload = { ...projectForm };
            try { payload.tags = JSON.parse(payload.tags); } catch { payload.tags = []; }
            if (projectForm.id) await fetchApi(`/admin/home/projects/${projectForm.id}`, { method: 'PUT', body: JSON.stringify(payload) });
            else await fetchApi('/admin/home/projects', { method: 'POST', body: JSON.stringify(payload) });
            setShowProjectModal(false);
            fetchHomeData();
        } catch (error) { alert("Failed to save project."); }
    };
    const handleProjectDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        await fetchApi(`/admin/home/projects/${id}`, { method: 'DELETE' });
        fetchHomeData();
    };


    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">Home Page Settings & Sections</h2>

            <Tab.Container defaultActiveKey="headers">
                <Nav variant="tabs" className="mb-4 text-nowrap" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
                    <Nav.Item><Nav.Link eventKey="headers">Section Headers</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="hero">Hero Cover</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="services">Core Services</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="projects">Featured Projects</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="stats">Company Stats</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="principles">Principles</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="technologies">Technologies</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="system_status">System Status</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="partners">Partners</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="cta">Call To Action</Nav.Link></Nav.Item>
                </Nav>
 
                <Tab.Content>
                    {loading ? (
                        <div className="py-5">
                            <LoadingSpinner text="Synchronizing home content data..." />
                        </div>
                    ) : (
                        <>
                            {/* HEADERS TAB */}
                            <Tab.Pane eventKey="headers">
                                <Table hover responsive>
                                    <thead className="table-light"><tr><th>Key</th><th>Index</th><th>Label</th><th>Title</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.headers.map(h => (
                                            <tr key={h.id}>
                                                <td><code>{h.section_key}</code></td>
                                                <td>{h.section_index || '-'}</td>
                                                <td>{h.label}</td>
                                                <td>{h.title || '-'}</td>
                                                <td><Button size="sm" variant="info" onClick={() => handleHeaderShow(h)}>Edit</Button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* HERO TAB */}
                            <Tab.Pane eventKey="hero">
                                <Card>
                                    <Card.Body>
                                        <Form onSubmit={handleHeroSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Badge Text</Form.Label>
                                                <Form.Control type="text" value={heroForm.badge || ''} onChange={e => setHeroForm({...heroForm, badge: e.target.value})} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Main Title (HTML allowed)</Form.Label>
                                                <Form.Control as="textarea" rows={2} value={heroForm.title || ''} onChange={e => setHeroForm({...heroForm, title: e.target.value})} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Hero Description</Form.Label>
                                                <Form.Control as="textarea" rows={3} value={heroForm.description || ''} onChange={e => setHeroForm({...heroForm, description: e.target.value})} required />
                                            </Form.Group>
                                            <Button type="submit" variant="primary">Save Hero Section</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* SERVICES TAB */}
                            <Tab.Pane eventKey="services">
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="primary" onClick={() => serviceCrud.handleShow()}>Add Service Card</Button>
                                </div>
                                <Table hover>
                                    <thead className="table-light"><tr><th>Index</th><th>Icon</th><th>Title</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.services.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.index_number}</td><td>{s.icon}</td><td>{s.title}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => serviceCrud.handleShow(s)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => serviceCrud.handleDelete(s.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* PROJECTS TAB */}
                            <Tab.Pane eventKey="projects">
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="primary" onClick={() => handleProjectShow()}>Add Project</Button>
                                </div>
                                <Table hover>
                                    <thead className="table-light"><tr><th>Year</th><th>Title</th><th>Image URL</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.projects.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.year}</td><td>{p.title}</td><td>{p.image_url}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => handleProjectShow(p)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleProjectDelete(p.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* STATS TAB */}
                            <Tab.Pane eventKey="stats">
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="primary" onClick={() => statCrud.handleShow()}>Add Stat</Button>
                                </div>
                                <Table hover>
                                    <thead className="table-light"><tr><th>Value</th><th>Label</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.stats.map(s => (
                                            <tr key={s.id}>
                                                <td><h2>{s.value}</h2></td><td>{s.label}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => statCrud.handleShow(s)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => statCrud.handleDelete(s.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* PRINCIPLES TAB */}
                            <Tab.Pane eventKey="principles">
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="primary" onClick={() => principleCrud.handleShow()}>Add Principle</Button>
                                </div>
                                <Table hover>
                                    <thead className="table-light"><tr><th>Title</th><th>Icon</th><th>Description</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.principles.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.title}</td><td>{p.icon}</td><td className="text-truncate" style={{maxWidth: '200px'}}>{p.description}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => principleCrud.handleShow(p)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => principleCrud.handleDelete(p.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* TECHNOLOGIES TAB */}
                            <Tab.Pane eventKey="technologies">
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="primary" onClick={() => techCrud.handleShow()}>Add Tech</Button>
                                </div>
                                <Table hover>
                                    <thead className="table-light"><tr><th>Name</th><th>Image Source</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.technologies.map(t => (
                                            <tr key={t.id}>
                                                <td>{t.name}</td><td>{t.src}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => techCrud.handleShow(t)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => techCrud.handleDelete(t.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* SYSTEM STATUS TAB */}
                            <Tab.Pane eventKey="system_status">
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="primary" onClick={() => statusCrud.handleShow()}>Add Status Module</Button>
                                </div>
                                <Table hover>
                                    <thead className="table-light"><tr><th>Label</th><th>Status</th><th>Ping</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.system_status.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.label}</td>
                                                <td><span className={`badge bg-${s.status === 'Operational' ? 'success' : 'warning'}`}>{s.status}</span></td>
                                                <td>{s.ping}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => statusCrud.handleShow(s)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => statusCrud.handleDelete(s.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* PARTNERS TAB */}
                            <Tab.Pane eventKey="partners">
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="primary" onClick={() => partnerCrud.handleShow()}>Add Partner Link</Button>
                                </div>
                                <Table hover>
                                    <thead className="table-light"><tr><th>Name</th><th>Logo Source</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {data.partners.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.name}</td><td>{p.src}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => partnerCrud.handleShow(p)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => partnerCrud.handleDelete(p.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                            {/* CTA TAB */}
                            <Tab.Pane eventKey="cta">
                                <Card>
                                    <Card.Body>
                                        <Form onSubmit={handleCtaSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Badge</Form.Label>
                                                <Form.Control type="text" value={ctaForm.badge || ''} onChange={e => setCtaForm({...ctaForm, badge: e.target.value})} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control type="text" value={ctaForm.title || ''} onChange={e => setCtaForm({...ctaForm, title: e.target.value})} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control as="textarea" rows={2} value={ctaForm.description || ''} onChange={e => setCtaForm({...ctaForm, description: e.target.value})} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Button Label</Form.Label>
                                                <Form.Control type="text" value={ctaForm.button_label || ''} onChange={e => setCtaForm({...ctaForm, button_label: e.target.value})} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Button Link</Form.Label>
                                                <Form.Control type="text" value={ctaForm.button_link || ''} onChange={e => setCtaForm({...ctaForm, button_link: e.target.value})} required />
                                            </Form.Group>
                                            <Button type="submit" variant="primary">Save CTA Section</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </>
                    )}
                </Tab.Content>
            </Tab.Container>

            {/* Modals */}
            <Modal show={showHeaderModal} onHide={() => setShowHeaderModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit Section Header ({headerForm.section_key})</Modal.Title></Modal.Header>
                <Form onSubmit={handleHeaderSubmit}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Index (e.g. 01)" value={headerForm.section_index || ''} onChange={e => setHeaderForm({...headerForm, section_index: e.target.value})} />
                        <Form.Control className="mb-2" placeholder="Label (e.g. CAPABILITIES)" value={headerForm.label || ''} onChange={e => setHeaderForm({...headerForm, label: e.target.value})} required />
                        <Form.Control className="mb-2" placeholder="Title (e.g. Engineering Services)" value={headerForm.title || ''} onChange={e => setHeaderForm({...headerForm, title: e.target.value})} />
                        <Form.Control className="mb-2" as="textarea" placeholder="Description" value={headerForm.description || ''} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} />
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)}>
                <Modal.Header closeButton><Modal.Title>Service</Modal.Title></Modal.Header>
                <Form onSubmit={e => serviceCrud.handleSubmit(e, serviceForm)}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Index (e.g. 01)" value={serviceForm.index_number} onChange={e => setServiceForm({...serviceForm, index_number: e.target.value})} required />
                        <InputGroup className="mb-2">
                            <Form.Control placeholder="Icon (e.g. Globe or URL)" value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} required />
                            <Button variant="outline-primary" onClick={() => openMediaPicker('service', 'icon')}>Gallery</Button>
                        </InputGroup>
                        <Form.Control className="mb-2" placeholder="Title" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required />
                        <Form.Control className="mb-2" as="textarea" placeholder="Description" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required />
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)}>
                <Modal.Header closeButton><Modal.Title>Project</Modal.Title></Modal.Header>
                <Form onSubmit={handleProjectSubmit}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required />
                        <Form.Control className="mb-2" placeholder="Year" value={projectForm.year} onChange={e => setProjectForm({...projectForm, year: e.target.value})} required />
                        <Form.Control className="mb-2" as="textarea" placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
                        <Form.Control className="mb-2" placeholder='Tags JSON (e.g. ["React", "Node"])' value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} required />
                        <InputGroup className="mb-2">
                            <Form.Control placeholder="Image URL" value={projectForm.image_url} onChange={e => setProjectForm({...projectForm, image_url: e.target.value})} />
                            <Button variant="outline-primary" onClick={() => openMediaPicker('project', 'image_url')}>Gallery</Button>
                        </InputGroup>
                        <Form.Control className="mb-2" placeholder="Project Link" value={projectForm.project_url} onChange={e => setProjectForm({...projectForm, project_url: e.target.value})} />
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showStatModal} onHide={() => setShowStatModal(false)}>
                <Modal.Header closeButton><Modal.Title>Stat</Modal.Title></Modal.Header>
                <Form onSubmit={e => statCrud.handleSubmit(e, statForm)}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Value (e.g. 99%)" value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} required />
                        <Form.Control className="mb-2" placeholder="Label (e.g. Uptime)" value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} required />
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showPrincipleModal} onHide={() => setShowPrincipleModal(false)}>
                <Modal.Header closeButton><Modal.Title>Principle</Modal.Title></Modal.Header>
                <Form onSubmit={e => principleCrud.handleSubmit(e, principleForm)}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Title" value={principleForm.title} onChange={e => setPrincipleForm({...principleForm, title: e.target.value})} required />
                        <InputGroup className="mb-2">
                            <Form.Control placeholder="Icon (e.g. Zap or URL)" value={principleForm.icon} onChange={e => setPrincipleForm({...principleForm, icon: e.target.value})} required />
                            <Button variant="outline-primary" onClick={() => openMediaPicker('principle', 'icon')}>Gallery</Button>
                        </InputGroup>
                        <Form.Control className="mb-2" as="textarea" placeholder="Description" value={principleForm.description} onChange={e => setPrincipleForm({...principleForm, description: e.target.value})} required />
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showTechnologyModal} onHide={() => setShowTechnologyModal(false)}>
                <Modal.Header closeButton><Modal.Title>Technology</Modal.Title></Modal.Header>
                <Form onSubmit={e => techCrud.handleSubmit(e, technologyForm)}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Name (e.g. React)" value={technologyForm.name} onChange={e => setTechnologyForm({...technologyForm, name: e.target.value})} required />
                        <InputGroup className="mb-2">
                            <Form.Control placeholder="Source Key or Logo URL" value={technologyForm.src} onChange={e => setTechnologyForm({...technologyForm, src: e.target.value})} required />
                            <Button variant="outline-primary" onClick={() => openMediaPicker('tech', 'src')}>Gallery</Button>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showSystemStatusModal} onHide={() => setShowSystemStatusModal(false)}>
                <Modal.Header closeButton><Modal.Title>System Status</Modal.Title></Modal.Header>
                <Form onSubmit={e => statusCrud.handleSubmit(e, systemStatusForm)}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Label (e.g. API Gateway)" value={systemStatusForm.label} onChange={e => setSystemStatusForm({...systemStatusForm, label: e.target.value})} required />
                        <Form.Select className="mb-2" value={systemStatusForm.status} onChange={e => setSystemStatusForm({...systemStatusForm, status: e.target.value})} required>
                            <option value="">Select Status</option>
                            <option value="Operational">Operational</option>
                            <option value="Degraded">Degraded</option>
                            <option value="Offline">Offline</option>
                        </Form.Select>
                        <Form.Control className="mb-2" placeholder="Ping (e.g. 12ms)" value={systemStatusForm.ping} onChange={e => setSystemStatusForm({...systemStatusForm, ping: e.target.value})} required />
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showPartnerModal} onHide={() => setShowPartnerModal(false)}>
                <Modal.Header closeButton><Modal.Title>Partner</Modal.Title></Modal.Header>
                <Form onSubmit={e => partnerCrud.handleSubmit(e, partnerForm)}>
                    <Modal.Body>
                        <Form.Control className="mb-2" placeholder="Partner Name" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} required />
                        <InputGroup className="mb-2">
                            <Form.Control placeholder="Logo Source (e.g. /images/logo.png)" value={partnerForm.src} onChange={e => setPartnerForm({...partnerForm, src: e.target.value})} required />
                            <Button variant="outline-primary" onClick={() => openMediaPicker('partner', 'src')}>Gallery</Button>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
                </Form>
            </Modal>

            {/* Media Picker Modal */}
            <Modal show={showMediaModal} size="xl" scrollable onHide={() => setShowMediaModal(false)}>
                <Modal.Header closeButton className="bg-light"><Modal.Title className="fw-bold">Select Image from Gallery</Modal.Title></Modal.Header>
                <Modal.Body className="p-4">
                    {mediaLoading ? <p className="text-center py-5">Loading media library...</p> : (
                        <Row className="g-3">
                            {mediaItems.length === 0 ? <Col className="text-center py-5">No active media found. Upload some first!</Col> : mediaItems.map(m => (
                                <Col key={m.id} xs={6} sm={4} md={3} lg={2}>
                                    <Card
                                        className="h-100 border-0 shadow-sm cursor-pointer hover-card"
                                        onClick={() => handleMediaSelect(m.path)}
                                        style={{transition: 'transform 0.2s'}}
                                    >
                                        <div style={{height:'100px'}} className="bg-light d-flex align-items-center justify-content-center overflow-hidden rounded-3 border">
                                            {['mp4', 'mov', 'avi', 'wmv', 'webm', 'mpeg'].includes(m.file_name?.split('.').pop()?.toLowerCase()) ? (
                                                <video 
                                                    src={m.path} 
                                                    className="mw-100 mh-100 object-fit-contain"
                                                    muted
                                                    onMouseOver={e => e.target.play()}
                                                    onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                                                />
                                            ) : ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(m.file_name?.split('.').pop()?.toLowerCase()) ? (
                                                <Image 
                                                    src={m.path} 
                                                    alt={m.file_name} 
                                                    width={100} 
                                                    height={100}
                                                    className="mw-100 mh-100 object-fit-contain" 
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="text-center p-3 text-muted">
                                                    <i className="fe fe-file fs-4 opacity-50 d-block mb-1"></i>
                                                    <div className="fw-bold text-uppercase" style={{fontSize: 9}}>{m.file_name?.split('.').pop()}</div>
                                                </div>
                                            )}
                                        </div>

                                        <Card.Body className="p-2 text-center">
                                            <div className="text-truncate x-small fw-bold">{m.file_name}</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" size="sm" onClick={() => setShowMediaModal(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={() => window.open('/cms/media', '_blank')}>Manage Library</Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .cursor-pointer { cursor: pointer; }
                .hover-card:hover { transform: translateY(-5px); }
                .x-small { font-size: 11px; }
            `}</style>
        </Container>
    );
};

export default HomeCMS;
