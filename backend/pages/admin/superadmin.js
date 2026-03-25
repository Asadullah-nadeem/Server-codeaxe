import React, { useState, useEffect, useCallback } from 'react';
import {
    Row, Col, Card, Table, Button, Form, Modal, Container,
    Badge, Spinner, Alert, Tabs, Tab, InputGroup
} from 'react-bootstrap';
import {
    Shield, UserPlus, Edit2, Trash2, RefreshCw, CheckCircle,
    XCircle, Eye, EyeOff, Search, User, Lock, Mail, AtSign
} from 'react-feather';
import { fetchApi } from '../../utils/api';

// ─── Role config ─────────────────────────────────────────────────────────────
const ROLES = [
    { value: 'superadmin', label: 'Super Admin',  color: 'danger',  desc: 'Full system access including user management' },
    { value: 'admin',      label: 'Admin',         color: 'primary', desc: 'Full CMS access, cannot manage admin accounts' },
    { value: 'demo',       label: 'Demo Mode',     color: 'warning', desc: 'Read-only access — cannot make changes' },
];

const roleColor = (role) => ROLES.find(r => r.value === role)?.color || 'secondary';
const roleLabel = (role) => ROLES.find(r => r.value === role)?.label || role;

const EMPTY_FORM = { id: null, name: '', username: '', email: '', password: '', role: 'admin', is_active: 1 };

// ─── Permission Matrix Section Definitions ─────────────────────────────────────────
// Purely UI structure. Actual values come from the API.
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

