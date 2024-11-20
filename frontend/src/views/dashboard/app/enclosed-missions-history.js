import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Modal, Card } from 'react-bootstrap';
import axios from 'axios';
import globalConfig from '../../../services/config';
import moment from 'moment'; // Add this line if you want to format the date

const EnclosedMissionsHistory = () => {
  const [missions, setMissions] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  const fetchEnclosedMissions = async () => {
    try {
      const response = await axios.get(`${globalConfig.BACKEND_URL}/api/urgences/find-all?cloture=true`);
      setMissions(response.data);
    } catch (error) {
      console.error('Failed to fetch missions:', error);
    }
  };

  useEffect(() => {
    fetchEnclosedMissions();
  }, []);

  const handleShowDetails = (mission) => {
    setSelectedMission(mission);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMission(null);
  };

  return (
    <div>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Enclosed Missions History</h4>
            </Card.Header>
            <Card.Body className="px-0">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Lng & Lat</th>
                    <th>Type</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Enclosed by</th>
                    <th>Signal Time</th>
                    <th>Enclosure Time</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {missions.map((mission, idx) => (
                    <tr key={idx}>
                      <td>{mission.longitude}, {mission.latitude}</td>
                      <td>{mission.type}</td>
                      <td>{mission.niveau}</td>
                      <td>{mission.status}</td>
                      <td>{mission.police}</td>
                      <td>{moment(mission.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                      <td>{moment(mission.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                      <td>
                        <Button variant="info" onClick={() => handleShowDetails(mission)}>
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedMission && (
        <Modal show={showDetails} onHide={handleCloseDetails} centered>
          <Modal.Header closeButton>
            <Modal.Title>Mission Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Longitude:</strong> {selectedMission.longitude}</p>
            <p><strong>Latitude:</strong> {selectedMission.latitude}</p>
            <p><strong>Type:</strong> {selectedMission.type}</p>
            <p><strong>Level:</strong> {selectedMission.niveau}</p>
            <p><strong>Status:</strong> {selectedMission.status}</p>
            <p><strong>Number of People:</strong> {selectedMission.nbrpersonne}</p>
            <p><strong>Starting Point:</strong> {selectedMission.depart}</p>
            <p><strong>Communication:</strong> {selectedMission.communication}</p>
            <p><strong>Police:</strong> {selectedMission.police}</p>
            <p><strong>Report:</strong> {selectedMission.other}</p>
            <p><strong>Creation Time:</strong> {moment(selectedMission.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
            <p><strong>Enclosure Time:</strong> {moment(selectedMission.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default EnclosedMissionsHistory;
