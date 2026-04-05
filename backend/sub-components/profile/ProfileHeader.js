import { useState, useEffect } from "react";
import Link from "next/link";
import { Col, Row, Image, Spinner, Button } from "react-bootstrap";
import { fetchApi } from "utils/api";
import MediaGallery from "../../components/MediaGallery";
import { Camera } from "react-bootstrap-icons";

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
            <div className="d-flex align-items-center">
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-center align-items-center mt-n10 rounded-circle border border-4 border-white shadow-lg text-white fw-bold fs-1" 
                   style={{ 
                     width: '8.5rem', 
                     height: '8.5rem', 
                     background: profile?.photo ? `url(${profile.photo}) no-repeat center center` : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                     backgroundSize: 'cover',
                     backgroundPosition: 'center top',
                     boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
                     position: 'relative',
                     overflow: 'hidden'
                   }}>
                {!profile?.photo && <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{getInitials(adminName)}</span>}
                
                <div className="position-absolute bottom-0 end-0 mb-3 me-3" style={{ zIndex: 10 }}>
                   <div 
                    className="p-2 cursor-pointer bg-primary text-white rounded-circle shadow-lg hover-scale transition-all d-flex align-items-center justify-content-center border border-2 border-white" 
                    onClick={() => setShowMedia(true)}
                    style={{ width: '42px', height: '42px' }}
                    title="Change Profile Image"
                   >
                     <Camera size={18} />
                   </div>
                </div>
              </div>
              {/* text */}
              <div className="lh-1 ms-3 mt-3">
                <h2 className="mb-0 d-flex align-items-center gap-2">
                  {adminName}
                  <span className="badge bg-light-primary text-primary px-3 py-1 rounded-pill" style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{profile?.role || 'Admin'}</span>
                  <Link
                    href="#!"
                    data-bs-toggle="tooltip"
                    data-placement="top"
                    title="Verified Account"
                    className="d-flex align-items-center"
                  >
                    <Image
                      src="/images/svg/checked-mark.svg"
                      alt=""
                      height="20"
                      width="20"
                    />
                  </Link>
                </h2>
                <p className="mb-0 d-block text-muted mt-2 fw-medium opacity-75">
                  <span className="text-primary fw-bold">@{adminUsername}</span> / {profile?.email}
                </p>
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

      <MediaGallery 
        show={showMedia} 
        onHide={() => setShowMedia(false)} 
        onSelect={(url) => handleUpdatePhoto(url)} 
      />

      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </Row>
  );
};

export default ProfileHeader;
