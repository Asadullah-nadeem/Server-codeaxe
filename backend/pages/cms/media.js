import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Container, Badge, ProgressBar, InputGroup, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { UploadCloud, Trash2, Copy, RefreshCcw, Eye, Search, CheckCircle } from 'react-feather';

const MediaCMS = () => {
    const [media, setMedia] = useState([]);
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [uploadConfig, setUploadConfig] = useState({ provider: 'imagekit', folder: 'general' });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/dms/media/all');
            if (res?.success) setMedia(res.data);
            
            const resKeys = await fetchApi('/admin/dms/keys');
            if (resKeys?.success) setKeys(resKeys.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMedia(); }, []);

    const filteredMedia = media.filter(item => {
        const matchesSearch = item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' ? true : 
                             (filterStatus === 'trash' ? item.status === 0 : item.status === 1);
        return matchesSearch && matchesFilter;
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);
            formData.append('storage_provider', uploadConfig.provider);
            formData.append('username', 'admin'); // Use default admin folder

            const data = await fetchApi('/admin/dms/media', {
                method: 'POST',
                body: formData
            });

            if (data.success) {
                setShowUploadModal(false);
                fetchMedia();
                setPreviewUrl(null);
                setSelectedFile(null);
            } else { alert(data.message || 'Upload failed.'); }
        } catch (error) { alert('Upload error occurred.'); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Move this item to trash?')) return;
        try {
            await fetchApi(`/admin/dms/media/${id}`, { method: 'DELETE' });
            fetchMedia();
        } catch (error) { alert("Delete failed."); }
    };

    const handleRestore = async (id) => {
        try {
            await fetchApi(`/admin/dms/media/${id}`, { method: 'PUT', body: JSON.stringify({ status: 1 }) });
            fetchMedia();
        } catch (error) { alert("Restore failed."); }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("URL copied to clipboard!");
    };

    if (loading) return <Container fluid className="p-4"><p>Accessing cloud assets...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Media Library (A-Z)</h2>
                    <p className="text-muted small mb-0">Manage cloud assets across all providers from one centralized library.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-dark" size="sm" onClick={() => fetchMedia()}>
                        <RefreshCcw size={14} className="me-2" /> Refresh
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setShowUploadModal(true)}>
                        <UploadCloud size={14} className="me-2" /> Sync to Cloud
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-3">
                    <Row className="g-3">
                        <Col lg={7}>
                            <InputGroup size="sm">
                                <InputGroup.Text className="bg-white border-end-0"><Search size={14} /></InputGroup.Text>
                                <Form.Control 
                                    className="border-start-0" 
                                    placeholder="Search filename or slug..." 
                                    value={searchTerm} 
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col lg={5}>
                            <div className="d-flex gap-2 justify-content-lg-end">
                                <Button size="sm" variant={filterStatus === 'all' ? 'dark' : 'outline-dark'} onClick={() => setFilterStatus('all')}>All Assets</Button>
                                <Button size="sm" variant={filterStatus === 'active' ? 'dark' : 'outline-dark'} onClick={() => setFilterStatus('active')}>Active</Button>
                                <Button size="sm" variant={filterStatus === 'trash' ? 'dark' : 'outline-dark'} onClick={() => setFilterStatus('trash')}>Trash</Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {filteredMedia.length === 0 ? (
                    <Col xs={12}>
                        <div className="text-center py-5 bg-white rounded shadow-sm">
                            <Eye size={40} className="text-muted mb-3 opacity-25" />
                            <h5 className="text-muted">No media found</h5>
                        </div>
                    </Col>
                ) : (
                    filteredMedia.map(item => (
                        <Col key={item.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                            <Card className="h-100 border-0 shadow-sm position-relative overflow-hidden group">
                                <div className="p-2">
                                    <div className="bg-light rounded overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '160px' }}>
                                        <img src={item.path} alt={item.file_name} className={`w-100 h-100 object-fit-cover ${item.status === 0 ? 'opacity-50 grayscale' : ''}`} />
                                    </div>
                                </div>
                                <Card.Body className="pt-0 px-3 pb-3">
                                    <h6 className="text-truncate mb-1 small fw-bold">{item.file_name}</h6>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Badge bg="light" className="text-dark border uppercase x-small px-2 py-1" style={{fontSize: '9px'}}>{item.provider}</Badge>
                                        <span className="text-muted x-small" style={{fontSize: '9px'}}>{(item.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                    <div className="d-flex gap-1 justify-content-end border-top pt-2 mt-2">
                                        <OverlayTrigger overlay={<Tooltip>Open URL</Tooltip>}>
                                            <Button size="sm" variant="link" className="p-1" onClick={() => window.open(item.path, '_blank')}><Eye size={12} /></Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>Copy Proxy URL</Tooltip>}>
                                            <Button size="sm" variant="link" className="p-1" onClick={() => copyToClipboard(item.path)}><Copy size={12} /></Button>
                                        </OverlayTrigger>
                                        {item.status === 1 ? (
                                            <Button size="sm" variant="link" className="p-1 text-danger" onClick={() => handleDelete(item.id)}><Trash2 size={12} /></Button>
                                        ) : (
                                            <Button size="sm" variant="link" className="p-1 text-success" onClick={() => handleRestore(item.id)}><CheckCircle size={12}/></Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Upload Modal */}
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Sync New Asset to Cloud</Modal.Title></Modal.Header>
                <Form onSubmit={handleUpload}>
                    <Modal.Body className="p-4">
                        <div className="border border-dashed rounded-3 p-4 text-center mb-4 bg-light cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
                            {previewUrl ? (
                                <img src={previewUrl} className="max-h-200 w-100 object-fit-contain rounded shadow-sm mb-2" alt="Preview" />
                            ) : (
                                <>
                                    <UploadCloud size={30} className="text-primary mb-2 opacity-50" />
                                    <h6 className="mb-1">Click to browse or drop files here</h6>
                                    <p className="text-muted x-small mb-0">JPG, PNG, WEBP (Max 5MB)</p>
                                </>
                            )}
                            <input type="file" id="fileInput" hidden onChange={handleFileChange} accept="image/*" />
                        </div>

                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Label className="x-small fw-bold uppercase">Target Cloud</Form.Label>
                                <Form.Select size="sm" value={uploadConfig.provider} onChange={e => setUploadConfig({...uploadConfig, provider: e.target.value})}>
                                    <option value="imagekit">ImageKit.io</option>
                                    <option value="s3">AWS S3 (Default)</option>
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="x-small fw-bold uppercase">Folder Path</Form.Label>
                                <Form.Control size="sm" placeholder="e.g. avatars" value={uploadConfig.folder} onChange={e => setUploadConfig({...uploadConfig, folder: e.target.value})} />
                            </Col>
                        </Row>

                        <div className="mt-4 p-3 bg-light rounded-3">
                            <p className="x-small fw-bold mb-2">Active API Keys:</p>
                            <div className="d-flex flex-column gap-1">
                                {keys.slice(0, 2).map(k => (
                                    <div key={k.id} className="d-flex justify-content-between align-items-center bg-white p-2 rounded-2 border">
                                        <span className="x-small fw-bold">{k.label}</span>
                                        <code className="x-small text-muted">{k.api_key}</code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {uploading && (
                            <div className="mt-3">
                                <p className="x-small mb-1 fw-bold text-primary">Encrypting & Streaming...</p>
                                <ProgressBar animated now={100} style={{height: '4px'}} />
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="bg-light border-0">
                        <Button variant="secondary" size="sm" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" size="sm" disabled={!selectedFile || uploading}>
                            {uploading ? 'Uploading...' : 'Deploy to Cloud'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <style jsx>{`
                .max-h-200 { max-height: 200px; }
                .cursor-pointer { cursor: pointer; }
                .grayscale { filter: grayscale(1); }
                .x-small { font-size: 10px; }
            `}</style>
        </Container>
    );
};

export default MediaCMS;
