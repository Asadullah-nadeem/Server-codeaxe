import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
  Tab,
  Table,
  Tabs
} from 'react-bootstrap';
import {
  AtSign,
  CheckCircle,
  Edit2,
  Eye, EyeOff,
  Lock, Mail,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  UserPlus,
  XCircle
} from 'react-feather';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

// ─── Permission Matrix Section Definitions ─────────────────────────────────────────
const PERM_GROUPS = [
    {
        group: 'CMS Content', color: '#0d6efd',
        items: [
            { key: 'navigation', label: 'Navigation',        icon: 'menu' },
            { key: 'home',       label: 'Home Settings',     icon: 'layout' },
            { key: 'footer',     label: 'Footer',            icon: 'corner-left-down' },
            { key: 'services',   label: 'Services',          icon: 'briefcase' },
            { key: 'portfolio',  label: 'Portfolio',         icon: 'image' },
            { key: 'about',      label: 'About Us',          icon: 'info' },
            { key: 'legal',      label: 'Legal Pages',       icon: 'file-text' },
            { key: 'sections',   label: 'Section Visibility',icon: 'toggle-left' },
            { key: 'rewrites',   label: 'SEO & Rewrites',    icon: 'link' },
        ]
    },
    {
        group: 'Communication', color: '#198754',
        items: [
            { key: 'contact', label: 'Contact Submissions',      icon: 'mail' },
            { key: 'emails',  label: 'Email Templates',          icon: 'edit-2' },
            { key: 'smtp',    label: 'SMTP Settings',            icon: 'settings' },
            { key: 'chat',    label: 'Client Messaging (Chat)',  icon: 'message-square' },
        ]
    },
    {
        group: 'Media & Storage', color: '#6f42c1',
        items: [
            { key: 'media', label: 'Media Manager', icon: 'folder' },
            { key: 'dms',   label: 'DMS Settings',  icon: 'database' },
        ]
    },
    {
        group: 'User Management', color: '#dc3545',
        locked: true,   // Super Admin only — these rows cannot be edited
        items: [
            { key: 'registered_users', label: 'Registered Users',  icon: 'users' },
            { key: 'admin_accounts',   label: 'Admin Accounts',    icon: 'shield' },
            { key: 'superadmin',       label: 'Super Admin Panel', icon: 'lock' },
        ]
    },
];

const OPS = ['view', 'create', 'edit', 'delete'];

