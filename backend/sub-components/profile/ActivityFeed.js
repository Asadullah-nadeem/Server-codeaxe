// import node module libraries
import { Row, Col, Card, Image, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { fetchApi } from "utils/api";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await fetchApi("/admin/contact/submissions");
        if (data.success) {
          // Take the last 5 submissions as recent activities
          setActivities(data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
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
    <Row>
      <Col xs={12}>
        <Card>
          <Card.Body>
            <Card.Title as="h4">Activity Feed</Card.Title>
            {activities.length === 0 ? (
              <p className="text-muted small">No recent activity found.</p>
            ) : (
              activities.map((item, index) => (
                <div className="d-flex mb-5" key={index}>
                  <div>
                    <Image
                      src={`/images/avatar/avatar-${(index % 10) + 5}.jpg`}
                      className="rounded-circle avatar-md"
                      alt=""
                    />
                  </div>
                  <div className="ms-3">
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="text-muted mb-2">
                      Sent a new contact message: "{item.message.substring(0, 50)}..."
                    </p>
                    <p className="fs-6 mb-0 text-muted">{new Date(item.submitted_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ActivityFeed;
