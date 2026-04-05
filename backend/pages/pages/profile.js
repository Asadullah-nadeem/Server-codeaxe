import { useState } from 'react';
import { Col, Row, Container, Tab, Nav, Card, Table, Badge, Button } from 'react-bootstrap';
import { PageHeading } from 'widgets'
import {
  AboutMe,
  ActivityFeed,
  MyTeam,
  ProfileHeader,
  ProjectsContributions,
  AccessLibrary
} from 'sub-components'
import { FileText, Users, Activity, HardDrive, ExternalLink } from 'react-feather';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="User Profile Context"/>

      {/* Profile Header (Centralized Navigation) */}
      <div className="mb-6 shadow-sm rounded">
        <ProfileHeader activeKey={activeTab} onSelect={setActiveTab} />
      </div>

      {/* Content Sections - Controlled by Header State */}
      <Tab.Container id="profile-tabs" activeKey={activeTab}>
        <Row>
          <Col lg={12}>
            <Tab.Content>
              {/* OVERVIEW TAB */}
              <Tab.Pane eventKey="overview">
                <Row>
                  <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                    <AboutMe />
                  </Col>
                  <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                    <ProjectsContributions />
                  </Col>
                </Row>
              </Tab.Pane>

              {/* FILES TAB */}
              <Tab.Pane eventKey="files">
                <Card className="border-0 shadow-sm mb-6 pb-2">
                  <Card.Header className="bg-white py-4 border-bottom-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 bg-light-primary rounded-3 text-primary d-flex align-items-center">
                        <HardDrive size={20} />
                      </div>
                      <h4 className="mb-0 fw-bold">Distributed Management System (DMS) Resources</h4>
                    </div>
                    <Button variant="outline-primary" size="sm" onClick={() => (window.location.href='/cms/media')}>
                      <ExternalLink size={14} className="me-2" /> Media Dashboard
                    </Button>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <AccessLibrary />
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 text-center py-4">
                    <p className="text-muted small mb-0">Synchronized with <span className="fw-bold">AWS S3 BUCKET</span> and <span className="fw-bold text-primary">Imagekit Cloud Optimization</span> servers.</p>
                  </Card.Footer>
                </Card>
              </Tab.Pane>

              {/* TEAMS TAB */}
              <Tab.Pane eventKey="teams">
                <Row>
                  <Col xl={12} lg={12} md={12} xs={12} className="mb-6">
                    <MyTeam title="Internal Administrative Network" />
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ACTIVITY TAB */}
              <Tab.Pane eventKey="activity">
                <Row>
                  <Col xl={8} lg={12} md={12} xs={12} className="mb-6">
                    <ActivityFeed title="System-Wide Event Log" />
                  </Col>
                  <Col xl={4} lg={12} md={12} xs={12} className="mb-6">
                     <Card className="border-0 shadow-sm bg-primary text-white">
                        <Card.Body className="p-5">
                          <h4 className="text-white mb-3">Your Role: <strong>Administrative Elite</strong></h4>
                          <p className="text-white text-opacity-75 mb-0">You have authorized access to all CMS modules, portfolio deployment, and administrative settings. Ensure system integrity before executing global changes.</p>
                        </Card.Body>
                     </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

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
    </Container>
  )
}

export default Profile;