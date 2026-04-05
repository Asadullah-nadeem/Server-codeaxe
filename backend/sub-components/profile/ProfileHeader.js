import { useState, useEffect } from "react";
import Link from "next/link";
import { Col, Row, Image, Spinner } from "react-bootstrap";
import { fetchApi } from "utils/api";

const ProfileHeader = ({ activeKey, onSelect }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchApi('/admin/profile');
        if (res.success) setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const adminName = profile?.name || 'Admin';
  const adminUsername = profile?.username || 'admin';

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
                  <span className="badge bg-light-primary text-primary px-2 py-1 rounded-pill" style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{profile?.role || 'Admin'}</span>
                  <Link
                    href="#!"
                    data-bs-toggle="tooltip"
                    data-placement="top"
                    title="Verified Account"
                    className="d-flex align-items-center"
                  >
                    <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .glass-header { 
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .premium-shadow {
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1) !important;
        }
      `}</style>
                    <Image
                      src="/images/svg/checked-mark.svg"
                      alt=""
                      height="18"
                      width="18"
                    />
                  </Link>
                </h2>
                <p className="mb-0 d-block text-muted mt-2">@{adminUsername} / {profile?.email}</p>
              </div>
            </div>
            <div>
              <Link
                href="/admin/superadmin"
                className="btn btn-primary d-none d-md-block shadow-sm"
              >
                Account Settings
              </Link>
            </div>
          </div>
          {/* nav */}
          {/* nav */}
          <ul className="nav nav-lt-tab px-4 border-top" id="pills-tab" role="tablist" style={{ borderBottomWidth: 0, backgroundColor: '#fafbfe' }}>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 fw-bold ${activeKey === 'overview' ? 'active text-primary' : 'text-muted'}`} 
                    onClick={() => onSelect('overview')}
                    style={{ borderBottom: activeKey === 'overview' ? '3px solid #624bff' : 'none', transition: 'all 0.2s' }}>
                Overview
              </span>
            </li>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 fw-bold ${activeKey === 'files' ? 'active text-primary' : 'text-muted'}`} 
                    onClick={() => onSelect('files')}
                    style={{ borderBottom: activeKey === 'files' ? '3px solid #624bff' : 'none', transition: 'all 0.2s' }}>
                Files & Media
              </span>
            </li>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 fw-bold ${activeKey === 'teams' ? 'active text-primary' : 'text-muted'}`} 
                    onClick={() => onSelect('teams')}
                    style={{ borderBottom: activeKey === 'teams' ? '3px solid #624bff' : 'none', transition: 'all 0.2s' }}>
                Teams Network
              </span>
            </li>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 fw-bold ${activeKey === 'activity' ? 'active text-primary' : 'text-muted'}`} 
                    onClick={() => onSelect('activity')}
                    style={{ borderBottom: activeKey === 'activity' ? '3px solid #624bff' : 'none', transition: 'all 0.2s' }}>
                Activity Log
              </span>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileHeader;
