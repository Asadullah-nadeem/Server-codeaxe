// import node module libraries
import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown,
    ListGroup,
} from 'react-bootstrap';
import { useRouter } from 'next/router';

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import data files
import NotificationList from 'data/Notification';

// import hooks
import useMounted from 'hooks/useMounted';
import { fetchApi } from 'utils/api';

const QuickMenu = () => {

    const hasMounted = useMounted();
    const router = useRouter();
    const [profile, setProfile] = useState(null);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return;
            const res = await fetchApi('/admin/profile');
            if (res.success) setProfile(res.data);
        } catch (error) {
            console.error("Failed to load profile for menu", error);
        }
    };

    useEffect(() => {
        if (hasMounted) fetchProfile();
    }, [hasMounted]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_role');
            localStorage.removeItem('admin_name');
            localStorage.removeItem('admin_username');
            localStorage.removeItem('admin_login_type');
            localStorage.removeItem('admin_email');
            localStorage.removeItem('admin_permissions');
          router.push('/v1/auth/sign-in');
        }
    };

    const adminName = profile?.name || (hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_name') || 'Admin' : 'Admin');
    const adminRole = profile?.role || (hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_role') || 'Role' : 'Role');
    const adminLoginType = hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_login_type') || 'password' : 'password';

    const getInitials = (name) => {
        const parts = name.split(' ');
        let initials = '';
        if (parts.length > 0 && parts[0]) initials += parts[0][0];
        if (parts.length > 1 && parts[1]) initials += parts[1][0];
        return initials.toUpperCase() || 'A';
    };

    const Notifications = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {NotificationList.map(function (item, index) {
                        return (
                            <ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={index}>
                                <Row>
                                    <Col>
                                        <Link href="#" className="text-muted">
                                            <h5 className=" mb-1">{item.sender}</h5>
                                            <p className="mb-0"> {item.message}</p>
                                        </Link>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </SimpleBar>
        );
    }

    const ProfileMenu = () => (
        <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end shadow border-0 py-3"
            align="end"
            aria-labelledby="dropdownUser"
            style={{ minWidth: '220px' }}
        >
            <Dropdown.Item as="div" className="px-4 pb-2" bsPrefix=' '>
                <div className="lh-1 mb-2">
                    <h5 className="mb-1 fw-bold"> {adminName}</h5>
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small text-uppercase fw-bold ls-1">{adminRole}</span>
                        <span className="badge bg-light-primary text-primary px-2 py-1 x-small text-uppercase">{adminLoginType}</span>
                    </div>
                </div>
            </Dropdown.Item>
            <div className="dropdown-divider my-2"></div>
            <Dropdown.Item onClick={() => router.push('/pages/profile')}>
                <i className="fe fe-user me-2 text-primary"></i> View My Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() => router.push('/admin/superadmin')}>
                <i className="fe fe-settings me-2 text-info"></i> Account Settings
            </Dropdown.Item>
            <div className="dropdown-divider my-2"></div>
            <Dropdown.Item onClick={handleLogout} className="text-danger fw-bold">
                <i className="fe fe-power me-2"></i>Sign Out
            </Dropdown.Item>
        </Dropdown.Menu>
    );

    const [notifications, setNotifications] = useState([]);
    const [loadingNotifs, setLoadingNotifs] = useState(true);

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                if (!localStorage.getItem('admin_token')) return;
                setLoadingNotifs(true);

                const fetchApi = async (url) => {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
                    });
                    if (!res.ok) throw new Error('API Error');
                    return res.json();
                };

                const [usersRes, chatsRes, contactRes] = await Promise.allSettled([
                    fetchApi('/admin/users/registered'),
                    fetchApi('/admin/chat/overview'),
                    fetchApi('/admin/contact/submissions')
                ]);

                let mergedList = [];

                if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
                    usersRes.value.data.forEach(u => {
                        mergedList.push({
                            id: `usr_${u.id}`, type: 'user', title: 'New Registration',
                            message: `${u.first_name || ''} ${u.last_name || ''} joined the platform.`,
                            date: new Date(u.created_at), link: '/cms/users',
                            bg: 'bg-light-primary text-primary', icon: 'fe-user'
                        });
                    });
                }

                if (chatsRes.status === 'fulfilled' && chatsRes.value?.success) {
                    chatsRes.value.data.forEach(c => {
                        mergedList.push({
                            id: `chat_${c.request_id}`, type: 'chat', title: 'New Chat Session',
                            message: c.message ? `"${c.message}"` : 'Client started a live chat.',
                            date: new Date(c.created_at || c.updated_at), link: '/cms/chats',
                            bg: 'bg-light-success text-success', icon: 'fe-message-square'
                        });
                    });
                }

                if (contactRes.status === 'fulfilled' && contactRes.value?.success) {
                    contactRes.value.data.forEach(s => {
                        mergedList.push({
                            id: `sub_${s.id}`, type: 'form', title: 'Contact Submission',
                            message: `${s.name} submitted an inquiry.`,
                            date: new Date(s.submitted_at), link: '/cms/contact',
                            bg: 'bg-light-info text-info', icon: 'fe-mail'
                        });
                    });
                }

                // Filter out notifications older than last cleared time
                const lastCleared = localStorage.getItem('notifications_cleared_at');
                if (lastCleared) {
                    const clearDate = new Date(lastCleared);
                    mergedList = mergedList.filter(n => n.date > clearDate);
                }

                // Sort by descending date and take top 5
                mergedList.sort((a, b) => b.date - a.date);
                setNotifications(mergedList.slice(0, 5));
            } catch (err) {
                console.error("Failed fetching notifications", err);
            } finally {
                setLoadingNotifs(false);
            }
        };

        if (hasMounted && typeof window !== 'undefined') {
            fetchAllNotifications();
        }
    }, [hasMounted]);

    const timeAgo = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'Just now';
        const diff = new Date() - d;
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const clearNotifications = () => {
        localStorage.setItem('notifications_cleared_at', new Date().toISOString());
        setNotifications([]);
    };

    const markAllAsRead = async () => {
        try {
            // For contact submissions, we can actually hit an API
            const contactSubIds = notifications.filter(n => n.type === 'form').map(n => n.id.replace('sub_', ''));
            if (contactSubIds.length > 0) {
                 await Promise.allSettled(contactSubIds.map(id =>
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contact/submissions/${id}/status`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: 'read' })
                    })
                ));
            }
            // Mark last read timestamp
            localStorage.setItem('notifications_read_at', new Date().toISOString());
            setNotifications([]);
            alert('All notifications marked as read.');
        } catch (err) {
            console.error(err);
        }
    };

    const NotificationsMenu = () => (
        <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end shadow"
            align="end"
            aria-labelledby="dropdownNotification"
            style={{ width: '320px', padding: 0 }}
        >
            <div className="px-3 pt-3 pb-2 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Recent Activity</h6>
                <div className="d-flex gap-2">
                    <span style={{cursor: 'pointer'}} onClick={markAllAsRead} title="Mark All Read" className="text-primary small fw-bold">Read</span>
                    <span style={{cursor: 'pointer'}} onClick={clearNotifications} title="Clear All" className="text-danger small fw-bold">Clear</span>
                </div>
            </div>
            <ListGroup variant="flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {loadingNotifs ? (
                    <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></div>
                ) : notifications.length === 0 ? (
                    <div className="text-center text-muted py-4 small">No recent notifications.</div>
                ) : (
                    notifications.map(item => (
                        <ListGroup.Item action key={item.id} onClick={() => router.push(item.link)} className="border-bottom py-3">
                            <div className="d-flex align-items-center">
                                <div className={`${item.bg} rounded-circle p-2 me-3 d-flex align-items-center justify-content-center flex-shrink-0`} style={{width:'40px', height:'40px'}}>
                                    <i className={`fe ${item.icon} fs-5`}></i>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth:'160px'}}>{item.title}</h6>
                                        <small className="text-muted" style={{fontSize: '0.75rem'}}>{timeAgo(item.date)}</small>
                                    </div>
                                    <p className="mb-0 small text-muted text-truncate">{item.message}</p>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))
                )}
            </ListGroup>
            <div className="border-top px-3 py-2 text-center bg-light">
                <small className="fw-bold text-primary" style={{cursor: 'pointer'}} onClick={() => router.push('/cms/activity')}>View All Activity</small>
            </div>
        </Dropdown.Menu>
    );

    const QuickMenuDesktop = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap align-items-center">
            <Dropdown as="li" className="st-dropdown st-dropdown-custom me-2">
                <Dropdown.Toggle as="a" bsPrefix=' ' className="nav-link text-muted position-relative p-2" id="dropdownNotification" style={{ cursor: 'pointer' }}>
                    <div className="bg-light rounded-circle shadow-sm d-flex justify-content-center align-items-center" style={{width:'40px', height:'40px'}}>
                        <i className="fe fe-bell fs-4 text-dark"></i>
                    </div>
                    {notifications.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                            <span className="visually-hidden">New alerts</span>
                        </span>
                    )}
                </Dropdown.Toggle>
                <NotificationsMenu />
            </Dropdown>

            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser" style={{ cursor: 'pointer' }}>
                    <div className="avatar avatar-md avatar-indicators avatar-online rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                         style={{
                             background: profile?.photo ? `url(${profile.photo}) no-repeat center center` : '#624bff',
                             backgroundSize: 'cover',
                             width: '40px',
                             height: '40px'
                         }}>
                        {!profile?.photo && getInitials(adminName)}
                    </div>
                </Dropdown.Toggle>
                <ProfileMenu />
            </Dropdown>
        </ListGroup>
    )}

    const QuickMenuMobile = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap align-items-center">
            <Dropdown as="li" className="st-dropdown st-dropdown-custom me-2">
                <Dropdown.Toggle as="a" bsPrefix=' ' className="nav-link text-muted position-relative p-2" id="dropdownNotificationMobile" style={{ cursor: 'pointer' }}>
                    <div className="bg-light rounded-circle shadow-sm d-flex justify-content-center align-items-center" style={{width:'36px', height:'36px'}}>
                        <i className="fe fe-bell fs-5 text-dark"></i>
                    </div>
                    {notifications.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                            <span className="visually-hidden">New alerts</span>
                        </span>
                    )}
                </Dropdown.Toggle>
                <NotificationsMenu />
            </Dropdown>

            <Dropdown as="li" className="ms-1">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUserMobile" style={{ cursor: 'pointer' }}>
                    <div className="avatar avatar-sm avatar-indicators avatar-online rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                         style={{
                             background: profile?.photo ? `url(${profile.photo}) no-repeat center center` : '#624bff',
                             backgroundSize: 'cover',
                             width:'36px',
                             height:'36px'
                         }}>
                        {!profile?.photo && getInitials(adminName)}
                    </div>
                </Dropdown.Toggle>
                <ProfileMenu />
            </Dropdown>
        </ListGroup>
    )}

    return (
        <Fragment>
            { hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;
