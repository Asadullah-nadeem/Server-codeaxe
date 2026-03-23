// import node module libraries
import React from "react";
import Link from "next/link";
import { MoreVertical } from "react-feather";
import { Col, Row, Card, Form, Dropdown, Image, Button } from "react-bootstrap";
import useMounted from 'hooks/useMounted';

const RecentFromBlog = () => {
    const hasMounted = useMounted();
  const adminName = hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_name') || 'Admin' : 'Admin';

  const getInitials = (name) => {
    const parts = name.split(' ');
    let initials = '';
    if (parts.length > 0 && parts[0]) initials += parts[0][0];
    if (parts.length > 1 && parts[1]) initials += parts[1][0];
    return initials.toUpperCase() || 'A';
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="text-muted text-primary-hover"
    >
      {children}
    </Link>
  ));

  CustomToggle.displayName = "CustomToggle";

  const ActionMenu = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
          <MoreVertical size="15px" className="text-muted" />
        </Dropdown.Toggle>
        <Dropdown.Menu align={"end"}>
          <Dropdown.Item eventKey="1">View detail</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <Col xl={6} md={12} xs={12} className="mb-6">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-5 align-items-center">
            <div className="d-flex align-items-center">
              <div>
                <div className="avatar avatar-md bg-primary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold">
                  {getInitials(adminName)}
                </div>
              </div>
              <div className="ms-3">
                <h5 className="mb-0 fw-bold">{adminName}</h5>
                <p className="mb-0 small text-muted">Posted just now</p>
              </div>
            </div>
            <div>
              <ActionMenu />
            </div>
          </div>
          <div className="mb-4">
            <h4 className="mb-2">Admin Dashboard Guide</h4>
            <p className="mb-4 small text-muted">
              Welcome to the management portal. From here you can manage all aspects of the Code Axe website, including services, portfolio items, and user messages.
            </p>
            <Image
              src="/images/blog/blog-img-1.jpg"
              className="rounded-3 w-100"
              alt=""
            />
          </div>
          <div className="mb-4">
            <span className="me-1 me-md-4">
              <i className="fe fe-heart"></i> <span className="small">24 Like</span>
            </span>
            <span className="me-1 me-md-4">
              <i className="fe fe-message-square"></i> <span className="small">8 Comment</span>
            </span>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RecentFromBlog;
