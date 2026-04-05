import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Spinner, Dropdown, Image } from 'react-bootstrap';
import { FileText, ExternalLink, Download, Trash2, MoreVertical, Database, Globe } from 'react-feather';
import { fetchApi } from "utils/api";

const AccessLibrary = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetchApi("/admin/dms/media");
                if (res.success) {
                    setMedia(res.data.slice(0, 10)); // Top 10 for profile overview
                }
            } catch (err) {
                console.error("Failed to fetch media", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const formatSize = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(ext)) return <Globe size={18} className="text-success" />;
        if (['pdf'].includes(ext)) return <FileText size={18} className="text-danger" />;
        if (['zip', 'rar', '7z'].includes(ext)) return <Database size={18} className="text-warning" />;
        return <FileText size={18} className="text-primary" />;
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted small">Loading media library...</p>
            </div>
        );
    }

    return (
        <Table hover responsive className="text-nowrap mb-0 align-middle">
            <thead className="table-light">
                <tr>
                    <th className="border-0">Asset Name</th>
                    <th className="border-0">Provider</th>
                    <th className="border-0">Size</th>
                    <th className="border-0">Uploaded At</th>
                    <th className="border-0 text-center">Status</th>
                    <th className="border-0"></th>
                </tr>
            </thead>
            <tbody>
                {media.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">No media assets found.</td>
                    </tr>
                ) : (
                    media.map((file, i) => (
                        <tr key={file.id}>
                            <td>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 rounded bg-light d-flex">
                                        {getFileIcon(file.file_name)}
                                    </div>
                                    <div>
                                        <h5 className="mb-0 fw-bold fs-6">
                                            {file.file_name.length > 30 ? file.file_name.substring(0, 30) + "..." : file.file_name}
                                        </h5>
                                        <small className="text-muted text-uppercase">{file.slug}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    {file.provider === 's3' ? (
                                        <Badge bg="info-soft" className="text-info border border-info-soft px-2 py-1">
                                            <Database size={10} className="me-1" /> S3 BUCKET
                                        </Badge>
                                    ) : (
                                        <Badge bg="primary-soft" className="text-primary border border-primary-soft px-2 py-1">
                                            <Globe size={10} className="me-1" /> IMAGEKIT
                                        </Badge>
                                    )}
                                </div>
                            </td>
                            <td><span className="text-muted fw-medium">{formatSize(file.size)}</span></td>
                            <td className="text-muted">{formatDate(file.uploaded_at)}</td>
                            <td className="text-center">
                                {file.status === 1 ? (
                                    <span className="badge-dot bg-success me-1 d-inline-block"></span>
                                ) : (
                                    <span className="badge-dot bg-danger me-1 d-inline-block"></span>
                                )}
                                <span className="small fw-medium">{file.status === 1 ? 'Live' : 'Hidden'}</span>
                            </td>
                            <td className="text-end">
                                <Dropdown align="end">
                                    <Dropdown.Toggle as="a" className="btn btn-ghost btn-icon btn-sm rounded-circle p-0" variant="light" id={`media-dropdown-${file.id}`} style={{cursor: 'pointer'}}>
                                        <MoreVertical size={16} className="text-muted" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href={file.path} target="_blank">
                                            <ExternalLink size={14} className="me-2 text-primary" /> View Original
                                        </Dropdown.Item>
                                        <Dropdown.Item href={`/cms/media`}>
                                            <Trash2 size={14} className="me-2 text-danger" /> Manage in Center
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
};

export default AccessLibrary;
