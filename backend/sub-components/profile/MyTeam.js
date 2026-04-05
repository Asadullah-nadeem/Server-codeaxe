// import node module libraries
import Link from "next/link";
import { Card, Image, Spinner, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState, useEffect } from "react";
import { fetchApi } from "utils/api";
import MediaGallery from "../../components/MediaGallery";
import { Camera } from "react-bootstrap-icons";

const MyTeam = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMedia, setShowMedia] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/admin/list");
      if (data.success) {
        setAdmins(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admins", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleUpdateAdminPhoto = async (photoUrl) => {
    if (!selectedAdmin) return;
    try {
      const res = await fetchApi(`/admin/update/${selectedAdmin.id}`, {
        method: 'PUT',
        body: JSON.stringify({ photo: photoUrl })
      });
      if (res.success) {
        setAdmins(admins.map(a => a.id === selectedAdmin.id ? { ...a, photo: photoUrl } : a));
        setShowMedia(false);
        setSelectedAdmin(null);
      }
    } catch (error) {
      console.error("Failed to update admin photo", error);
    }
  };

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title as="h4">Internal Administrative Network</Card.Title>
        {admins.length === 0 ? (
          <p className="text-muted small">No other team members found.</p>
        ) : (
          admins.map((admin, index) => (
            <div className="d-flex justify-content-between align-items-center mb-4" key={index}>
              <div className="d-flex align-items-center">
                <div className="position-relative group">
                  <Image
                    src={admin.photo || `/images/avatar/avatar-${(index % 10) + 1}.jpg`}
                    className="rounded-circle avatar-md object-fit-cover"
                    alt=""
                    style={{ width: '48px', height: '48px', backgroundPosition: 'center top' }}
                  />
                  {typeof window !== 'undefined' && localStorage.getItem('admin_email') === admin.email && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50 rounded-circle opacity-0 group-hover-opacity-100 transition-all cursor-pointer"
                         onClick={() => { setSelectedAdmin(admin); setShowMedia(true); }}>
                      <Camera size={14} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="ms-3">
                  <h5 className="mb-1">{admin.name}</h5>
                  <p className="text-muted mb-0 fs-5 text-uppercase">
                    {admin.role}
                  </p>
                </div>
              </div>
              <div>
                <OverlayTrigger placement="top" overlay={<Tooltip>Email {admin.name}</Tooltip>}>
                  <Link href={`mailto:${admin.email}`} className="text-muted text-primary-hover me-3">
                    <i className="fe fe-mail fs-4"></i>
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
          ))
        )}
      </Card.Body>

      <MediaGallery 
        show={showMedia} 
        onHide={() => { setShowMedia(false); setSelectedAdmin(null); }} 
        onSelect={(url) => handleUpdateAdminPhoto(url)} 
      />

      <style jsx>{`
        .group:hover .group-hover-opacity-100 { opacity: 1 !important; }
        .group-hover-opacity-100 { opacity: 0; transition: opacity 0.2s; }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </Card>
  );
};

export default MyTeam;