// Build default permission map (used as fallback before API loads)
const buildDefaultPerms = () => {
    const out = { admin: {}, demo: {} };
    for (const g of PERM_GROUPS) {
        for (const item of g.items) {
            const isLocked = !!g.locked;
            out.admin[item.key] = { view: !isLocked, create: !isLocked, edit: !isLocked, delete: !isLocked };
            out.demo[item.key]  = { view: !isLocked, create: false,      edit: false,      delete: false };
        }
    }
    return out;
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
const PermissionsPanel = () => {
    const [open, setOpen]       = React.useState(true);
    const [perms, setPerms]     = React.useState(buildDefaultPerms());
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving]   = React.useState(null); // 'admin' | 'demo' | null
    const [success, setSuccess] = React.useState(null);
    const [error, setError]     = React.useState(null);
    const [dirty, setDirty]     = React.useState({ admin: false, demo: false });
    const [activeRole, setActiveRole] = React.useState('admin');

    // Load permissions from API on mount
    React.useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchApi('/admin/permissions');
                if (res?.success && res.data) {
                    setPerms(prev => ({
                        admin: { ...prev.admin, ...res.data.admin },
                        demo:  { ...prev.demo,  ...res.data.demo  },
                    }));
                }
            } catch (e) {
                setError('Could not load permissions. Showing defaults.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Toggle a single cell
    const togglePerm = (role, sectionKey, op, value) => {
        setPerms(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [sectionKey]: {
                    ...prev[role][sectionKey],
                    [op]: value,
                }
            }
        }));
        setDirty(prev => ({ ...prev, [role]: true }));
    };

    // Toggle entire row ON/OFF
    const toggleRow = (role, sectionKey, allOn) => {
        const newVal = { view: allOn, create: allOn, edit: allOn, delete: allOn };
        setPerms(prev => ({
            ...prev,
            [role]: { ...prev[role], [sectionKey]: newVal }
        }));
        setDirty(prev => ({ ...prev, [role]: true }));
    };

    // Save role's full permissions
    const saveRole = async (role) => {
        setSaving(role);
        setError(null);
        try {
            await fetchApi('/admin/permissions/bulk', {
                method: 'POST',
                body: JSON.stringify({ role, permissions: perms[role] })
            });
            setSuccess(`${role === 'admin' ? 'Admin' : 'Demo'} permissions saved successfully.`);
            setDirty(prev => ({ ...prev, [role]: false }));
        } catch (e) {
            setError(`Failed to save ${role} permissions.`);
        } finally {
            setSaving(null);
            setTimeout(() => setSuccess(null), 4000);
        }
    };

    // Reset role to defaults
    const resetRole = async (role) => {
        if (!confirm(`Reset all ${role} permissions to system defaults?`)) return;
        setSaving(role);
        try {
            await fetchApi('/admin/permissions/reset', {
                method: 'POST',
                body: JSON.stringify({ role })
            });
            // Reload from API
            const res = await fetchApi('/admin/permissions');
            if (res?.success && res.data) {
                setPerms(prev => ({
                    ...prev,
                    [role]: res.data[role] || prev[role]
                }));
            }
            setSuccess(`${role} permissions reset to defaults.`);
            setDirty(prev => ({ ...prev, [role]: false }));
        } catch (e) {
            setError(`Failed to reset ${role} permissions.`);
        } finally {
            setSaving(null);
            setTimeout(() => setSuccess(null), 4000);
        }
    };

    const roleMeta = {
        admin: { label: 'Admin', color: 'primary', bg: '#0d6efd' },
        demo:  { label: 'Demo',  color: 'warning', bg: '#f59e0b' },
    };

    return (
        <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: 14 }}>
            {/* Panel Header */}
            <Card.Header
                className="bg-white d-flex justify-content-between align-items-center py-3"
                style={{ cursor: 'pointer', borderRadius: open ? '14px 14px 0 0' : 14 }}
                onClick={() => setOpen(o => !o)}
            >
                <div className="d-flex align-items-center gap-2">
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: '#6f42c115', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Lock size={16} style={{ color: '#6f42c1' }} />
                    </div>
                    <div>
                        <div className="fw-bold small mb-0">Section Access Control
                            {(dirty.admin || dirty.demo) && (
                                <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '0.6rem' }}>Unsaved changes</Badge>
                            )}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                            Edit exactly what Admin &amp; Demo accounts can do — per section, per operation
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2" onClick={e => e.stopPropagation()}>
                    {/* Role tabs */}
                    {['admin', 'demo'].map(r => (
                        <Button
                            key={r}
                            size="sm"
                            variant={activeRole === r ? roleMeta[r].color : 'outline-secondary'}
                            onClick={() => setActiveRole(r)}
                            style={{ borderRadius: 20, fontSize: '0.7rem', position: 'relative' }}
                        >
                            {roleMeta[r].label}
                            {dirty[r] && <span style={{
                                position: 'absolute', top: -4, right: -4,
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#f59e0b', border: '1.5px solid #fff'
                            }} />}
                        </Button>
                    ))}
                    <span className="text-muted ms-1" style={{ fontSize: 16 }}>{open ? '▲' : '▼'}</span>
                </div>
            </Card.Header>

            {open && (
                <Card.Body className="p-0">
                    {/* Role selector + action bar */}
                    <div className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom" style={{ background: '#f8f9fa' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-1">
                                {['admin', 'demo'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setActiveRole(r)}
                                        style={{
                                            padding: '4px 14px', borderRadius: 20,
                                            border: `2px solid ${activeRole === r ? roleMeta[r].bg : '#dee2e6'}`,
                                            background: activeRole === r ? roleMeta[r].bg + '18' : 'transparent',
                                            color: activeRole === r ? roleMeta[r].bg : '#6c757d',
                                            fontWeight: activeRole === r ? 700 : 400,
                                            fontSize: '0.78rem', cursor: 'pointer'
                                        }}
                                    >
                                        {roleMeta[r].label} permissions
                                        {dirty[r] && ' ●'}
                                    </button>
                                ))}
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                ☑ Click checkboxes to grant/deny specific operations. Super Admin always has full access.
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                size="sm" variant="outline-secondary"
                                onClick={() => resetRole(activeRole)}
                                disabled={saving === activeRole}
                                style={{ fontSize: '0.72rem', borderRadius: 8 }}
                            >
                                Reset to defaults
                            </Button>
                            <Button
                                size="sm"
                                variant={dirty[activeRole] ? roleMeta[activeRole].color : 'outline-secondary'}
                                onClick={() => saveRole(activeRole)}
                                disabled={saving === activeRole || !dirty[activeRole]}
                                style={{ fontSize: '0.72rem', borderRadius: 8, minWidth: 80 }}
                            >
                                {saving === activeRole
                                    ? <><Spinner animation="border" size="sm" className="me-1" />Saving...</>
                                    : <><CheckCircle size={12} className="me-1" />Save {roleMeta[activeRole].label}</>}
                            </Button>
                        </div>
                    </div>

                    {/* Alerts */}
                    {error   && <Alert variant="danger"  dismissible className="m-3 mb-0 py-2" onClose={() => setError(null)}>{error}</Alert>}
                    {success && <Alert variant="success" dismissible className="m-3 mb-0 py-2" onClose={() => setSuccess(null)}>{success}</Alert>}

                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" size="sm" /> <span className="text-muted ms-2 small">Loading permissions...</span>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-sm mb-0" style={{ minWidth: 560 }}>
                                <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th className="ps-4" style={{ width: '36%', fontSize: '0.72rem', color: '#888', fontWeight: 600 }}>Section / Feature</th>
                                        {OPS.map(op => (
                                            <th key={op} className="text-center" style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, textTransform: 'capitalize', width: '10%' }}>
                                                {op}
                                            </th>
                                        ))}
                                        <th className="text-center" style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, width: '14%' }}>All On/Off</th>
                                        <th className="text-center" style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, width: '16%' }}>Super Admin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PERM_GROUPS.map((group, gi) => (
                                        <React.Fragment key={gi}>
                                            {/* Group row */}
                                            <tr style={{ background: group.color + '0c' }}>
                                                <td colSpan={7} className="ps-4 py-1" style={{ fontSize: '0.68rem', color: group.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: group.color, marginRight: 6, verticalAlign: 'middle' }} />
                                                    {group.group}
                                                    {group.locked && <Badge bg="light" text="dark" className="ms-2 border" style={{ fontSize: '0.6rem' }}>Super Admin only</Badge>}
                                                </td>
                                            </tr>
                                            {/* Section rows */}
                                            {group.items.map((item, ii) => {
                                                const sec = perms[activeRole]?.[item.key] || {};
                                                const allOn = OPS.every(op => sec[op]);
                                                const isLocked = !!group.locked;
                                                return (
                                                    <tr
                                                        key={ii}
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            borderBottom: '1px solid #f1f3f5',
                                                            opacity: isLocked ? 0.55 : 1,
                                                            background: isLocked ? '#f8f9fa' : 'white',
                                                        }}
                                                    >
                                                        {/* Section label */}
                                                        <td className="ps-4 py-2" style={{ verticalAlign: 'middle' }}>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <i className={`fe fe-${item.icon}`} style={{ color: group.color, fontSize: 13 }} />
                                                                <span className="fw-semibold">{item.label}</span>
                                                                {isLocked && <small className="text-danger" style={{ fontSize: '0.65rem' }}>locked</small>}
                                                            </div>
                                                        </td>
                                                        {/* Editable op cells */}
                                                        {OPS.map(op => (
                                                            <EditPermCell
                                                                key={op}
                                                                checked={sec[op]}
                                                                locked={isLocked}
                                                                onChange={val => togglePerm(activeRole, item.key, op, val)}
                                                            />
                                                        ))}
                                                        {/* All On/Off toggle */}
                                                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                            {isLocked ? (
                                                                <span style={{ color: '#dc3545', fontSize: 12, opacity: 0.5 }}>✗ all</span>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant={allOn ? 'outline-danger' : 'outline-success'}
                                                                    onClick={() => toggleRow(activeRole, item.key, !allOn)}
                                                                    style={{ fontSize: '0.65rem', padding: '1px 8px', borderRadius: 20 }}
                                                                >
                                                                    {allOn ? 'Deny All' : 'Allow All'}
                                                                </Button>
                                                            )}
                                                        </td>
                                                        {/* Super Admin always full */}
                                                        <td className="text-center" style={{ verticalAlign: 'middle', background: '#19875408' }}>
                                                            <span style={{ color: '#198754', fontSize: 12 }}>✓ Always full</span>
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

                    {/* Footer */}
                    <div className="px-4 py-3 border-top d-flex align-items-center gap-4 flex-wrap" style={{ background: '#fafafa', borderRadius: '0 0 14px 14px' }}>
                        <span className="d-flex align-items-center gap-1 small">
                            <Form.Check type="checkbox" checked readOnly style={{ margin: 0, pointerEvents: 'none' }} />
                            <span className="text-muted">= Allowed</span>
                        </span>
                        <span className="d-flex align-items-center gap-1 small">
                            <Form.Check type="checkbox" checked={false} readOnly style={{ margin: 0, pointerEvents: 'none' }} />
                            <span className="text-muted">= Denied</span>
                        </span>
                        <Badge bg="danger" className="px-2" style={{ fontSize: '0.65rem' }}>Locked</Badge>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>= Super Admin only, cannot be granted</span>
                        <span className="text-muted small ms-auto">
                            <i className="fe fe-info me-1" />
                            Demo write-block is also enforced server-side (DemoModeMiddleware).
                            These settings control UI visibility &amp; additional reference.
                        </span>
                    </div>
                </Card.Body>
            )}
        </Card>
    );
};