// ── Role Manager Component ──────────────────────────────────────────────────
const RoleManager = ({ roles, onUpdate }) => {
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ id: null, name: '', label: '', color: 'primary', description: '' });

    const openCreate = () => { setForm({ id: null, name: '', label: '', color: 'primary', description: '' }); setShow(true); };
    const openEdit = (r) => { setForm({ ...r }); setShow(true); };

    const save = async () => {
        setSaving(true);
        try {
            await fetchApi('/admin/roles', { method: 'POST', body: JSON.stringify(form) });
            setShow(false);
            onUpdate();
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    const drop = async (id) => {
        if (!confirm('Delete this role? All permissions and user assignments will be removed.')) return;
        try {
            await fetchApi(`/admin/roles/${id}`, { method: 'DELETE' });
            onUpdate();
        } catch (e) { alert(e.message); }
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-bold"><Shield size={16} className="me-2" />Role Management</div>
                <Button size="sm" variant="primary" onClick={openCreate}><UserPlus size={14} className="me-1" /> New Role</Button>
            </div>
            <Row className="g-3">
                {roles.map(r => (
                    <Col key={r.id} lg={4} md={6}>
                        <Card className="border-0 shadow-sm h-100" style={{ borderLeft: `4px solid var(--bs-${r.color})` }}>
                            <Card.Body className="p-3">
                                <div className="d-flex justify-content-between">
                                    <Badge bg={r.color}>{r.label}</Badge>
                                    <div className="d-flex gap-1">
                                        <Button variant="link" className="p-0 text-muted" onClick={() => openEdit(r)}><Edit2 size={12} /></Button>
                                        {!['superadmin', 'admin', 'demo'].includes(r.name) && (
                                            <Button variant="link" className="p-0 text-danger" onClick={() => drop(r.id)}><Trash2 size={12} /></Button>
                                        )}
                                    </div>
                                </div>
                                <div className="small text-muted mt-2">{r.description || 'No description.'}</div>
                                <div className="mt-1" style={{ fontSize: '0.65rem', opacity: 0.6 }}>Slug: {r.name}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={show} onHide={() => setShow(false)} centered size="sm">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title style={{ fontSize: '1rem' }}>{form.id ? 'Edit Role' : 'Create Role'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-2">
                        <Form.Label className="small fw-bold">Display Label</Form.Label>
                        <Form.Control size="sm" value={form.label} onChange={e => setForm({...form, label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_')})} placeholder="Managing Editor" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label className="small fw-bold">System Name (Slug)</Form.Label>
                        <Form.Control size="sm" value={form.name} readOnly={!!form.id} onChange={e => setForm({...form, name: e.target.value})} placeholder="editor" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label className="small fw-bold">Color Theme</Form.Label>
                        <Form.Select size="sm" value={form.color} onChange={e => setForm({...form, color: e.target.value})}>
                            {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'].map(c => <option key={c} value={c}>{c}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="small fw-bold">Description</Form.Label>
                        <Form.Control as="textarea" rows={2} size="sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="primary" size="sm" className="w-100" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Role'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

// ── Editable Permission Cell ─────────────────────────────────────────────────
const EditPermCell = ({ checked, locked, onChange }) => (
    <td className="text-center" style={{ verticalAlign: 'middle', padding: '5px 4px' }}>
        {locked ? (
            <span style={{ color: '#dc3545', fontSize: 13, opacity: 0.5 }} title="Locked — Super Admin only">✗</span>
        ) : (
            <Form.Check
                type="checkbox"
                checked={!!checked}
                onChange={e => onChange(e.target.checked)}
                style={{ margin: 0, cursor: 'pointer' }}
                title={checked ? 'Click to deny' : 'Click to allow'}
            />
        )}
    </td>
);

// ── Editable Permissions Panel ──────────────────────────────────────────────
const PermissionsPanel = ({ roles, setRoles }) => {
    const [open, setOpen]       = React.useState(true);
    const [perms, setPerms]     = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving]   = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const [error, setError]     = React.useState(null);
    const [dirty, setDirty]     = React.useState({});
    const [activeRole, setActiveRole] = React.useState('admin');

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchApi('/admin/permissions');
            if (res?.success) {
                setPerms(res.data);
                if (res.roles) setRoles(res.roles);
            } else if (res) {
                setError(res.message || 'Permissions pull gave no success.');
            }
        } catch (e) { 
            console.error('Permissions load failed', e);
            setError(`Could not load permissions matrix: ${e.message}`); 
        } finally { setLoading(false); }
    };

    React.useEffect(() => { loadData(); }, []);

    React.useEffect(() => {
        if (!activeRole && roles.length > 0) setActiveRole(roles[0].name);
        else if (roles.length > 0 && !roles.find(r => r.name === activeRole)) setActiveRole(roles[0].name);
    }, [roles, activeRole]);

    const togglePerm = (role, sectionKey, op, value) => {
        setPerms(prev => {
            const rolePerms = prev[role] || {};
            const section = rolePerms[sectionKey] || {};
            return {
                ...prev,
                [role]: {
                    ...rolePerms,
                    [sectionKey]: { ...section, [op]: value }
                }
            };
        });
        setDirty(prev => ({ ...prev, [role]: true }));
    };

    const toggleRow = (role, sectionKey, allOn) => {
        const newVal = { view: allOn, create: allOn, edit: allOn, delete: allOn };
        setPerms(prev => ({
            ...prev,
            [role]: { ...(prev[role] || {}), [sectionKey]: newVal }
        }));
        setDirty(prev => ({ ...prev, [role]: true }));
    };

    const saveRole = async (role) => {
        setSaving(role);
        try {
            await fetchApi('/admin/permissions/bulk', { method: 'POST', body: JSON.stringify({ role, permissions: perms[role] }) });
            setSuccess(`Permissions for ${role} saved.`);
            setDirty(prev => ({ ...prev, [role]: false }));
        } catch (e) { setError(`Failed to save ${role} permissions.`); }
        finally { setSaving(null); setTimeout(() => setSuccess(null), 3000); }
    };

    const resetRole = async (role) => {
        if (!confirm(`Reset all ${role} permissions?`)) return;
        setSaving(role);
        try {
            await fetchApi('/admin/permissions/reset', { method: 'POST', body: JSON.stringify({ role }) });
            loadData();
            setSuccess(`${role} reset successfully.`);
            setDirty(prev => ({ ...prev, [role]: false }));
        } catch (e) { setError(`Failed to reset ${role}.`); }
        finally { setSaving(null); setTimeout(() => setSuccess(null), 3000); }
    };

    return (
        <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: 14 }}>
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3" style={{ cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
                <div className="d-flex align-items-center gap-2">
                    <Lock size={16} style={{ color: '#6f42c1' }} />
                    <div className="fw-bold small mb-0">Role Access Control [{roles.find(r=>r.name===activeRole)?.label}]</div>
                </div>
                <div className="d-flex align-items-center gap-2" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant={dirty[activeRole] ? 'primary' : 'outline-primary'} onClick={()=>saveRole(activeRole)} disabled={saving || !dirty[activeRole]} style={{fontSize:'0.7rem'}}>{saving===activeRole ? 'Saving...' : 'Save Changes'}</Button>
                    <span className="text-muted ms-1 small">{open ? '▲' : '▼'}</span>
                </div>
            </Card.Header>

            {open && (
                <Card.Body className="p-0">
                    <div className="d-flex border-bottom overflow-auto" style={{ background: '#f8f9fa' }}>
                        {roles.map(r => (
                            <button key={r.name} onClick={() => setActiveRole(r.name)} className={`px-4 py-2 border-0 ${activeRole === r.name ? 'bg-white fw-bold' : 'text-muted'}`} style={{ fontSize: '0.75rem', borderBottom: activeRole === r.name ? `2px solid var(--bs-${r.color})` : 'none', minWidth: 100 }}>
                                {r.label} {dirty[r.name] && '●'}
                            </button>
                        ))}
                    </div>

                    {loading ? <LoadingSpinner text="Fetching permission matrix..." className="p-4 small" fluid={false} /> : (
                        <div className="table-responsive">
                            <table className="table table-sm mb-0">
                                <thead>
                                    <tr style={{background:'#fafafa'}}>
                                        <th className="ps-4 small py-2" style={{width:'30%'}}>Section</th>
                                        {OPS.map(op => <th key={op} className="text-center small py-2">{op}</th>)}
                                        <th className="text-center small py-2">Quick Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PERM_GROUPS.map(group => (
                                        <React.Fragment key={group.group}>
                                            <tr style={{background: group.color + '05'}}>
                                                <td colSpan={6} className="ps-4 small fw-bold py-1" style={{color: group.color, fontSize:'0.7rem'}}>{group.group.toUpperCase()}</td>
                                            </tr>
                                            {group.items.map(item => {
                                                const row = perms[activeRole]?.[item.key] || {};
                                                const allOn = OPS.every(op => row[op]);
                                                const isLocked = !!group.locked || activeRole === 'superadmin';
                                                return (
                                                    <tr key={item.key} style={{fontSize:'0.8rem', opacity: isLocked ? 0.6 : 1}}>
                                                        <td className="ps-4 py-1">{item.label}</td>
                                                        {OPS.map(op => (
                                                            <EditPermCell key={op} checked={row[op]} locked={isLocked} onChange={v => togglePerm(activeRole, item.key, op, v)} />
                                                        ))}
                                                        <td className="text-center">
                                                            <Button size="sm" variant={allOn ? 'outline-danger' : 'outline-success'} onClick={() => toggleRow(activeRole, item.key, !allOn)} disabled={isLocked} style={{fontSize:'0.6rem', padding:'1px 5px'}}>
                                                                {allOn ? 'Deny All' : 'Grant All'}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="p-2 border-top bg-light text-center">
                        <Button size="sm" variant="link" className="text-danger small p-0" onClick={()=>resetRole(activeRole)} disabled={saving}>Reset {activeRole} to Defaults</Button>
                    </div>
                </Card.Body>
            )}
        </Card>
    );
};
// ─── Detail Slide-over Panel ─────────────────────────────────────────────────
const AdminDetailPanel = ({ admin, roles, onClose, onEdit, onDelete }) => {
    if (!admin) return null;
    const r = roles.find(x => x.name === admin.role) || { label: admin.role, color: 'secondary' };

    return (
        <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: 360,
            background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
            zIndex: 1050, display: 'flex', flexDirection: 'column',
            animation: 'slideInRight 0.25s ease'
        }}>
            <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

            <div style={{ background: `var(--bs-${r.color})`, padding: '24px 20px 20px' }}>
                <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-3">
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 22, fontWeight: 700
                        }}>
                            {admin.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="text-white">
                            <div className="fw-bold fs-6">{admin.name}</div>
                            <small>@{admin.username}</small>
                        </div>
                    </div>
                    <Button variant="link" className="text-white p-0 fs-5" onClick={onClose}>✕</Button>
                </div>
            </div>

            <div className="flex-grow-1 p-3 overflow-auto">
                <div className="mb-3">
                    <small className="text-muted text-uppercase fw-semibold">Role</small>
                    <div className="mt-1">
                        <Badge bg={r.color} className="px-3 py-2">{r.label}</Badge>
                    </div>
                </div>
                <div className="mb-3">
                    <small className="text-muted text-uppercase fw-semibold">Email</small>
                    <div className="mt-1 fw-semibold small">{admin.email}</div>
                </div>
                <div className="mb-3">
                    <small className="text-muted text-uppercase fw-semibold">Account Status</small>
                    <div className="mt-1">
                        <Badge bg={admin.is_active ? 'success' : 'secondary'}>
                            {admin.is_active ? '● Active' : '○ Disabled'}
                        </Badge>
                    </div>
                </div>
                <div className="mb-3">
                    <small className="text-muted text-uppercase fw-semibold">Created</small>
                    <div className="mt-1 small">{new Date(admin.created_at).toLocaleString()}</div>
                </div>
                <hr />
                <div className="mb-2">
                    <small className="text-muted text-uppercase fw-semibold">Role Description</small>
                    <p className="small mt-1 text-muted">{r.description || 'Custom administrative role.'}</p>
                </div>
            </div>

            <div className="p-3 border-top d-flex gap-2">
                <Button variant="primary" size="sm" className="flex-grow-1" onClick={() => { onEdit(admin); onClose(); }}>
                    <Edit2 size={13} className="me-1" /> Edit Account
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => { onDelete(admin.id); onClose(); }}>
                    <Trash2 size={13} />
                </Button>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const SuperAdminPage = () => {
    const [roles, setRoles]                 = useState([]);
    const [admins, setAdmins]               = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [success, setSuccess]             = useState(null);
    const [showModal, setShowModal]         = useState(false);
    const EMPTY_FORM = { id: null, name: '', username: '', email: '', password: '', role: 'admin', is_active: 1 };
    const [form, setForm]                   = useState(EMPTY_FORM);

    const [showPass, setShowPass]           = useState(false);
    const [saving, setSaving]               = useState(false);
    const [processingRow, setProcessingRow] = useState(null); // id of admin being updated
    const [selectedIds, setSelectedIds]     = useState([]);
    const [detailAdmin, setDetailAdmin]     = useState(null);
    const [search, setSearch]               = useState('');
    const [activeTab, setActiveTab]         = useState('all');
    const [bulkRole, setBulkRole]           = useState('');
    const [showBulkModal, setShowBulkModal] = useState(false);

    // ── fetch ──────────────────────────────────────────────────────────────
    const fetchEverything = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Simultaneous wait with individual catches to pinpoint service failure
            const [roleRes, adminRes] = await Promise.all([
                fetchApi('/admin/roles').catch(e => ({ success: false, error: e.message || 'Roles pull failed' })),
                fetchApi('/admin/list').catch(e => ({ success: false, error: e.message || 'Admins pull failed' }))
            ]);
            
            if (roleRes?.success) {
                setRoles(roleRes.data || []);
            } else {
                console.warn('Roles fetch partial failure:', roleRes.error);
                // Fallback roles if fetch fails entirely so UI doesn't break
                if (roles.length === 0) {
                    setRoles([
                        { id: 101, name: 'superadmin', label: 'Super Admin', color: 'danger',  description: 'Full system access (Fallback)' },
                        { id: 102, name: 'admin',      label: 'Admin',       color: 'primary', description: 'CMS management (Fallback)' },
                        { id: 103, name: 'demo',       label: 'Demo Mode',   color: 'warning', description: 'View-only access (Fallback)' }
                    ]);
                }
            }
            
            if (adminRes?.success) {
                setAdmins(adminRes.data || []);
            } else {
                setError(adminRes.error || 'Access Denied or System Offline: Could not load some management data.');
            }
        } catch (err) {
            console.error('Fetch everything CRITICAL error:', err);
            setError(`Critical Load Error: ${err.message || 'Network unreachable'}. Please check your connection or login again.`);
        } finally {
            setLoading(false);
        }
    }, [roles.length]);


    useEffect(() => { 
        fetchEverything(); 
    }, [fetchEverything]);


    // ── derived lists ──────────────────────────────────────────────────────
    const q = search.toLowerCase();
    const getRole = (name) => roles.find(r => r.name === name) || { label: name, color: 'secondary' };

    const filtered = admins.filter(a => {
        const matchSearch = !q || a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
        if (activeTab === 'all')       return matchSearch;
        if (activeTab === 'disabled')  return matchSearch && !a.is_active;
        return matchSearch && a.role === activeTab;
    });

    const counts = {
        all: admins.length,
        disabled: admins.filter(a => !a.is_active).length,
    };
    roles.forEach(r => { counts[r.name] = admins.filter(a => a.role === r.name).length; });


    // ── selection helpers ──────────────────────────────────────────────────
    const toggleSelect = (id) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(a => a.id));
    const clearSelection = () => setSelectedIds([]);

    // ── modal helpers ──────────────────────────────────────────────────────
    const openCreate = () => {
        setForm(EMPTY_FORM);
        setShowPass(false);
        setShowModal(true);
    };
    const openEdit = (admin) => {
        setForm({ ...admin, password: '' });
        setShowPass(false);
        setShowModal(true);
    };

    // ── CRUD ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (form.id) {
                await fetchApi(`/admin/update/${form.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ name: form.name, role: form.role, is_active: form.is_active })
                });
                setSuccess(`"${form.name}" updated successfully.`);
            } else {
                await fetchApi('/admin/create', {
                    method: 'POST',
                    body: JSON.stringify(form)
                });
                setSuccess(`Account for "${form.name}" created.`);
            }
            setShowModal(false);
            fetchEverything();
        } catch (err) {
            setError(`Failed to save. ${err.message || ''}`);
        } finally {
            setSaving(false);
            setTimeout(() => setSuccess(null), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently delete this admin account?')) return;
        try {
            await fetchApi(`/admin/delete/${id}`, { method: 'DELETE' });
            setSuccess('Account removed.');
            setSelectedIds(prev => prev.filter(x => x !== id));
            fetchEverything();
        } catch (err) {
            setError(`Delete failed. ${err.message || ''}`);
        } finally {
            setTimeout(() => setSuccess(null), 4000);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} selected account(s)?`)) return;
        for (const id of selectedIds) {
            try { await fetchApi(`/admin/delete/${id}`, { method: 'DELETE' }); } catch {}
        }
        setSuccess(`${selectedIds.length} account(s) removed.`);
        clearSelection();
        fetchEverything();
        setTimeout(() => setSuccess(null), 4000);
    };

    const handleBulkRoleChange = async () => {
        if (!bulkRole) return;
        setSaving(true);
        for (const id of selectedIds) {
            try {
                const a = admins.find(x => x.id === id);
                await fetchApi(`/admin/update/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ name: a?.name, role: bulkRole, is_active: a?.is_active })
                });
            } catch {}
        }
        setSuccess(`Role changed to "${getRole(bulkRole).label}" for ${selectedIds.length} account(s).`);

        clearSelection();
        setBulkRole('');
        setShowBulkModal(false);
        fetchEverything();
        setSaving(false);
        setTimeout(() => setSuccess(null), 4000);
    };

    const handleToggleStatus = async (admin) => {
        const newStatus = admin.is_active ? 0 : 1;
        setProcessingRow(admin.id);

        // Optimistic update
        const originalStatus = admin.is_active;
        setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, is_active: newStatus } : a));

        try {
            await fetchApi(`/admin/update/${admin.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: admin.name, role: admin.role, is_active: newStatus })
            });
            setSuccess(`"${admin.name}" ${newStatus ? 'activated' : 'disabled'}.`);
        } catch (err) {
            setError(`Failed to update status. ${err.message || ''}`);
            // Rollback
            setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, is_active: originalStatus } : a));
        } finally {
            setProcessingRow(null);
            setTimeout(() => setSuccess(null), 4000);
        }
    };

    const handleRoleChange = async (admin, newRole) => {
        if (admin.role === newRole) return;
        if (!confirm(`Are you sure you want to change "${admin.name}" to ${getRole(newRole).label}?`)) return;


        setProcessingRow(admin.id);
        const oldRole = admin.role;

        // Optimistic update
        setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, role: newRole } : a));

        try {
            const res = await fetchApi(`/admin/update/${admin.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: admin.name, role: newRole, is_active: admin.is_active })
            });
            if (res.success) {
                setSuccess(`Role updated for ${admin.name}.`);
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            setError(err.message || 'Role update failed.');
            // Rollback
            setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, role: oldRole } : a));
        } finally {
            setProcessingRow(null);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    // ── render ─────────────────────────────────────────────────────────────
    return (
        <Container fluid className="px-4 py-4" style={{ maxWidth: 1400 }}>

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Shield size={22} className="text-danger" />
                        <h2 className="mb-0 fw-bold">Super Admin Controller</h2>
                    </div>
                    <p className="text-muted mb-0 small">
                        Manage all backend admin accounts — create, edit, change roles, and control access.
                        <span className="ms-2 text-danger fw-semibold">⚠ Super Admin Only</span>
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={fetchEverything} className="d-flex align-items-center gap-1">

                        <RefreshCw size={13} /> Refresh
                    </Button>
                    <Button variant="primary" size="sm" onClick={openCreate} className="d-flex align-items-center gap-1">
                        <UserPlus size={14} /> New Account
                    </Button>
                </div>
            </div>

            {/* Alerts */}
            {error   && <Alert variant="danger"  dismissible onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

            {/* Summary Cards */}
            <Row className="mb-4 g-3">
                {[
                        { icon: <Shield size={18}/>, label: 'Total Admins', count: counts.all, color: '#6366f1' },
                        ...roles.map(r => ({ icon: <Shield size={18}/>, label: r.label, count: counts[r.name] || 0, color: `var(--bs-${r.color})` })),
                        { icon: <XCircle size={18}/>, label: 'Disabled', count: counts.disabled, color: '#6c757d' },
                    ].map((s, i) => (

                    <Col key={i} xl={true} md={4} sm={6}>
                        <Card className="border-0 shadow-sm h-100" style={{ borderLeft: `4px solid ${s.color}`, borderRadius: 12 }}>
                            <Card.Body className="d-flex align-items-center gap-3 py-3">
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: s.color + '18',
                                    color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>{s.icon}</div>
                                <div>
                                    <h5 className="mb-0 fw-bold">{s.count}</h5>
                                    <small className="text-muted">{s.label}</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Quick Management Section */}
            <Row className="mb-4">
                <Col lg={12}>
                    <RoleManager roles={roles} onUpdate={() => { fetchEverything(); }} />

                </Col>
            </Row>


            <div className="mb-4">
                <PermissionsPanel roles={roles} setRoles={setRoles} />
            </div>

            {/* Main Table Card */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: 14 }}>
                <Card.Header className="bg-white border-bottom py-3">
                    <Row className="align-items-center g-2">
                        <Col md={5}>
                            <InputGroup size="sm">
                                <InputGroup.Text className="bg-light border-end-0">
                                    <Search size={13} className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    className="border-start-0 bg-light"
                                    placeholder="Search name, username or email..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={7} className="d-flex justify-content-end gap-2 flex-wrap">
                            {selectedIds.length > 0 && (
                                <>
                                    <Badge bg="primary" className="d-flex align-items-center px-3">
                                        {selectedIds.length} selected
                                    </Badge>
                                    <Button variant="outline-primary" size="sm" onClick={() => setShowBulkModal(true)}>
                                        Change Role
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={handleBulkDelete}>
                                        Delete Selected
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" onClick={clearSelection}>
                                        Clear
                                    </Button>
                                </>
                            )}
                        </Col>
                    </Row>
                </Card.Header>

                {/* Tabs */}
                <Tabs activeKey={activeTab} onSelect={k => { setActiveTab(k); clearSelection(); }} className="px-3 pt-2 border-0" style={{ borderBottom: '1px solid #dee2e6' }}>
                    {[
                        { k: 'all',        label: 'All' },
                        ...roles.map(r => ({ k: r.name, label: r.label })),
                        { k: 'disabled',   label: 'Disabled' },
                    ].map(t => (
                        <Tab key={t.k} eventKey={t.k} title={
                            <span>{t.label} <Badge bg="secondary" className="ms-1 small">{counts[t.k] || 0}</Badge></span>
                        } />
                    ))}
                </Tabs>


                <Card.Body className="p-0">
                    {loading ? (
                        <div className="py-5">
                            <LoadingSpinner text="Synchronizing administrative directory..." />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <User size={40} strokeWidth={1} className="mb-2" />
                            <p className="mb-0">No accounts found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="mb-0" style={{ tableLayout: 'auto' }}>
                                <thead style={{ background: '#f8f9fa' }}>
                                    <tr>
                                        <th style={{ width: 44 }} className="ps-3">
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedIds.length === filtered.length && filtered.length > 0}
                                                onChange={toggleAll}
                                                title="Select All"
                                            />
                                        </th>
                                        <th className="ps-2">Name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>
                                            Role
                                            <span className="ms-1 text-muted" style={{ fontSize: '0.7rem' }}>(radio to change)</span>
                                        </th>
                                        <th>Status</th>
                                        <th className="text-end pe-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(admin => (
                                        <tr
                                            key={admin.id}
                                            style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                                            className={selectedIds.includes(admin.id) ? 'table-primary' : ''}
                                        >
                                            {/* Checkbox */}
                                            <td className="ps-3" onClick={e => e.stopPropagation()}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedIds.includes(admin.id)}
                                                    onChange={() => toggleSelect(admin.id)}
                                                />
                                            </td>

                                            {/* Name (click opens detail panel) */}
                                            <td onClick={() => setDetailAdmin(admin)}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div style={{
                                                        width: 34, height: 34, borderRadius: '50%',
                                                        background: `var(--bs-${getRole(admin.role).color})`,

                                                        color: '#fff', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', fontSize: 13, fontWeight: 700,
                                                        flexShrink: 0
                                                    }}>
                                                        {admin.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold small">{admin.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                            ID #{admin.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="small"><code>@{admin.username}</code></td>
                                            <td className="small text-muted">{admin.email}</td>

                                            <td onClick={e => e.stopPropagation()}>
                                                <div className="d-flex flex-column gap-1 position-relative">
                                                    {processingRow === admin.id && (
                                                        <div className="position-absolute start-0 top-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center" style={{ zIndex: 5, borderRadius: 4 }}>
                                                            <Spinner animation="border" size="sm" variant="primary" style={{ borderSize: '1px' }} />
                                                        </div>
                                                    )}
                                                    {roles.map(r => (
                                                        <Form.Check
                                                            key={r.name}
                                                            type="radio"
                                                            id={`role-${admin.id}-${r.name}`}
                                                            name={`role-${admin.id}`}
                                                            disabled={processingRow === admin.id}
                                                            label={
                                                                <span style={{ fontSize: '0.75rem', cursor: processingRow === admin.id ? 'default' : 'pointer' }}>
                                                                    <Badge bg={r.color} style={{ fontSize: '0.65rem' }}>{r.label}</Badge>
                                                                </span>
                                                            }
                                                            checked={admin.role === r.name}
                                                            onChange={() => handleRoleChange(admin, r.name)}
                                                        />
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Status toggle */}
                                            <td onClick={e => e.stopPropagation()}>
                                                <Form.Check
                                                    type="switch"
                                                    id={`status-${admin.id}`}
                                                    disabled={processingRow === admin.id}
                                                    label={
                                                        <Badge bg={admin.is_active ? 'success' : 'secondary'} style={{ fontSize: '0.7rem' }}>
                                                            {admin.is_active ? 'Active' : 'Disabled'}
                                                        </Badge>
                                                    }
                                                    checked={!!admin.is_active}
                                                    onChange={() => handleToggleStatus(admin)}
                                                />
                                            </td>

                                            {/* Actions */}
                                            <td className="text-end pe-3" onClick={e => e.stopPropagation()}>
                                                <Button
                                                    size="sm" variant="light" className="border me-1"
                                                    onClick={() => setDetailAdmin(admin)}
                                                    title="View Details"
                                                    style={{ borderRadius: 8 }}
                                                >
                                                    <Eye size={12} />
                                                </Button>
                                                <Button
                                                    size="sm" variant="outline-primary" className="me-1"
                                                    onClick={() => openEdit(admin)}
                                                    style={{ borderRadius: 8 }}
                                                >
                                                    <Edit2 size={12} />
                                                </Button>
                                                <Button
                                                    size="sm" variant="outline-danger"
                                                    onClick={() => handleDelete(admin.id)}
                                                    style={{ borderRadius: 8 }}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>

                <Card.Footer className="bg-white text-muted small py-2 px-3">
                    Showing {filtered.length} of {admins.length} account(s)
                    {selectedIds.length > 0 && ` · ${selectedIds.length} selected`}
                </Card.Footer>
            </Card>

            {/* ── Create / Edit Modal ─────────────────────────────────────── */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="d-flex align-items-center gap-2">
                        {form.id ? <Edit2 size={18} /> : <UserPlus size={18} />}
                        {form.id ? 'Edit Admin Account' : 'Create Admin Account'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="pt-2">
                        {/* Full Name */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-semibold">
                                <User size={13} className="me-1" />Full Name
                            </Form.Label>
                            <Form.Control
                                type="text" placeholder="e.g. John Smith"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        {/* Username & Email (only on create) */}
                        {!form.id && (
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-semibold">
                                            <AtSign size={13} className="me-1" />Username
                                        </Form.Label>
                                        <Form.Control
                                            type="text" placeholder="e.g. j.smith"
                                            value={form.username}
                                            onChange={e => setForm({ ...form, username: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-semibold">
                                            <Mail size={13} className="me-1" />Email
                                        </Form.Label>
                                        <Form.Control
                                            type="email" placeholder="user@example.com"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        {/* Password (only on create) */}
                        {!form.id && (
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">
                                    <Lock size={13} className="me-1" />Password
                                </Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Min 8 characters"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                    <Button variant="outline-secondary" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        )}

                        {/* Role — Radio Buttons */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-semibold mb-2">
                                <Shield size={13} className="me-1" />Access Role
                            </Form.Label>
                            <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded-3 border">
                                {roles.map(r => (
                                    <div key={r.id} className="cursor-pointer" onClick={() => setForm({ ...form, role: r.name })}>
                                        <Form.Check
                                            type="radio"
                                            name="role"
                                            id={`form-role-${r.name}`}
                                            label={
                                                <div className="ms-1">
                                                    <Badge bg={r.color} className="d-block mb-1">{r.label}</Badge>
                                                    <div className="text-muted" style={{ fontSize: '0.65rem', maxWidth: 140 }}>{r.description || 'Custom role.'}</div>
                                                </div>
                                            }
                                            checked={form.role === r.name}
                                            onChange={() => setForm({ ...form, role: r.name })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Form.Group>

                        {/* Active Status — Checkbox */}
                        <Form.Group className="mb-1">
                            <Form.Check
                                type="checkbox"
                                id="modal-is-active"
                                label={
                                    <span className="small fw-semibold">
                                        <CheckCircle size={13} className="me-1 text-success" />
                                        Account Active (can log in)
                                    </span>
                                }
                                checked={form.is_active == 1}
                                onChange={e => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-top pt-3">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? <><Spinner animation="border" size="sm" className="me-1" />Saving...</> : `${form.id ? 'Update' : 'Create'} Account`}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── Bulk Role Change Modal ──────────────────────────────────── */}
            <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)} centered size="sm">
                <Modal.Header closeButton className="border-bottom-0">
                    <Modal.Title className="small fw-bold">Change Role for {selectedIds.length} account(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column gap-2">
                        {roles.map(r => (
                            <Form.Check
                                key={r.name}
                                type="radio"
                                id={`bulk-role-${r.name}`}
                                name="bulk-role"
                                label={<Badge bg={r.color}>{r.label}</Badge>}
                                onChange={() => setBulkRole(r.name)}
                                checked={bulkRole === r.name}
                            />
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="sm" onClick={() => setShowBulkModal(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" disabled={!bulkRole || saving} onClick={handleBulkRoleChange}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Apply'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ── Detail Panel ───────────────────────────────────────────── */}
            {detailAdmin && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1049 }}
                        onClick={() => setDetailAdmin(null)}
                    />
                    <AdminDetailPanel
                        admin={detailAdmin}
                        roles={roles}
                        onClose={() => setDetailAdmin(null)}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </>
            )}


            <style jsx global>{`
                .permission-row:hover { background: #f8f9fa; }
            `}</style>
        </Container>
    );
};

export default SuperAdminPage;
