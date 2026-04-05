import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Nav, Tab, Pagination, InputGroup, Badge } from 'react-bootstrap';
import Image from 'next/image';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, Filter, CheckCircle, XCircle, Layers, Edit2, Plus } from 'react-feather';

// ─────────────────────────────────────────────────────────────────────────────
// Work CMS — Fully independent from Portfolio. Uses /admin/work/* endpoints only.
// DB: work_section_header, work_categories, work_projects
// ─────────────────────────────────────────────────────────────────────────────

const WorkCMS = () => {
    // ─── State ────────────────────────────────────────────────────────────────
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [header, setHeader] = useState({ section_index: '00', label: 'ALL WORK', title: 'Projects & Systems', description: '' });
    const [loading, setLoading] = useState(true);
    const [savingHeader, setSavingHeader] = useState(false);

    // Modal states
    const [showCatModal, setShowCatModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);

    // Category table state
    const [searchCat, setSearchCat] = useState('');
    const [filterCatStatus, setFilterCatStatus] = useState('all');
    const [catPage, setCatPage] = useState(1);
    const [catsPerPage, setCatsPerPage] = useState(10);
    const [selectedCats, setSelectedCats] = useState([]);
    const [bulkDeletingCats, setBulkDeletingCats] = useState(false);

    // Project table state
    const [searchProject, setSearchProject] = useState('');
    const [filterProjectCat, setFilterProjectCat] = useState('all');
    const [filterProjectStatus, setFilterProjectStatus] = useState('all');
    const [projectPage, setProjectPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(10);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [bulkDeletingProjects, setBulkDeletingProjects] = useState(false);

    // Forms
    const [catForm, setCatForm] = useState({ id: null, label: '', sort_order: 0, slug: '', is_active: 1 });
    const [projectForm, setProjectForm] = useState({
        id: null, category_id: '', title: '', description: '',
        tags: '[]', project_year: '', image_url: '', project_url: '',
        is_active: 1, sort_order: 0
    });

    // Feature flags (set once after first fetch — detects which columns exist server-side)
    const [hasIsActive, setHasIsActive] = useState(false);
    const [hasSortOrder, setHasSortOrder] = useState(false);
    const [hasSlug, setHasSlug] = useState(false);

    // Media picker
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaItems, setMediaItems] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(false);

    // ─── Fetch All Work Data ──────────────────────────────────────────────────
    const fetchData = async () => {
        try {
            setLoading(true);
            const [catsRes, projectsRes, headerRes] = await Promise.all([
                fetchApi('/admin/work/categories'),
                fetchApi('/admin/work/projects'),
                fetchApi('/admin/work/header'),
            ]);

            const cats = catsRes?.data || [];
            const projs = projectsRes?.data || [];
            const hdr = headerRes?.data || null;

            setCategories(cats);
            setProjects(projs);

            // Detect which optional columns are present
            if (cats.length > 0) {
                setHasIsActive('is_active' in cats[0]);
                setHasSlug('slug' in cats[0]);
            }
            if (projs.length > 0) {
                setHasSortOrder('sort_order' in projs[0]);
            }

            if (hdr) {
                setHeader({
                    section_index: hdr.section_index || '00',
                    label:         hdr.label         || 'ALL WORK',
                    title:         hdr.title         || 'Projects & Systems',
                    description:   hdr.description   || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch work data:', error);
            alert('Failed to fetch work CMS data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ─── Section Header Handlers ──────────────────────────────────────────────
    const handleHeaderSave = async (e) => {
        e.preventDefault();
        try {
            setSavingHeader(true);
            await fetchApi('/admin/work/header', { method: 'PUT', body: JSON.stringify(header) });
            alert('Section header updated successfully!');
        } catch (err) {
            alert(err.message || 'Failed to save header.');
        } finally {
            setSavingHeader(false);
        }
    };

    // ─── Category Handlers ────────────────────────────────────────────────────
    const handleCatShow = (cat = null) => {
        if (cat) {
            setCatForm({
                id: cat.id,
                label: cat.label || '',
                sort_order: cat.sort_order ?? 0,
                slug: cat.slug || '',
                is_active: cat.is_active ?? 1,
            });
        } else {
            setCatForm({ id: null, label: '', sort_order: 0, slug: '', is_active: 1 });
        }
        setShowCatModal(true);
    };

    const handleCatSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                label: catForm.label,
                sort_order: catForm.sort_order,
            };
            if (hasSlug) payload.slug = catForm.slug;
            if (hasIsActive) payload.is_active = catForm.is_active;

            if (catForm.id) {
                await fetchApi(`/admin/work/categories/${catForm.id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } else {
                await fetchApi('/admin/work/categories', { method: 'POST', body: JSON.stringify(payload) });
            }
            setShowCatModal(false);
            fetchData();
        } catch (err) {
            alert(err.message || 'Failed to save category.');
        }
    };

    const handleCatDelete = async (id) => {
        if (!confirm('Delete this category? Projects under it may be affected.')) return;
        try {
            await fetchApi(`/admin/work/categories/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            alert(err.message || 'Failed to delete category.');
        }
    };

    const handleBulkDeleteCats = async () => {
        if (!confirm(`Delete ${selectedCats.length} categories? This may affect projects under them.`)) return;
        try {
            setBulkDeletingCats(true);
            await Promise.all(selectedCats.map(id => fetchApi(`/admin/work/categories/${id}`, { method: 'DELETE' })));
            setSelectedCats([]);
            fetchData();
        } catch (err) {
            alert('Failed to delete some categories.');
        } finally {
            setBulkDeletingCats(false);
        }
    };

    const toggleSelectCat = (id) => setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleSelectAllCats = () => {
        const pageIds = paginatedCats.map(c => c.id);
        const allSel = pageIds.every(id => selectedCats.includes(id));
        setSelectedCats(allSel ? prev => prev.filter(id => !pageIds.includes(id)) : prev => [...new Set([...prev, ...pageIds])]);
    };

    // ─── Project Handlers ─────────────────────────────────────────────────────
    const handleProjectShow = (p = null) => {
        if (p) {
            setProjectForm({
                id: p.id,
                category_id: p.category_id,
                title: p.title || '',
                description: p.description || '',
                tags: JSON.stringify(p.tags || []),
                project_year: p.project_year || '',
                image_url: p.image_url || '',
                project_url: p.project_url || '',
                is_active: p.is_active ?? 1,
                sort_order: p.sort_order ?? 0,
            });
        } else {
            setProjectForm({
                id: null,
                category_id: categories[0]?.id || '',
                title: '', description: '',
                tags: '[]', project_year: '', image_url: '', project_url: '',
                is_active: 1, sort_order: 0,
            });
        }
        setShowProjectModal(true);
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            let payload = { ...projectForm };
            try { payload.tags = JSON.parse(payload.tags); } catch { payload.tags = []; }

            if (!hasSortOrder) delete payload.sort_order;
            if (!hasIsActive) delete payload.is_active; // use field if column exists

            if (projectForm.id) {
                await fetchApi(`/admin/work/projects/${projectForm.id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } else {
                await fetchApi('/admin/work/projects', { method: 'POST', body: JSON.stringify(payload) });
            }
            setShowProjectModal(false);
            fetchData();
        } catch (err) {
            alert(err.message || 'Failed to save project.');
        }
    };

    const handleProjectDelete = async (id) => {
        if (!confirm('Delete this work project?')) return;
        try {
            await fetchApi(`/admin/work/projects/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            alert(err.message || 'Failed to delete project.');
        }
    };

    const handleBulkDeleteProjects = async () => {
        if (!confirm(`Delete ${selectedProjects.length} projects? This cannot be undone.`)) return;
        try {
            setBulkDeletingProjects(true);
            await Promise.all(selectedProjects.map(id => fetchApi(`/admin/work/projects/${id}`, { method: 'DELETE' })));
            setSelectedProjects([]);
            fetchData();
        } catch (err) {
            alert('Failed to delete some projects.');
        } finally {
            setBulkDeletingProjects(false);
        }
    };

    const toggleSelectProject = (id) => setSelectedProjects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleSelectAllProjects = () => {
        const pageIds = paginatedProjects.map(p => p.id);
        const allSel = pageIds.every(id => selectedProjects.includes(id));
        setSelectedProjects(allSel ? prev => prev.filter(id => !pageIds.includes(id)) : prev => [...new Set([...prev, ...pageIds])]);
    };

    const getCatName = (id) => categories.find(c => c.id == id)?.label || `ID-${id}`;

    // ─── Filter & Paginate Categories ─────────────────────────────────────────
    const filteredCats = categories.filter(c => {
        const matchesSearch = c.label.toLowerCase().includes(searchCat.toLowerCase());
        const matchesStatus = !hasIsActive || filterCatStatus === 'all' ? true :
            (filterCatStatus === 'active' ? c.is_active == 1 : c.is_active == 0);
        return matchesSearch && matchesStatus;
    });
    const totalCatPages = Math.ceil(filteredCats.length / catsPerPage) || 1;
    const paginatedCats = filteredCats.slice((catPage - 1) * catsPerPage, catPage * catsPerPage);

    // ─── Filter & Paginate Projects ───────────────────────────────────────────
    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchProject.toLowerCase()) ||
            getCatName(p.category_id).toLowerCase().includes(searchProject.toLowerCase());
        const matchesCat = filterProjectCat === 'all' ? true : p.category_id == filterProjectCat;
        const matchesStatus = !hasIsActive || filterProjectStatus === 'all' ? true :
            (filterProjectStatus === 'active' ? p.is_active == 1 : p.is_active == 0);
        return matchesSearch && matchesCat && matchesStatus;
    });
    const totalProjectPages = Math.ceil(filteredProjects.length / projectsPerPage) || 1;
    const paginatedProjects = filteredProjects.slice((projectPage - 1) * projectsPerPage, projectPage * projectsPerPage);

    // Reset pagination on filter change
    useEffect(() => { setCatPage(1); setSelectedCats([]); }, [searchCat, filterCatStatus, catsPerPage]);
    useEffect(() => { setProjectPage(1); setSelectedProjects([]); }, [searchProject, filterProjectCat, filterProjectStatus, projectsPerPage]);

    // ─── Media Picker ─────────────────────────────────────────────────────────
    const fetchMediaItems = async () => {
        try {
            setMediaLoading(true);
            const res = await fetchApi('/admin/dms/media');
            if (res?.success) setMediaItems(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setMediaLoading(false);
        }
    };

    const openMediaPicker = () => { fetchMediaItems(); setShowMediaModal(true); };
    const handleMediaSelect = (path) => { setProjectForm(prev => ({ ...prev, image_url: path })); setShowMediaModal(false); };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <Container fluid className="px-6 py-4">
            <div className="d-flex align-items-center mb-4">
                <Layers size={22} className="me-2 text-primary" />
                <h2 className="mb-0">Work Management</h2>
            </div>

            {loading ? (
                <div className="py-5">
                    <LoadingSpinner text="Fetching work data..." />
                </div>
            ) : (
                <Tab.Container defaultActiveKey="projects">
                    <Nav variant="tabs" className="mb-4">
                        <Nav.Item><Nav.Link eventKey="projects">Work Projects</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="categories">Work Categories</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="header">Section Header</Nav.Link></Nav.Item>
                    </Nav>

                    <Tab.Content>
                        {/* ── PROJECTS TAB ─────────────────────────────────────── */}
                        <Tab.Pane eventKey="projects">
                            <Row className="mb-3 g-3 align-items-center">
                                <Col lg={4} md={6}>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-white border-end-0"><Filter size={14} /></InputGroup.Text>
                                        <Form.Control
                                            placeholder="Search projects..."
                                            value={searchProject}
                                            onChange={e => setSearchProject(e.target.value)}
                                            className="border-start-0"
                                        />
                                    </InputGroup>
                                </Col>
                                <Col lg={2} md={3}>
                                    <Form.Select value={filterProjectCat} onChange={e => setFilterProjectCat(e.target.value)}>
                                        <option value="all">All Categories</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </Form.Select>
                                </Col>
                                {hasIsActive && (
                                    <Col lg={2} md={3}>
                                        <Form.Select value={filterProjectStatus} onChange={e => setFilterProjectStatus(e.target.value)}>
                                            <option value="all">Any Status</option>
                                            <option value="active">Active (Live)</option>
                                            <option value="inactive">Inactive</option>
                                        </Form.Select>
                                    </Col>
                                )}
                                <Col lg={2} md={3}>
                                    <Form.Select value={projectsPerPage} onChange={e => setProjectsPerPage(parseInt(e.target.value))}>
                                        <option value="10">Show 10</option>
                                        <option value="50">Show 50</option>
                                        <option value="10000">Show All</option>
                                    </Form.Select>
                                </Col>
                                <Col lg={2} md={12} className="text-end">
                                    {selectedProjects.length > 0 ? (
                                        <Button variant="danger" onClick={handleBulkDeleteProjects} disabled={bulkDeletingProjects}>
                                            <Trash2 size={14} className="me-1" />Delete ({selectedProjects.length})
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => handleProjectShow()}>
                                            <Plus size={14} className="me-1" />New Project
                                        </Button>
                                    )}
                                </Col>
                            </Row>

                            <Card>
                                <Card.Body>
                                    <Table hover responsive>
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: 40 }}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={paginatedProjects.length > 0 && paginatedProjects.every(p => selectedProjects.includes(p.id))}
                                                        onChange={toggleSelectAllProjects}
                                                    />
                                                </th>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Year</th>
                                                {hasIsActive && <th>Status</th>}
                                                {hasSortOrder && <th>Order</th>}
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedProjects.length === 0 ? (
                                                <tr><td colSpan="8" className="text-center py-5 text-muted">No projects found matching filters.</td></tr>
                                            ) : paginatedProjects.map(p => (
                                                <tr key={p.id} className={selectedProjects.includes(p.id) ? 'table-primary' : ''} style={{ transition: 'all 0.2s' }}>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedProjects.includes(p.id)}
                                                            onChange={() => toggleSelectProject(p.id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        {p.image_url
                                                            ? <Image src={p.image_url} alt="" width={60} height={40} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} unoptimized />
                                                            : <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 60, height: 40 }}><Layers size={14} className="text-muted opacity-50" /></div>
                                                        }
                                                    </td>
                                                    <td>
                                                        <h6 className="mb-0 fw-bold">{p.title}</h6>
                                                        <small className="text-muted d-block" style={{ fontSize: 10 }}>
                                                            {p.project_url ? 'Link Attached' : 'No External Link'}
                                                        </small>
                                                    </td>
                                                    <td><Badge bg="light" text="dark" className="border">{getCatName(p.category_id)}</Badge></td>
                                                    <td>{p.project_year || '—'}</td>
                                                    {hasIsActive && (
                                                        <td>
                                                            {p.is_active == 1
                                                                ? <Badge bg="success-soft" className="text-success"><CheckCircle size={10} className="me-1" />Live</Badge>
                                                                : <Badge bg="secondary-soft" className="text-secondary"><XCircle size={10} className="me-1" />Hidden</Badge>
                                                            }
                                                        </td>
                                                    )}
                                                    {hasSortOrder && <td>{p.sort_order}</td>}
                                                    <td className="text-end">
                                                        <Button size="sm" variant="light" className="me-2" onClick={() => handleProjectShow(p)}>
                                                            <Edit2 size={12} className="me-1" />Edit
                                                        </Button>
                                                        <Button size="sm" variant="danger-soft" className="text-danger" onClick={() => handleProjectDelete(p.id)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    {totalProjectPages > 1 && (
                                        <Pagination className="justify-content-center mt-3">
                                            <Pagination.Prev disabled={projectPage === 1} onClick={() => setProjectPage(projectPage - 1)} />
                                            {[...Array(totalProjectPages)].map((_, idx) => (
                                                <Pagination.Item key={idx + 1} active={idx + 1 === projectPage} onClick={() => setProjectPage(idx + 1)}>
                                                    {idx + 1}
                                                </Pagination.Item>
                                            ))}
                                            <Pagination.Next disabled={projectPage === totalProjectPages} onClick={() => setProjectPage(projectPage + 1)} />
                                        </Pagination>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab.Pane>

                        {/* ── CATEGORIES TAB ───────────────────────────────────── */}
                        <Tab.Pane eventKey="categories">
                            <Row className="mb-3 g-3 align-items-center">
                                <Col lg={4} md={6}>
                                    <InputGroup>
                                        <InputGroup.Text><Filter size={14} /></InputGroup.Text>
                                        <Form.Control
                                            placeholder="Search categories..."
                                            value={searchCat}
                                            onChange={e => setSearchCat(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                {hasIsActive && (
                                    <Col lg={3} md={6}>
                                        <Form.Select value={filterCatStatus} onChange={e => setFilterCatStatus(e.target.value)}>
                                            <option value="all">All Status</option>
                                            <option value="active">Active Only</option>
                                            <option value="inactive">Inactive Only</option>
                                        </Form.Select>
                                    </Col>
                                )}
                                <Col lg={2} md={6}>
                                    <Form.Select value={catsPerPage} onChange={e => setCatsPerPage(parseInt(e.target.value))}>
                                        <option value="10">Show 10</option>
                                        <option value="50">Show 50</option>
                                        <option value="10000">Show All</option>
                                    </Form.Select>
                                </Col>
                                <Col className="text-end">
                                    {selectedCats.length > 0 ? (
                                        <Button variant="danger" onClick={handleBulkDeleteCats} disabled={bulkDeletingCats}>
                                            <Trash2 size={14} className="me-1" />Delete ({selectedCats.length})
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => handleCatShow()}>
                                            <Plus size={14} className="me-1" />Add Category
                                        </Button>
                                    )}
                                </Col>
                            </Row>

                            <Card>
                                <Card.Body>
                                    <Table hover responsive>
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: 40 }}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={paginatedCats.length > 0 && paginatedCats.every(c => selectedCats.includes(c.id))}
                                                        onChange={toggleSelectAllCats}
                                                    />
                                                </th>
                                                <th>ID</th>
                                                <th>Label</th>
                                                {hasSlug && <th>Slug</th>}
                                                {hasIsActive && <th>Status</th>}
                                                <th>Order</th>
                                                <th>Projects</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedCats.length === 0 ? (
                                                <tr><td colSpan="8" className="text-center py-5 text-muted">No categories found.</td></tr>
                                            ) : paginatedCats.map(cat => (
                                                <tr key={cat.id} className={selectedCats.includes(cat.id) ? 'table-primary' : ''} style={{ transition: 'all 0.2s' }}>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedCats.includes(cat.id)}
                                                            onChange={() => toggleSelectCat(cat.id)}
                                                        />
                                                    </td>
                                                    <td><code className="text-muted">#{cat.id}</code></td>
                                                    <td><strong>{cat.label}</strong></td>
                                                    {hasSlug && <td><code>{cat.slug || '—'}</code></td>}
                                                    {hasIsActive && (
                                                        <td>
                                                            <Badge bg={cat.is_active == 1 ? 'success-soft' : 'secondary-soft'} className={cat.is_active == 1 ? 'text-success' : 'text-secondary'}>
                                                                {cat.is_active == 1 ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                        </td>
                                                    )}
                                                    <td>{cat.sort_order ?? 0}</td>
                                                    <td>
                                                        <Badge bg="light" text="dark" className="border">
                                                            {projects.filter(p => p.category_id == cat.id).length} projects
                                                        </Badge>
                                                    </td>
                                                    <td className="text-end">
                                                        <Button size="sm" variant="light" className="me-2" onClick={() => handleCatShow(cat)}>
                                                            <Edit2 size={12} className="me-1" />Edit
                                                        </Button>
                                                        <Button size="sm" variant="danger-soft" className="text-danger" onClick={() => handleCatDelete(cat.id)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    {totalCatPages > 1 && (
                                        <Pagination className="justify-content-center mt-3">
                                            <Pagination.Prev disabled={catPage === 1} onClick={() => setCatPage(catPage - 1)} />
                                            {[...Array(totalCatPages)].map((_, idx) => (
                                                <Pagination.Item key={idx + 1} active={idx + 1 === catPage} onClick={() => setCatPage(idx + 1)}>
                                                    {idx + 1}
                                                </Pagination.Item>
                                            ))}
                                            <Pagination.Next disabled={catPage === totalCatPages} onClick={() => setCatPage(catPage + 1)} />
                                        </Pagination>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab.Pane>

                        {/* ── SECTION HEADER TAB ───────────────────────────────── */}
                        <Tab.Pane eventKey="header">
                            <Card>
                                <Card.Header className="bg-light"><strong>Work Section Header</strong></Card.Header>
                                <Card.Body>
                                    <p className="text-muted small mb-4">
                                        This controls the heading displayed on the public <code>/work</code> page.
                                    </p>
                                    <Form onSubmit={handleHeaderSave}>
                                        <Row>
                                            <Col md={2}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Section Index</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={header.section_index}
                                                        onChange={e => setHeader({ ...header, section_index: e.target.value })}
                                                        placeholder="00"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Label (small uppercase tag)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={header.label}
                                                        onChange={e => setHeader({ ...header, label: e.target.value })}
                                                        placeholder="e.g. ALL WORK"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={header.title}
                                                        onChange={e => setHeader({ ...header, title: e.target.value })}
                                                        placeholder="e.g. Projects & Systems"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={header.description}
                                                        onChange={e => setHeader({ ...header, description: e.target.value })}
                                                        placeholder="A short description shown under the title..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button variant="primary" type="submit" disabled={savingHeader}>
                                            {savingHeader ? 'Saving...' : 'Save Header'}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            )}

            {/* ── CATEGORY MODAL ─────────────────────────────────────────────── */}
            <Modal show={showCatModal} onHide={() => setShowCatModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{catForm.id ? 'Edit Category' : 'New Category'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCatSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Label <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={catForm.label}
                                onChange={e => setCatForm({ ...catForm, label: e.target.value })}
                                required
                                placeholder="e.g. WEB PLATFORMS"
                            />
                        </Form.Group>
                        {hasSlug && (
                            <Form.Group className="mb-3">
                                <Form.Label>Slug</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={catForm.slug}
                                    onChange={e => setCatForm({ ...catForm, slug: e.target.value })}
                                    placeholder="e.g. web-platforms"
                                />
                            </Form.Group>
                        )}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sort Order</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={catForm.sort_order}
                                        onChange={e => setCatForm({ ...catForm, sort_order: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            {hasIsActive && (
                                <Col md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Is Active?"
                                        className="mt-4"
                                        checked={catForm.is_active == 1}
                                        onChange={e => setCatForm({ ...catForm, is_active: e.target.checked ? 1 : 0 })}
                                    />
                                </Col>
                            )}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCatModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Category</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── PROJECT MODAL ──────────────────────────────────────────────── */}
            <Modal show={showProjectModal} size="lg" onHide={() => setShowProjectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{projectForm.id ? 'Edit Project' : 'New Project'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleProjectSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={projectForm.title}
                                        onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        required
                                        value={projectForm.category_id}
                                        onChange={e => setProjectForm({ ...projectForm, category_id: e.target.value })}
                                    >
                                        <option value="">Select Category...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Year</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={projectForm.project_year}
                                        onChange={e => setProjectForm({ ...projectForm, project_year: e.target.value })}
                                        placeholder="e.g. 2025"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tags (JSON)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder='["React","Node.js"]'
                                        value={projectForm.tags}
                                        onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Image URL</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="https://..."
                                            value={projectForm.image_url}
                                            onChange={e => setProjectForm({ ...projectForm, image_url: e.target.value })}
                                        />
                                        <Button variant="outline-primary" onClick={openMediaPicker}>Select from Gallery</Button>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>External Project Link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={projectForm.project_url}
                                        onChange={e => setProjectForm({ ...projectForm, project_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        required
                                        value={projectForm.description}
                                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            {hasSortOrder && (
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Sort Order</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={projectForm.sort_order}
                                            onChange={e => setProjectForm({ ...projectForm, sort_order: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            {hasIsActive && (
                                <Col md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Is Active / Live?"
                                        className="mt-4"
                                        checked={projectForm.is_active == 1}
                                        onChange={e => setProjectForm({ ...projectForm, is_active: e.target.checked ? 1 : 0 })}
                                    />
                                </Col>
                            )}

                            {projectForm.image_url && (
                                <Col md={12} className="mt-2">
                                    <div className="small text-muted mb-1">Image Preview:</div>
                                    <Image
                                        src={projectForm.image_url}
                                        alt="Preview"
                                        width={200}
                                        height={150}
                                        style={{ maxHeight: '150px', width: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}
                                        unoptimized
                                    />
                                </Col>
                            )}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowProjectModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Project</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── MEDIA PICKER MODAL ─────────────────────────────────────────── */}
            <Modal show={showMediaModal} size="xl" scrollable onHide={() => setShowMediaModal(false)}>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fw-bold">Select Asset from Gallery</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {mediaLoading ? (
                        <p className="text-center py-5">Loading media library...</p>
                    ) : (
                        <Row className="g-3">
                            {mediaItems.length === 0 ? (
                                <Col className="text-center py-5">No media found. Upload assets in the Media Manager first.</Col>
                            ) : mediaItems.map(m => {
                                const ext = m.file_name?.split('.').pop()?.toLowerCase();
                                const isVideo = ['mp4', 'mov', 'avi', 'wmv', 'webm', 'mpeg'].includes(ext);
                                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
                                return (
                                    <Col key={m.id} xs={6} sm={4} md={3} lg={2}>
                                        <Card
                                            className="h-100 border-0 shadow-sm"
                                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                            onClick={() => handleMediaSelect(m.path)}
                                        >
                                            <div style={{ height: '120px' }} className="bg-light d-flex align-items-center justify-content-center overflow-hidden rounded-3 border">
                                                {isVideo ? (
                                                    <video src={m.path} className="mw-100 mh-100 object-fit-contain" muted
                                                        onMouseOver={e => e.target.play()} onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }} />
                                                ) : isImage ? (
                                                    <Image src={m.path} alt={m.file_name} width={120} height={120} className="mw-100 mh-100 object-fit-contain" unoptimized />
                                                ) : (
                                                    <div className="text-center p-3 text-muted">
                                                        <div className="fw-bold text-uppercase" style={{ fontSize: 9 }}>{ext}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <Card.Body className="p-2 text-center">
                                                <div className="text-truncate" style={{ fontSize: 11 }}>{m.file_name}</div>
                                                <div className="text-muted text-uppercase" style={{ fontSize: 10 }}>{m.provider}</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
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
                .x-small { font-size: 11px; }
                .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); }
                .bg-secondary-soft { background-color: rgba(108, 117, 125, 0.1); }
                .bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); }
                .btn-danger-soft { background-color: rgba(220, 53, 69, 0.05); border: 1px solid rgba(220, 53, 69, 0.1); }
                .btn-danger-soft:hover { background-color: #dc3545; color: white !important; }
                .table-primary { background-color: rgba(13, 110, 253, 0.05) !important; }
            `}</style>
        </Container>
    );
};

export default WorkCMS;
