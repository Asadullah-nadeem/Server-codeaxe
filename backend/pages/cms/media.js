import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Container, Badge, ProgressBar, InputGroup, OverlayTrigger, Tooltip, Alert, Dropdown, Table } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { CloudUpload, Trash, ArrowClockwise, Eye, Search, CheckCircle, ThreeDotsVertical, Database, Filter, ClockHistory, Files } from 'react-bootstrap-icons';

const MediaCMS = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [auditMedia, setAuditMedia] = useState(null);

    const [uploadConfig, setUploadConfig] = useState({ provider: 'imagekit', folder: 'general' });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/dms/media/all');
            if (res?.success) setMedia(res.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const fetchLogs = async (item) => {
        try {
            const res = await fetchApi(`/admin/dms/media/${item.id}/logs`);
            if (res?.success) setAuditMedia({ ...item, logs: res.data });
        } catch (error) { alert("Failed to fetch audit history."); }
    };

    useEffect(() => { fetchMedia(); }, []);



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
            formData.append('username', 'admin');

            const data = await fetchApi('/admin/dms/media', { method: 'POST', body: formData });
            if (data?.success) {
                setShowUploadModal(false);
                fetchMedia();
                setPreviewUrl(null);
                setSelectedFile(null);
            } else { alert(data?.message || 'Upload failed.'); }
        } catch (error) { alert('Upload error occurred. Check your cloud credentials.'); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Move this asset to trash?')) return;
        try {
            await fetchApi(`/admin/dms/media/${id}`, { method: 'DELETE' });
            fetchMedia();
        } catch (error) { alert("Delete failed."); }
    };

    const handleRestore = async (id) => {
        try {
            await fetchApi(`/admin/dms/media/${id}/restore`, { method: 'POST' });
            fetchMedia();
        } catch (error) { alert("Restore failed."); }
    };

    const handlePermanentDelete = async (id) => {
        if (!confirm('CRITICAL: This will PERMANENTLY delete the asset from Cloud Storage (ImageKit/S3) and the database. This action CANNOT be undone. Proceed?')) return;
        try {
            const res = await fetchApi(`/admin/dms/media/${id}/permanent`, { method: 'DELETE' });
            if (res?.success) fetchMedia();
            else alert(res?.message || "Permanent delete failed.");
        } catch (error) { alert("Permanent delete error."); }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Proxied URL copied!");
    };

    const [activeTab, setActiveTab] = useState('active'); // active, trash

    const displayMedia = activeTab === 'active' 
        ? media.filter(m => m.status === 1) 
        : media.filter(m => m.status === 0);

    const filteredMedia = displayMedia.filter(item => {
        return (item.file_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
               (item.slug || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) return <Container fluid className="p-4"><p className="text-muted"><ArrowClockwise size={14} className="animate-spin me-2"/> Loading Media Library...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-1">Media Manager</h2>
            <p className="text-muted small mb-4">Manage cloud assets and track audit history in your centralized library.</p>

            <Card className="mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0">{activeTab === 'active' ? 'Active Assets' : 'Trash Bin'}</h5>
                    <div className="d-flex gap-2">
                        <Button variant="light" size="sm" onClick={() => fetchMedia()}>Refresh</Button>
                        <Button variant="dark" size="sm" onClick={() => setShowUploadModal(true)}>Upload New</Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between flex-wrap gap-3 mb-4 border-bottom pb-3">
                        <div className="d-flex gap-2">
                            <Button 
                                variant={activeTab === 'active' ? 'primary' : 'outline-primary'} 
                                size="sm" 
                                className="px-4 fw-bold"
                                onClick={() => setActiveTab('active')}
                            >
                                <CheckCircle size={14} className="me-2"/> Library
                            </Button>
                            <Button 
                                variant={activeTab === 'trash' ? 'danger' : 'outline-danger'} 
                                size="sm" 
                                className="px-4 fw-bold"
                                onClick={() => setActiveTab('trash')}
                            >
                                <Trash size={14} className="me-2"/> Trash ({media.filter(m => m.status === 0).length})
                            </Button>
                        </div>
                        <div className="flex-grow-1" style={{maxWidth: '400px'}}>
                            <InputGroup size="sm">
                                <InputGroup.Text><Search size={12}/></InputGroup.Text>
                                <Form.Control 
                                    placeholder="Search by filename or slug..." 
                                    value={searchTerm} 
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>

                    <Row className="g-4">
                        {filteredMedia.length === 0 ? (
                            <Col xs={12} className="text-center py-5 text-muted">
                                {activeTab === 'active' ? 'No active assets found.' : 'Trash is empty.'}
                            </Col>
                        ) : filteredMedia.map(item => (
                            <Col key={item.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                                <Card className={`h-100 border shadow-sm ${item.status === 0 ? 'bg-light border-danger border-opacity-25' : ''}`}>
                                    <div className="p-1">
                                        <div style={{ height: '140px', background: '#f8f9fa' }} className="rounded overflow-hidden d-flex align-items-center justify-content-center border position-relative">
                                            <img src={item.path} alt={item.file_name} className="mw-100 mh-100 object-fit-contain" />
                                            {item.status === 0 && <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{background: 'rgba(255,255,255,0.4)'}}><Badge bg="danger">IN TRASH</Badge></div>}
                                        </div>
                                    </div>
                                    <Card.Body className="p-3 pt-2">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="text-truncate small fw-bold" style={{maxWidth: '120px'}} title={item.file_name}>
                                                {item.file_name}
                                            </div>
                                            <Dropdown align="end">
                                                <Dropdown.Toggle variant="link" className="p-0 border-0 shadow-none text-muted hide-caret">
                                                     <ThreeDotsVertical size={14}/>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="shadow-lg border">
                                                    <Dropdown.Item onClick={() => window.open(item.path, '_blank')}><Eye size={14} className="me-2 text-info"/> View Large</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => copyToClipboard(item.path)}><Files size={14} className="me-2 text-success"/> Copy Link</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => fetchLogs(item)}><ClockHistory size={14} className="me-2 text-primary"/> History</Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    {item.status === 1 ? (
                                                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(item.id)}><Trash size={14} className="me-2"/> Move to Trash</Dropdown.Item>
                                                    ) : (
                                                        <>
                                                            <Dropdown.Item className="text-success" onClick={() => handleRestore(item.id)}><CheckCircle size={14} className="me-2"/> Restore Asset</Dropdown.Item>
                                                            <Dropdown.Item className="text-danger fw-bold" onClick={() => handlePermanentDelete(item.id)}><Trash size={14} className="me-2"/> Permanent Delete</Dropdown.Item>
                                                        </>
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex gap-1">
                                                <Badge bg={item.provider === 'imagekit' ? 'info' : 'warning'} className="x-small px-2 py-1 text-uppercase">{item.provider}</Badge>
                                                <Badge bg="secondary" className="x-small px-2 py-1 text-uppercase">{item.file_name?.split('.').pop() || 'IMG'}</Badge>
                                            </div>
                                            <span className="text-muted x-small fw-bold">{(item.size ? (item.size / 1024).toFixed(1) : '0.0')} KB</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold">Cloud Asset Upload</Modal.Title></Modal.Header>
                <Form onSubmit={handleUpload}>
                    <Modal.Body className="p-4">
                        <div className="border border-dashed p-5 text-center mb-3 bg-light cursor-pointer rounded-3" onClick={() => !uploading && document.getElementById('fileInput').click()}>
                            {previewUrl ? (
                                <img src={previewUrl} className="rounded shadow-sm mw-100 mb-2" style={{maxHeight: '200px'}} alt="Preview" />
                            ) : (
                                <div>
                                    <CloudUpload size={40} className="text-primary mb-2 opacity-50" />
                                    <p className="mb-0 small fw-bold text-muted">Click to browse your device</p>
                                </div>
                            )}
                            <input type="file" id="fileInput" hidden onChange={handleFileChange} accept="image/*" />
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold"><Database size={12} className="me-2"/> Select Storage Node</Form.Label>
                            <Form.Select value={uploadConfig.provider} onChange={e => setUploadConfig({...uploadConfig, provider: e.target.value})}>
                                <option value="imagekit">ImageKit.io (Optimized)</option>
                                <option value="s3">AWS S3 (Standard Storage)</option>
                            </Form.Select>
                        </Form.Group>

                        {uploading && <ProgressBar animated now={100} label="Streaming..." style={{height: '10px'}} className="rounded-pill mt-3" />}
                    </Modal.Body>
                    <Modal.Footer className="bg-light border-0">
                        <Button variant="secondary" size="sm" onClick={() => setShowUploadModal(false)}>Close</Button>
                        <Button type="submit" variant="primary" size="sm" className="px-4" disabled={!selectedFile || uploading}>Sync to Cloud</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={!!auditMedia} onHide={() => setAuditMedia(null)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold">Audit History: {auditMedia?.file_name}</Modal.Title></Modal.Header>
                <Modal.Body className="p-0">
                    <Table hover responsive className="mb-0 x-small border-0">
                        <thead className="table-light"><tr><th>Timestamp</th><th>Action</th><th>Field</th><th>Transformation</th></tr></thead>
                        <tbody>
                            {auditMedia?.logs?.map((log, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(log.changed_at).toLocaleString()}</td>
                                    <td><Badge bg={log.action_type === 'DELETE' ? 'danger' : (log.action_type === 'EDIT' ? 'info' : 'success')}>{log.action_type}</Badge></td>
                                    <td className="fw-bold text-secondary text-uppercase">{log.field_changed}</td>
                                    <td className="font-monospace">
                                        <span className="text-muted">{log.old_value}</span>
                                        <span className="mx-2 text-primary">&rarr;</span>
                                        <span className="fw-bold text-dark">{log.new_value}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <style jsx>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .x-small { font-size: 11px; }
                :global(.hide-caret::after) { display: none !important; }
            `}</style>
        </Container>
    );
};

export default MediaCMS;