// ─── Detail Slide-over Panel ─────────────────────────────────────────────────
const AdminDetailPanel = ({ admin, onClose, onEdit, onDelete }) => {
    if (!admin) return null;
    return (
        <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: 360,
            background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
            zIndex: 1050, display: 'flex', flexDirection: 'column',
            animation: 'slideInRight 0.25s ease'
        }}>
            <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
            {/* Header */}
            <div style={{ background: `var(--bs-${roleColor(admin.role)})`, padding: '24px 20px 20px' }}>
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

            {/* Body */}
            <div className="flex-grow-1 p-3 overflow-auto">
                <div className="mb-3">
                    <small className="text-muted text-uppercase fw-semibold">Role</small>
                    <div className="mt-1">
                        <Badge bg={roleColor(admin.role)} className="px-3 py-2">{roleLabel(admin.role)}</Badge>
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
                    <p className="small mt-1 text-muted">
                        {ROLES.find(r => r.value === admin.role)?.desc}
                    </p>
                </div>
            </div>

            {/* Footer */}
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
    const [admins, setAdmins]               = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [success, setSuccess]             = useState(null);
    const [showModal, setShowModal]         = useState(false);
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
    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchApi('/admin/list');
            if (res?.success) setAdmins(res.data);
            else setError('Failed to load admin accounts.');
        } catch {
            setError('Access Denied: Only Super Admins can manage accounts.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

    // ── derived lists ──────────────────────────────────────────────────────
    const q = search.toLowerCase();
    const filtered = admins.filter(a => {
        const matchSearch = !q || a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
        if (activeTab === 'all')       return matchSearch;
        if (activeTab === 'superadmin') return matchSearch && a.role === 'superadmin';
        if (activeTab === 'admin')     return matchSearch && a.role === 'admin';
        if (activeTab === 'demo')      return matchSearch && a.role === 'demo';
        if (activeTab === 'disabled')  return matchSearch && !a.is_active;
        return matchSearch;
    });

    const counts = {
        all:       admins.length,
        superadmin: admins.filter(a => a.role === 'superadmin').length,
        admin:     admins.filter(a => a.role === 'admin').length,
        demo:      admins.filter(a => a.role === 'demo').length,
        disabled:  admins.filter(a => !a.is_active).length,
    };

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
            fetchAdmins();
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
            fetchAdmins();
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
        fetchAdmins();
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
        setSuccess(`Role changed to "${roleLabel(bulkRole)}" for ${selectedIds.length} account(s).`);
        clearSelection();
        setBulkRole('');
        setShowBulkModal(false);
        fetchAdmins();
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
        if (!confirm(`Are you sure you want to change "${admin.name}" to ${roleLabel(newRole)}?`)) return;

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
                    <Button variant="outline-secondary" size="sm" onClick={fetchAdmins} className="d-flex align-items-center gap-1">
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
                    { label: 'Total Admins',   count: counts.all,        color: '#6366f1', icon: <Shield size={18}/> },
                    { label: 'Super Admins',   count: counts.superadmin, color: '#dc3545', icon: <Shield size={18}/> },
                    { label: 'Admins',         count: counts.admin,      color: '#0d6efd', icon: <User size={18}/> },
                    { label: 'Demo Accounts',  count: counts.demo,       color: '#f59e0b', icon: <EyeOff size={18}/> },
                    { label: 'Disabled',       count: counts.disabled,   color: '#6c757d', icon: <XCircle size={18}/> },
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
                        { k: 'superadmin', label: 'Super Admin' },
                        { k: 'admin',      label: 'Admin' },
                        { k: 'demo',       label: 'Demo' },
                        { k: 'disabled',   label: 'Disabled' },
                    ].map(t => (
                        <Tab key={t.k} eventKey={t.k} title={
                            <span>{t.label} <Badge bg="secondary" className="ms-1 small">{counts[t.k]}</Badge></span>
                        } />
                    ))}
                </Tabs>

                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted small">Loading accounts...</p>
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
                                                        background: `var(--bs-${roleColor(admin.role)})`,
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
                                                    {ROLES.map(r => (
                                                        <Form.Check
                                                            key={r.value}
                                                            type="radio"
                                                            id={`role-${admin.id}-${r.value}`}
                                                            name={`role-${admin.id}`}
                                                            disabled={processingRow === admin.id}
                                                            label={
                                                                <span style={{ fontSize: '0.75rem', cursor: processingRow === admin.id ? 'default' : 'pointer' }}>
                                                                    <Badge bg={r.color} style={{ fontSize: '0.65rem' }}>{r.label}</Badge>
                                                                </span>
                                                            }
                                                            checked={admin.role === r.value}
                                                            onChange={() => handleRoleChange(admin, r.value)}
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
                                <Shield size={13} className="me-1" />Role
                            </Form.Label>
                            <div className="d-flex flex-column gap-2">
                                {ROLES.map(r => (
                                    <label
                                        key={r.value}
                                        htmlFor={`modal-role-${r.value}`}
                                        style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 10,
                                            padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                                            border: `2px solid ${form.role === r.value ? `var(--bs-${r.color})` : '#dee2e6'}`,
                                            background: form.role === r.value ? `var(--bs-${r.color})15` : '#fff',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <Form.Check
                                            type="radio"
                                            id={`modal-role-${r.value}`}
                                            name="modal-role"
                                            value={r.value}
                                            checked={form.role === r.value}
                                            onChange={() => setForm({ ...form, role: r.value })}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div>
                                                <Badge bg={r.color} className="me-1">{r.label}</Badge>
                                            </div>
                                            <small className="text-muted">{r.desc}</small>
                                        </div>
                                    </label>
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
                        {ROLES.map(r => (
                            <Form.Check
                                key={r.value}
                                type="radio"
                                id={`bulk-role-${r.value}`}
                                name="bulk-role"
                                label={<Badge bg={r.color}>{r.label}</Badge>}
                                onChange={() => setBulkRole(r.value)}
                                checked={bulkRole === r.value}
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
                        onClose={() => setDetailAdmin(null)}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </>
            )}
            {/* ── Permissions Matrix ─────────────────────────────────────── */}
            <PermissionsPanel />

            <style jsx global>{`
                .permission-row:hover { background: #f8f9fa; }
            `}</style>
        </Container>
    );
};

export default SuperAdminPage;
