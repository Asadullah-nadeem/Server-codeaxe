// import node module libraries
import Link from 'next/link';
import { Fragment } from 'react';
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

const QuickMenu = () => {

    const hasMounted = useMounted();
    const router = useRouter();

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/logout`, {
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
          router.push('/v1/auth/sign-in');
        }
    };

    const adminName = typeof window !== 'undefined' ? localStorage.getItem('admin_name') || 'Admin' : 'Admin';
    const adminRole = typeof window !== 'undefined' ? localStorage.getItem('admin_role') || 'Role' : 'Role';
    const adminLoginType = typeof window !== 'undefined' ? localStorage.getItem('admin_login_type') || 'password' : 'password';

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
            className="dropdown-menu dropdown-menu-end"
            align="end"
            aria-labelledby="dropdownUser"
        >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                <div className="lh-1 ">
                    <h5 className="mb-1"> {adminName}</h5>
                    <div className="d-flex align-items-center gap-2">
                        <Link href="/pages/profile" className="text-inherit fs-6 text-uppercase">{adminRole}</Link>
                        <span className="badge bg-light-info text-info border px-2 py-1 x-small text-uppercase">{adminLoginType}</span>
                    </div>
                </div>
                <div className=" dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
                <i className="fe fe-power me-2"></i>Sign Out
            </Dropdown.Item>
        </Dropdown.Menu>
    );

    const QuickMenuDesktop = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                    <div className="avatar avatar-md avatar-indicators avatar-online">
                        <Image alt="avatar" src='/images/avatar/avatar-1.jpg' className="rounded-circle" />
                    </div>
                </Dropdown.Toggle>
                <ProfileMenu />
            </Dropdown>
        </ListGroup>
    )}

    const QuickMenuMobile = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                    <div className="avatar avatar-md avatar-indicators avatar-online">
                        <Image alt="avatar" src='/images/avatar/avatar-1.jpg' className="rounded-circle" />
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
