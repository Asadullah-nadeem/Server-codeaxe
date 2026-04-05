import { useState, useEffect } from "react";
import Link from "next/link";
import { Col, Row, Image, Spinner, Button } from "react-bootstrap";
import { fetchApi } from "utils/api";
import MediaGallery from "../../components/MediaGallery";
import { Camera, House, Images, People, Activity, ShieldCheck } from "react-bootstrap-icons";

const ProfileHeader = ({ activeKey, onSelect }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

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

  const handleUpdatePhoto = async (photoUrl) => {
    try {
      const res = await fetchApi('/admin/profile/update', {
        method: 'POST',
        body: JSON.stringify({ photo: photoUrl })
      });
      if (res.success) {
        setProfile({ ...profile, photo: photoUrl });
        setShowMedia(false);
      }
    } catch (error) {
      console.error("Failed to update photo", error);
    }
  };

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
            <div className="d-flex align-items-start">
              <div className="position-relative mt-n10 ms-4">
                <div className="rounded-circle border border-4 border-white shadow-lg overflow-hidden d-flex justify-content-center align-items-center"
                     style={{ 
                       width: '9rem', 
                       height: '9rem', 
                       background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                       boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                     }}>
                  {profile?.photo ? (
                    <img 
                      src={profile.photo} 
                      alt={adminName} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} 
                    />
                  ) : (
                    <span className="text-white fw-bold display-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                      {getInitials(adminName)}
                    </span>
                  )}
                </div>
                
                {/* Camera Trigger */}
                <div className="position-absolute bottom-0 end-0 mb-2 me-2" style={{ zIndex: 10 }}>
                   <div 
                    className="p-0 cursor-pointer bg-white text-primary rounded-circle shadow-sm hover-scale transition-all d-flex align-items-center justify-content-center border border-2 border-primary" 
                    onClick={() => setShowMedia(true)}
                    style={{ width: '36px', height: '36px' }}
                    title="Change Avatar"
                   >
                     <Camera size={16} />
                   </div>
                </div>

                {/* Status Indicator */}
                <div className="position-absolute top-0 start-0 mt-3 ms-3">
                   <span className="p-2 bg-success border border-3 border-white rounded-circle d-block shadow-sm" title="Online now"></span>
                </div>
              </div>

              {/* Identity Info */}
              <div className="ms-md-4 mt-3 flex-grow-1">
                <div className="d-md-flex align-items-center mb-1 flex-wrap">
                  <h1 className="mb-0 fw-bold text-dark h2 me-2" style={{ letterSpacing: '-0.5px' }}>{adminName}</h1>
                  <div className="d-flex align-items-center gap-2 mt-1 mt-md-0">
                    <Link href="#!" className="d-flex align-items-center me-1">
                      <Image
                        src="/images/svg/checked-mark.svg"
                        alt="Verified"
                        height="18"
                        width="18"
                      />
                    </Link>
                    <span className="badge bg-primary px-3 py-1 rounded-pill fw-bold text-white shadow-sm" style={{fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase', border: '2px solid rgba(255,255,255,0.2)'}}>
                      {profile?.role || 'Administrator'}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 mt-3 information-row">
                  <p className="mb-0 text-muted small fw-bold d-flex align-items-center px-3 py-1 bg-light rounded-pill border">
                    <i className="fe fe-user me-2 text-primary"></i>@{adminUsername}
                  </p>
                  <p className="mb-0 text-muted small fw-bold d-flex align-items-center px-3 py-1 bg-light rounded-pill border ms-md-2">
                    <i className="fe fe-mail me-2 text-primary"></i>{profile?.email}
                  </p>
                  <p className="mb-0 text-muted small fw-bold d-flex align-items-center px-3 py-1 bg-light rounded-pill border border-success border-opacity-25 ms-md-2" style={{ color: '#0d9488' }}>
                    <i className="fe fe-shield me-2" style={{ color: '#0d9488' }}></i>Full Control Node
                  </p>
                </div>
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
          {/* Dynamic Navigation Tabs */}
          <ul className="nav nav-lt-tab px-4 border-top" id="pills-tab" role="tablist" style={{ borderBottomWidth: 0, backgroundColor: '#fffffe' }}>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 d-flex align-items-center gap-2 fw-bold transition-all ${activeKey === 'overview' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`} 
                    onClick={() => onSelect('overview')}>
                <House size={16} /> Overview
              </span>
            </li>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 d-flex align-items-center gap-2 fw-bold transition-all ${activeKey === 'files' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`} 
                    onClick={() => onSelect('files')}>
                <Images size={16} /> Files & Media
              </span>
            </li>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 d-flex align-items-center gap-2 fw-bold transition-all ${activeKey === 'teams' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`} 
                    onClick={() => onSelect('teams')}>
                <People size={16} /> Teams Network
              </span>
            </li>
            <li className="nav-item">
              <span className={`nav-link cursor-pointer py-3 px-4 d-flex align-items-center gap-2 fw-bold transition-all ${activeKey === 'activity' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`} 
                    onClick={() => onSelect('activity')}>
                <Activity size={16} /> Activity Log
              </span>
            </li>
          </ul>
        </div>
      </Col>

      <MediaGallery 
        show={showMedia} 
        onHide={() => setShowMedia(false)} 
        onSelect={(url) => handleUpdatePhoto(url)} 
      />

      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .nav-link:hover { color: #624bff !important; }
        .nav-link { border-bottom: 3px solid transparent; }
      `}</style>
    </Row>
  );
};

export default ProfileHeader;
