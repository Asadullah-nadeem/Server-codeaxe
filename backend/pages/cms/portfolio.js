import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Nav, Tab, Pagination, InputGroup, Badge } from 'react-bootstrap';
import Image from 'next/image';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, Filter, CheckSquare, Square, XCircle, CheckCircle } from 'react-feather';

const PortfolioCMS = () => {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // modal states
    const [showCatModal, setShowCatModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    
    // search and pagination states
    const [searchItem, setSearchItem] = useState('');
    const [itemPage, setItemPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [searchCat, setSearchCat] = useState('');
    const [filterCatStatus, setFilterCatStatus] = useState('all'); // all, active, inactive
    const [catPage, setCatPage] = useState(1);
    const [catsPerPage, setCatsPerPage] = useState(10);

    // Selection states
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedCats, setSelectedCats] = useState([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Advanced Filtering for Items
    const [filterItemCat, setFilterItemCat] = useState('all');
    const [filterItemStatus, setFilterItemStatus] = useState('all');

    const [catForm, setCatForm] = useState({ id: null, slug: '', label: '', description: '', is_active: 1, sort_order: 0 });
    const [itemForm, setItemForm] = useState({ 
        id: null, 
        category_id: '', 
        title: '', 
        description: '', 
        tags: '[]', 
        project_year: '', 
        image_url: '', 
        project_url: '', 
        is_active: 1,
        sort_order: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catsRes, itemsRes] = await Promise.all([
                fetchApi('/admin/portfolio/categories'),
                fetchApi('/admin/portfolio/items')
            ]);
            setCategories(catsRes.data || []);
            setItems(itemsRes.data || []);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch portfolio data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Category Handlers ---
    const handleCatShow = (cat = null) => {
        setCatForm(cat ? cat : { id: null, slug: '', label: '', description: '', is_active: 1, sort_order: 0 });
        setShowCatModal(true);
    };

    const handleCatSubmit = async (e) => {
        e.preventDefault();
        try {
            if (catForm.id) {
                await fetchApi(`/admin/portfolio/categories/${catForm.id}`, { method: 'PUT', body: JSON.stringify(catForm) });
            } else {
                await fetchApi('/admin/portfolio/categories', { method: 'POST', body: JSON.stringify(catForm) });
            }
            setShowCatModal(false);
            fetchData();
        } catch (error) { alert(error.message || 'Failed to save category.'); }
    };

    const handleCatDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category? Items under this category may break.')) return;
        try {
            await fetchApi(`/admin/portfolio/categories/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) { alert(error.message || 'Failed to delete category.'); }
    };

    // --- Item Handlers ---
    const handleItemShow = (item = null) => {
        if (item) {
            setItemForm({ ...item, tags: JSON.stringify(item.tags || []) });
        } else {
            setItemForm({ 
                id: null, category_id: categories[0]?.id || '', title: '', description: '', 
                tags: '[]', project_year: '', image_url: '', project_url: '', is_active: 1, sort_order: 0 
            });
        }
        setShowItemModal(true);
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        try {
            let payload = { ...itemForm };
            try { payload.tags = JSON.parse(payload.tags); } catch { payload.tags = []; }

            if (itemForm.id) {
                await fetchApi(`/admin/portfolio/items/${itemForm.id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } else {
                await fetchApi('/admin/portfolio/items', { method: 'POST', body: JSON.stringify(payload) });
            }
            setShowItemModal(false);
            fetchData();
        } catch (error) { alert(error.message || 'Failed to save portfolio item.'); }
    };

    const handleItemDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this portfolio item?')) return;
        try {
            await fetchApi(`/admin/portfolio/items/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) { alert(error.message || 'Failed to delete portfolio item.'); }
    };

    const getCatName = (id) => categories.find(c => c.id == id)?.label || `ID-${id}`;

    // Filter and Paginate Items
    const filteredItems = items.filter(i => {
        const matchesSearch = i.title.toLowerCase().includes(searchItem.toLowerCase()) || 
                              getCatName(i.category_id).toLowerCase().includes(searchItem.toLowerCase());
        const matchesCat    = filterItemCat === 'all' ? true : i.category_id == filterItemCat;
        const matchesStatus = filterItemStatus === 'all' ? true : 
                              (filterItemStatus === 'active' ? i.is_active == 1 : i.is_active == 0);
        return matchesSearch && matchesCat && matchesStatus;
    });
    const totalItemPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const paginatedItems = filteredItems.slice((itemPage - 1) * itemsPerPage, itemPage * itemsPerPage);

    // Filter and Paginate Categories
    const filteredCats = categories.filter(c => {
        const matchesSearch = c.label.toLowerCase().includes(searchCat.toLowerCase()) || 
                              c.slug.toLowerCase().includes(searchCat.toLowerCase());
        const matchesStatus = filterCatStatus === 'all' ? true : 
                              (filterCatStatus === 'active' ? c.is_active == 1 : c.is_active == 0);
        return matchesSearch && matchesStatus;
    });
    const totalCatPages = Math.ceil(filteredCats.length / catsPerPage) || 1;
    const paginatedCats = filteredCats.slice((catPage - 1) * catsPerPage, catPage * catsPerPage);

    // Reset page if search changes
    useEffect(() => { setItemPage(1); setSelectedItems([]); }, [searchItem, filterItemCat, filterItemStatus, itemsPerPage]);
    useEffect(() => { setCatPage(1); setSelectedCats([]); }, [searchCat, filterCatStatus, catsPerPage]);

    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaItems, setMediaItems] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(false);

    const fetchMediaItems = async () => {
        try {
            setMediaLoading(true);
            const res = await fetchApi('/admin/dms/media');
            if (res?.success) setMediaItems(res.data);
        } catch (error) { console.error(error); }
        finally { setMediaLoading(false); }
    };

    const handleMediaSelect = (path) => {
        setItemForm({ ...itemForm, image_url: path });
        setShowMediaModal(false);
    };

    const openMediaPicker = () => {
        fetchMediaItems();
        setShowMediaModal(true);
    };

    // Bulk delete handlers
    const handleBulkDeleteItems = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedItems.length} portfolio items? This cannot be undone.`)) return;
        try {
            setBulkDeleting(true);
            await Promise.all(selectedItems.map(id => fetchApi(`/admin/portfolio/items/${id}`, { method: 'DELETE' })));
            setSelectedItems([]);
            fetchData();
        } catch (error) { alert("Failed to delete some items."); }
        finally { setBulkDeleting(false); }
    };

    const handleBulkDeleteCats = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedCats.length} categories? This might affect items under them.`)) return;
        try {
            setBulkDeleting(true);
            await Promise.all(selectedCats.map(id => fetchApi(`/admin/portfolio/categories/${id}`, { method: 'DELETE' })));
            setSelectedCats([]);
            fetchData();
        } catch (error) { alert("Failed to delete some categories."); }
        finally { setBulkDeleting(false); }
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleSelectAllItems = () => {
        const pageIds = paginatedItems.map(i => i.id);
        const allSelected = pageIds.every(id => selectedItems.includes(id));
        if (allSelected) {
            setSelectedItems(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedItems(prev => [...new Set([...prev, ...pageIds])]);
        }
    };

    const toggleSelectCat = (id) => {
        setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleSelectAllCats = () => {
        const pageIds = paginatedCats.map(c => c.id);
        const allSelected = pageIds.every(id => selectedCats.includes(id));
        if (allSelected) {
            setSelectedCats(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedCats(prev => [...new Set([...prev, ...pageIds])]);
        }
    };

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">Portfolio Management</h2>

            {loading ? (
                <div className="py-5">
                    <LoadingSpinner text="Fetching portfolio assets..." />
                </div>
            ) : (
                <Tab.Container defaultActiveKey="items">
                    <Nav variant="tabs" className="mb-4">
                        <Nav.Item><Nav.Link eventKey="items">Portfolio Items</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="categories">Categories</Nav.Link></Nav.Item>
                    </Nav>

                    <Tab.Content>
                        {/* ITEMS TAB */}
                        <Tab.Pane eventKey="items">
                            <Row className="mb-3 g-3 align-items-center">
                                <Col lg={4} md={6}>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-white border-end-0"><Filter size={14} /></InputGroup.Text>
                                        <Form.Control placeholder="Search portfolio..." value={searchItem} onChange={e => setSearchItem(e.target.value)} className="border-start-0" />
                                    </InputGroup>
                                </Col>
                                <Col lg={2} md={3}>
                                    <Form.Select value={filterItemCat} onChange={e => setFilterItemCat(e.target.value)}>
                                        <option value="all">All Categories</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col lg={2} md={3}>
                                    <Form.Select value={filterItemStatus} onChange={e => setFilterItemStatus(e.target.value)}>
                                        <option value="all">Any Status</option>
                                        <option value="active">Active (Live)</option>
                                        <option value="inactive">Inactive</option>
                                    </Form.Select>
                                </Col>
                                <Col lg={2} md={3}>
                                    <Form.Select value={itemsPerPage} onChange={e => setItemsPerPage(parseInt(e.target.value))}>
                                        <option value="10">Show 10</option>
                                        <option value="50">Show 50</option>
                                        <option value="10000">Show All</option>
                                    </Form.Select>
                                </Col>
                                <Col lg={2} md={12} className="text-end">
                                    {selectedItems.length > 0 ? (
                                        <Button variant="danger" className="me-2" onClick={handleBulkDeleteItems} disabled={bulkDeleting}>
                                            <Trash2 size={14} className="me-1" /> Delete Selected ({selectedItems.length})
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => handleItemShow()}>+ New Portfolio Item</Button>
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
                                                        checked={paginatedItems.length > 0 && paginatedItems.every(i => selectedItems.includes(i.id))}
                                                        onChange={toggleSelectAllItems}
                                                    />
                                                </th>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Year</th>
                                                <th>Status</th>
                                                <th>Order</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedItems.length === 0 ? <tr><td colSpan="8" className="text-center py-5 text-muted">No items matching filters.</td></tr> : paginatedItems.map(item => (
                                                <tr key={item.id} className={selectedItems.includes(item.id) ? 'table-primary shadow-sm' : ''} style={{ transition: 'all 0.2s' }}>
                                                    <td>
                                                        <Form.Check 
                                                            type="checkbox" 
                                                            checked={selectedItems.includes(item.id)}
                                                            onChange={() => toggleSelectItem(item.id)}
                                                        />
                                                    </td>
                                                    <td>{item.image_url ? <Image src={item.image_url} alt="" width={60} height={40} style={{width: '60px', height: '40px', objectFit:'cover', borderRadius:'6px', border:'1px solid #eee'}} unoptimized /> : <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{width: 60, height: 40}}><Filter size={14} className="text-muted opacity-50" /></div>}</td>
                                                    <td>
                                                        <h6 className="mb-0 fw-bold">{item.title}</h6>
                                                        <small className="text-muted d-block" style={{fontSize: 10}}>{item.project_url ? 'Link Attached' : 'No External Link'}</small>
                                                    </td>
                                                    <td><Badge bg="light" text="dark" className="border">{getCatName(item.category_id)}</Badge></td>
                                                    <td>{item.project_year || '-'}</td>
                                                    <td>
                                                        {item.is_active == 1 ? (
                                                            <Badge bg="success-soft" className="text-success"><CheckCircle size={10} className="me-1" /> Live</Badge>
                                                        ) : (
                                                            <Badge bg="secondary-soft" className="text-secondary"><XCircle size={10} className="me-1" /> Hidden</Badge>
                                                        )}
                                                    </td>
                                                    <td>{item.sort_order}</td>
                                                    <td className="text-end">
                                                        <Button size="sm" variant="light" className="me-2" onClick={() => handleItemShow(item)}>Edit</Button>
                                                        <Button size="sm" variant="danger-soft" className="text-danger" onClick={() => handleItemDelete(item.id)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    
                                    {totalItemPages > 1 && (
                                        <Pagination className="justify-content-center mt-3">
                                            <Pagination.Prev disabled={itemPage === 1} onClick={() => setItemPage(itemPage - 1)} />
                                            {[...Array(totalItemPages)].map((_, idx) => (
                                                <Pagination.Item key={idx + 1} active={idx + 1 === itemPage} onClick={() => setItemPage(idx + 1)}>
                                                    {idx + 1}
                                                </Pagination.Item>
                                            ))}
                                            <Pagination.Next disabled={itemPage === totalItemPages} onClick={() => setItemPage(itemPage + 1)} />
                                        </Pagination>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab.Pane>

                        {/* CATEGORIES TAB */}
                        <Tab.Pane eventKey="categories">
                            <Row className="mb-3 g-3 align-items-center">
                                <Col lg={4} md={6}>
                                    <InputGroup>
                                        <InputGroup.Text><Filter size={14} /></InputGroup.Text>
                                        <Form.Control placeholder="Search categories..." value={searchCat} onChange={e => setSearchCat(e.target.value)} />
                                    </InputGroup>
                                </Col>
                                <Col lg={3} md={6}>
                                    <Form.Select value={filterCatStatus} onChange={e => setFilterCatStatus(e.target.value)}>
                                        <option value="all">Display All Status</option>
                                        <option value="active">Active Only</option>
                                        <option value="inactive">Inactive Only</option>
                                    </Form.Select>
                                </Col>
                                <Col lg={2} md={6}>
                                    <Form.Select value={catsPerPage} onChange={e => setCatsPerPage(parseInt(e.target.value))}>
                                        <option value="10">Show 10</option>
                                        <option value="50">Show 50</option>
                                        <option value="10000">Show All</option>
                                    </Form.Select>
                                </Col>
                                <Col lg={3} md={12} className="text-end">
                                    {selectedCats.length > 0 ? (
                                        <Button variant="danger" className="me-2" onClick={handleBulkDeleteCats} disabled={bulkDeleting}>
                                            <Trash2 size={14} className="me-1" /> Delete Categories ({selectedCats.length})
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => handleCatShow()}>+ Add Category</Button>
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
                                                <th>Slug</th>
                                                <th>Status</th>
                                                <th>Order</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedCats.length === 0 ? <tr><td colSpan="7" className="text-center py-5 text-muted">No categories found.</td></tr> : paginatedCats.map(cat => (
                                                <tr key={cat.id} className={selectedCats.includes(cat.id) ? 'table-primary shadow-sm' : ''} style={{ transition: 'all 0.2s' }}>
                                                    <td>
                                                        <Form.Check 
                                                            type="checkbox" 
                                                            checked={selectedCats.includes(cat.id)}
                                                            onChange={() => toggleSelectCat(cat.id)}
                                                        />
                                                    </td>
                                                    <td><code className="text-muted">#{cat.id}</code></td>
                                                    <td><strong>{cat.label}</strong></td>
                                                    <td><code>{cat.slug}</code></td>
                                                    <td>
                                                        <Badge bg={cat.is_active == 1 ? 'success-soft' : 'secondary-soft'} className={cat.is_active == 1 ? 'text-success' : 'text-secondary'}>
                                                            {cat.is_active == 1 ? 'Active' : 'Disabled'}
                                                        </Badge>
                                                    </td>
                                                    <td>{cat.sort_order}</td>
                                                    <td className="text-end">
                                                        <Button size="sm" variant="light" className="me-2" onClick={() => handleCatShow(cat)}>Edit</Button>
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
                    </Tab.Content>
                </Tab.Container>
            )}

            {/* Category Modal */}
            <Modal show={showCatModal} onHide={() => setShowCatModal(false)}>
                <Modal.Header closeButton><Modal.Title>{catForm.id ? 'Edit Category' : 'New Category'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleCatSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Slug (Must be unique, e.g. web-tools)</Form.Label>
                            <Form.Control type="text" value={catForm.slug} onChange={e => setCatForm({...catForm, slug: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Label</Form.Label>
                            <Form.Control type="text" value={catForm.label} onChange={e => setCatForm({...catForm, label: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} value={catForm.description || ''} onChange={e => setCatForm({...catForm, description: e.target.value})} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sort Order</Form.Label>
                                    <Form.Control type="number" value={catForm.sort_order} onChange={e => setCatForm({...catForm, sort_order: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Check type="checkbox" label="Is Active?" className="mt-4" checked={catForm.is_active == 1} onChange={e => setCatForm({...catForm, is_active: e.target.checked ? 1 : 0})} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCatModal(false)}>Close</Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Item Modal */}
            <Modal show={showItemModal} size="lg" onHide={() => setShowItemModal(false)}>
                <Modal.Header closeButton><Modal.Title>{itemForm.id ? 'Edit Portfolio Item' : 'New Portfolio Item'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleItemSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control type="text" required value={itemForm.title} onChange={e => setItemForm({...itemForm, title: e.target.value})} /></Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select value={itemForm.category_id} onChange={e => setItemForm({...itemForm, category_id: e.target.value})} required>
                                        <option value="">Select Category...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Project Year</Form.Label><Form.Control type="text" value={itemForm.project_year || ''} onChange={e => setItemForm({...itemForm, project_year: e.target.value})} /></Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Tags (JSON formatting)</Form.Label><Form.Control type="text" placeholder='["React", "Node"]' value={itemForm.tags || ''} onChange={e => setItemForm({...itemForm, tags: e.target.value})} /></Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Image URL (High Res)</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="text" placeholder="https://..." value={itemForm.image_url || ''} onChange={e => setItemForm({...itemForm, image_url: e.target.value})} />
                                        <Button variant="outline-primary" onClick={openMediaPicker}>Select from Gallery</Button>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3"><Form.Label>Project External Link</Form.Label><Form.Control type="text" value={itemForm.project_url || ''} onChange={e => setItemForm({...itemForm, project_url: e.target.value})} /></Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={4} value={itemForm.description || ''} onChange={e => setItemForm({...itemForm, description: e.target.value})} required /></Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Sort Order</Form.Label><Form.Control type="number" value={itemForm.sort_order} onChange={e => setItemForm({...itemForm, sort_order: e.target.value})} /></Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Check type="checkbox" label="Is Active?" className="mt-4" checked={itemForm.is_active == 1} onChange={e => setItemForm({...itemForm, is_active: e.target.checked ? 1 : 0})} />
                            </Col>
                        </Row>
                        {itemForm.image_url && (
                             <Row className="mt-3">
                                <Col md={12}>
                                    <div className="small text-muted mb-1">Image Preview:</div>
                                     <Image 
                                        src={itemForm.image_url} 
                                        alt="Preview" 
                                        width={200}
                                        height={150}
                                        style={{maxHeight:'150px', width: 'auto', borderRadius:'8px', border:'1px solid #ddd'}} 
                                        unoptimized
                                    />
                                </Col>
                             </Row>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowItemModal(false)}>Close</Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Media Picker Modal */}
            <Modal show={showMediaModal} size="xl" scrollable onHide={() => setShowMediaModal(false)}>
                <Modal.Header closeButton className="bg-light"><Modal.Title className="fw-bold">Select Asset from Gallery</Modal.Title></Modal.Header>
                <Modal.Body className="p-4">
                    {mediaLoading ? <p className="text-center py-5">Loading media library...</p> : (
                        <Row className="g-3">
                            {mediaItems.length === 0 ? <Col className="text-center py-5">No active media found. Upload some first!</Col> : mediaItems.map(m => (
                                <Col key={m.id} xs={6} sm={4} md={3} lg={2}>
                                    <Card 
                                        className="h-100 border-0 shadow-sm cursor-pointer hover-card" 
                                        onClick={() => handleMediaSelect(m.path)}
                                        style={{transition: 'transform 0.2s', border: itemForm.image_url === m.path ? '2px solid #0d6efd !important' : 'none'}}
                                    >
                                        <div style={{height:'120px'}} className="bg-light d-flex align-items-center justify-content-center overflow-hidden rounded-3 border">
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
                                                    width={120}
                                                    height={120}
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
                                            <div className="text-muted x-small text-uppercase">{m.provider}</div>
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
                .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); color: #198754; }
                .bg-secondary-soft { background-color: rgba(108, 117, 125, 0.1); color: #6c757d; }
                .bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; }
                .btn-danger-soft { background-color: rgba(220, 53, 69, 0.05); border: 1px solid rgba(220, 53, 69, 0.1); }
                .btn-danger-soft:hover { background-color: #dc3545; color: white !important; }
                .table-primary { background-color: rgba(13, 110, 253, 0.05) !important; }
            `}</style>
        </Container>
    );
};

export default PortfolioCMS;
