import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Nav, Tab, Pagination, InputGroup } from 'react-bootstrap';
import Image from 'next/image';
import { fetchApi } from '../../utils/api';

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
    const itemsPerPage = 10;
    
    const [searchCat, setSearchCat] = useState('');
    const [filterCatStatus, setFilterCatStatus] = useState('all'); // all, active, inactive
    const [catPage, setCatPage] = useState(1);
    const catsPerPage = 10;

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
    const filteredItems = items.filter(i => 
        i.title.toLowerCase().includes(searchItem.toLowerCase()) || 
        getCatName(i.category_id).toLowerCase().includes(searchItem.toLowerCase())
    );
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
    useEffect(() => { setItemPage(1); }, [searchItem]);
    useEffect(() => { setCatPage(1); }, [searchCat, filterCatStatus]);

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

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">Portfolio Management</h2>

            <Tab.Container defaultActiveKey="items">
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item><Nav.Link eventKey="items">Portfolio Items</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="categories">Categories</Nav.Link></Nav.Item>
                </Nav>

                <Tab.Content>
                    {/* ITEMS TAB */}
                    <Tab.Pane eventKey="items">
                        <Row className="mb-3 align-items-center">
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control placeholder="Search items by title or category..." value={searchItem} onChange={e => setSearchItem(e.target.value)} />
                                </InputGroup>
                            </Col>
                            <Col md={6} className="text-end">
                                <Button variant="primary" onClick={() => handleItemShow()}>Add Portfolio Item</Button>
                            </Col>
                        </Row>
                        <Card>
                            <Card.Body>
                                {loading ? <p>Loading...</p> : (
                                    <>
                                        <Table hover responsive>
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Category</th>
                                                    <th>Year</th>
                                                    <th>Active</th>
                                                    <th>Order</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedItems.length === 0 ? <tr><td colSpan="7">No items found.</td></tr> : paginatedItems.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.image_url ? <Image src={item.image_url} alt="" width={60} height={40} style={{width: '60px', height: '40px', objectFit:'cover', borderRadius:'4px'}} unoptimized /> : 'None'}</td>
                                                        <td><strong>{item.title}</strong></td>
                                                        <td>{getCatName(item.category_id)}</td>
                                                        <td>{item.project_year || '-'}</td>
                                                        <td><span className={`badge bg-${item.is_active == 1 ? 'success' : 'secondary'}`}>{item.is_active == 1 ? 'Yes' : 'No'}</span></td>
                                                        <td>{item.sort_order}</td>
                                                        <td>
                                                            <Button size="sm" variant="info" className="me-2" onClick={() => handleItemShow(item)}>Edit</Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleItemDelete(item.id)}>Delete</Button>
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
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Tab.Pane>

                    {/* CATEGORIES TAB */}
                    <Tab.Pane eventKey="categories">
                        <Row className="mb-3 align-items-center">
                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control placeholder="Search categories by label or slug..." value={searchCat} onChange={e => setSearchCat(e.target.value)} />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <Form.Select value={filterCatStatus} onChange={e => setFilterCatStatus(e.target.value)}>
                                    <option value="all">Display All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </Form.Select>
                            </Col>
                            <Col md={4} className="text-end">
                                <Button variant="primary" onClick={() => handleCatShow()}>Add Category</Button>
                            </Col>
                        </Row>
                        <Card>
                            <Card.Body>
                                {loading ? <p>Loading...</p> : (
                                    <>
                                        <Table hover responsive>
                                            <thead className="table-light">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Label</th>
                                                    <th>Slug</th>
                                                    <th>Active</th>
                                                    <th>Order</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedCats.length === 0 ? <tr><td colSpan="6">No categories found.</td></tr> : paginatedCats.map(cat => (
                                                    <tr key={cat.id}>
                                                        <td>{cat.id}</td>
                                                        <td><strong>{cat.label}</strong></td>
                                                        <td><code>{cat.slug}</code></td>
                                                        <td><span className={`badge bg-${cat.is_active == 1 ? 'success' : 'secondary'}`}>{cat.is_active == 1 ? 'Yes' : 'No'}</span></td>
                                                        <td>{cat.sort_order}</td>
                                                        <td>
                                                            <Button size="sm" variant="info" className="me-2" onClick={() => handleCatShow(cat)}>Edit</Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleCatDelete(cat.id)}>Delete</Button>
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
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

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
                                            <Image 
                                                src={m.path} 
                                                alt={m.file_name} 
                                                width={120}
                                                height={120}
                                                className="mw-100 mh-100 object-fit-contain" 
                                                unoptimized
                                            />
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
            `}</style>
        </Container>
    );
};

export default PortfolioCMS;
