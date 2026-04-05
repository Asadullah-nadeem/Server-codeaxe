import { useState } from 'react';
import { Col, Row, Container, Tab, Nav, Card, Table, Badge, Button } from 'react-bootstrap';
import { PageHeading } from 'widgets'
import {
  AboutMe,
  ActivityFeed,
  MyTeam,
  ProfileHeader,
  ProjectsContributions
} from 'sub-components'
import { FileText, Users, Activity, Layout, ExternalLink } from 'react-feather';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="User Profile Context"/>

      {/* Profile Header (Centralized Navigation) */}
      <div className="mb-6">
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
                <Card className="border-0 shadow-sm mb-6">
                  <Card.Header className="bg-white py-3 border-bottom-0">
                    <h4 className="mb-0">Access Library</h4>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive className="text-nowrap mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Asset Name</th>
                          <th>Extension</th>
                          <th>Last Synchronized</th>
                          <th>Access</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Architecture_Framework.pdf', ext: 'PDF', date: 'Oct 12, 2023', size: '2.4 MB' },
                          { name: 'System_Logs_Final.log', ext: 'LOG', date: 'Oct 15, 2023', size: '1.1 MB' },
                          { name: 'Brand_Identity_Assets.zip', ext: 'ZIP', date: 'Oct 20, 2023', size: '15.8 MB' },
                          { name: 'Deployment_Script_V2.sh', ext: 'SH', date: 'Nov 02, 2023', size: '45 KB' }
                        ].map((file, i) => (
                          <tr key={i}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <FileText className="text-primary" size={18} />
                                <span className="fw-bold">{file.name}</span>
                              </div>
                            </td>
                            <td><Badge bg="light" text="dark" className="border">{file.ext}</Badge></td>
                            <td className="text-muted">{file.date}</td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                <ExternalLink size={12} className="me-1" /> View Asset
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 text-center py-3">
                    <Button variant="link" href="/cms/media" className="text-decoration-none small fw-bold p-0">Configure Library in Media Center &rarr;</Button>
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