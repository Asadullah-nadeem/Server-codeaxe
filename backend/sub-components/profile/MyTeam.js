// import node module libraries
import Link from "next/link";
import { Card, Image, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { fetchApi } from "utils/api";

const MyTeam = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
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
    fetchAdmins();
  }, []);

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
        <Card.Title as="h4">My Team</Card.Title>
        {admins.length === 0 ? (
          <p className="text-muted small">No other team members found.</p>
        ) : (
          admins.map((admin, index) => (
            <div className="d-flex justify-content-between align-items-center mb-4" key={index}>
              <div className="d-flex align-items-center">
                <div>
                  <Image
                    src={`/images/avatar/avatar-${(index % 10) + 1}.jpg`}
                    className="rounded-circle avatar-md"
                    alt=""
                  />
                </div>
                <div className="ms-3">
                  <h5 className="mb-1">{admin.name}</h5>
                  <p className="text-muted mb-0 fs-5 text-uppercase">
                    {admin.role}
                  </p>
                </div>
              </div>
              <div>
                <Link href={`mailto:${admin.email}`} className="text-muted text-primary-hover me-3">
                  <i className="fe fe-mail fs-4"></i>
                </Link>
              </div>
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default MyTeam;
