// import node module libraries
import Link from "next/link";
import { Col, Row, Image } from "react-bootstrap";
import useMounted from 'hooks/useMounted';

const ProfileHeader = () => {
  const hasMounted = useMounted();
  const adminName = hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_name') || 'Admin' : 'Admin';
  const adminUsername = hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_username') || 'admin' : 'admin';

  const getInitials = (name) => {
    const parts = name.split(' ');
    let initials = '';
    if (parts.length > 0 && parts[0]) initials += parts[0][0];
    if (parts.length > 1 && parts[1]) initials += parts[1][0];
    return initials.toUpperCase() || 'A';
  };

  return (
    <Row className="align-items-center">
      <Col xl={12} lg={12} md={12} xs={12}>
        {/* Bg */}
        <div
          className="pt-20 rounded-top"
          style={{
            background: "url(/images/background/profile-cover.jpg) no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="bg-white rounded-bottom smooth-shadow-sm ">
          <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
            <div className="d-flex align-items-center">
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-center align-items-center mt-n10 bg-primary rounded-circle border border-4 border-white shadow-sm text-white fw-bold fs-1" style={{ width: '8rem', height: '8rem' }}>
                {getInitials(adminName)}
              </div>
              {/* text */}
              <div className="lh-1 ms-3 mt-3">
                <h2 className="mb-0 d-flex align-items-center gap-2">
                  {adminName}
                  <Link
                    href="#!"
                    data-bs-toggle="tooltip"
                    data-placement="top"
                    title="Verified"
                    className="d-flex align-items-center"
                  >
                    <Image
                      src="/images/svg/checked-mark.svg"
                      alt=""
                      height="24"
                      width="24"
                    />
                  </Link>
                </h2>
                <p className="mb-0 d-block text-muted mt-2">@{adminUsername}</p>
              </div>
            </div>
            <div>
              <Link
                href="/pages/settings"
                className="btn btn-outline-primary d-none d-md-block"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          {/* nav */}
          <ul className="nav nav-lt-tab px-4" id="pills-tab" role="tablist">
            <li className="nav-item">
              <Link className="nav-link active" href="#">
                Overview
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">
                Project
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">
                Files
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">
                Teams
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">
                Followers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">
                Activity
              </Link>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileHeader;
