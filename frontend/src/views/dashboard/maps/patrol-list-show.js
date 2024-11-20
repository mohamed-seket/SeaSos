import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import Card from '../../../components/Card';
import { fetchData } from '../../../services/mix';
import globalConfig from '../../../services/config';

const PatrolListShow = ({ selectedItem, onAssignMission, setShowPatrolList }) => {
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [selectedPatrol, setSelectedPatrol] = useState(null);
   const [patrollist, setPatrollist] = useState([]);

   const statusStyles = {
      standby: { backgroundColor: 'green', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
      on_mission: { backgroundColor: 'blue', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
      off_duty: { backgroundColor: 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }
   };

   const handleCloseAssignModal = () => setShowAssignModal(false);
   const handleShowAssignModal = () => setShowAssignModal(true);

   const refresh = () => {
      fetchData(`${globalConfig.BACKEND_URL}/api/patrols/`)
         .then(response => {
            setPatrollist(response);
         });
   }

   useEffect(() => {
      refresh();
   }, []);

   const handleAssignment = () => {
      if (selectedPatrol && onAssignMission) {
         onAssignMission(selectedPatrol._id);
         handleCloseAssignModal();
      }
   };

   return (
      <>
         <div>
            <Row>
               <Col sm="12">
                  <Card>
                     <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                           <h4 className="card-title">Patrol List</h4>
                        </div>
                     </Card.Header>
                     <Card.Body className="px-0">
                        <div className="table-responsive">
                           <table id="patrol-list-table" className="table table-striped" role="grid" data-toggle="data-table">
                              <thead>
                                 <tr className="light">
                                    <th>Supervisor Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Team Members</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    patrollist.map((item, idx) => (
                                       <tr key={idx}>
                                          <td>{item.supervisor.name}</td>
                                          <td>{item.supervisor.email}</td>
                                          <td>
                                             <div style={statusStyles[item.status]}></div>
                                             {item.status}
                                          </td>
                                          <td>{item.location}</td>
                                          <td>{item.teamMembers.join(', ')}</td>
                                          <td>
                                             <Button
                                                onClick={() => {
                                                   setSelectedPatrol(item);
                                                   handleShowAssignModal();
                                                }}
                                                className="btn btn-sm btn-primary"
                                             >
                                                Assign
                                             </Button>
                                          </td>
                                       </tr>
                                    ))
                                 }
                              </tbody>
                           </table>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>

         {/* Modal to display patrol details */}
         <Modal show={showAssignModal} onHide={handleCloseAssignModal} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>Assign Patrol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {selectedPatrol ? (
                  <div>
                     <h5>Supervisor Name: {selectedPatrol.supervisor.name}</h5>
                     <p>Email: {selectedPatrol.supervisor.email}</p>
                     <p>Status: {selectedPatrol.status}</p>
                     <p>Location: {selectedPatrol.location}</p>
                     <p>Team Members: {selectedPatrol.teamMembers.join(', ')}</p>
                  </div>
               ) : (
                  <p>No details available.</p>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseAssignModal}>
                  Close
               </Button>
               <Button variant="primary" onClick={handleAssignment}>
                  Confirm Assignment
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   )
}

export default PatrolListShow;
