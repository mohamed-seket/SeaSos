import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from '../../../components/Card';
import { fetchData } from '../../../services/mix';
import globalConfig from '../../../services/config';

const BoatList = () => {
   const [boatList, setBoatList] = useState([]);
   const [selectedBoat, setSelectedBoat] = useState(null);
   const [showModal, setShowModal] = useState(false);

   const refresh = () => {
      fetchData(`${globalConfig.BACKEND_URL}/api/boats/find-all`)
         .then(response => {
            if (Array.isArray(response)) {
               setBoatList(response);
            } else {
               setBoatList([]);
            }
         })
         .catch(error => {
            console.error("Error fetching boat list:", error);
            setBoatList([]);
         });
   };

   useEffect(() => {
      refresh();
   }, []);

   const handleShowModal = (boat) => {
      setSelectedBoat(boat);
      setShowModal(true);
   };

   const handleCloseModal = () => {
      setShowModal(false);
      setSelectedBoat(null);
   };

   return (
      <div>
         <Row>
            <Col sm="12">
               <Card>
                  <Card.Header className="d-flex justify-content-between">
                     <div className="header-title">
                        <h4 className="card-title">Boat List</h4>
                     </div>
                  </Card.Header>
                  <Card.Body className="px-0">
                     <div className="table-responsive">
                        <table id="boat-list-table" className="table table-striped" role="grid" data-toggle="data-table">
                           <thead>
                              <tr className="ligth">
                                 <th>Serial Number</th>
                                 <th>Name</th>
                                 <th>Owner Name</th>
                                 <th>Phone Number</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {boatList.map((item, idx) => (
                                 <tr key={idx}>
                                    <td>{item.serialNumber}</td>
                                    <td>{item.name}</td>
                                    <td>{item.owner.name}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>
                                       <div className="flex align-items-center list-boat-action">
                                          <Button
                                             variant="info"
                                             size="sm"
                                             onClick={() => handleShowModal(item)}
                                             data-toggle="tooltip"
                                             data-placement="top"
                                             title="Details"
                                             data-original-title="Details"
                                          >
                                             Details
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Modal for Boat Details */}
         <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>Boat Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {selectedBoat && (
                  <div>
                     <p><strong>Serial Number:</strong> {selectedBoat.serialNumber}</p>
                     <p><strong>Name:</strong> {selectedBoat.name}</p>
                     <p><strong>Owner Name:</strong> {selectedBoat.owner.name}</p>
                     <p><strong>Owner Email:</strong> {selectedBoat.owner.email}</p>
                     <p><strong>Phone Number:</strong> {selectedBoat.phoneNumber}</p>
                     <p><strong>Passenger Number:</strong> {selectedBoat.passengerNumber}</p>
                     <p><strong>Departure Port:</strong> {selectedBoat.departurePort}</p>
                     <p><strong>Destination:</strong> {selectedBoat.destination}</p>
                     <p><strong>Departure Day:</strong> {selectedBoat.departureDay}</p>
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseModal}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default BoatList;
