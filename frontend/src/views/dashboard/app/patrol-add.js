import React, { useEffect, useState } from 'react';
import { Image, Form, Button, Modal, FormControl } from 'react-bootstrap';
import avatars6 from '../../../assets/images/avatars/avtar_5.webp';
import { submitPatrol } from '../../../services/patrol';

const PatrolForm = ({ refresh, handleClose, handleShow, show, mode, patrolToEdit }) => {

   const [formData, setFormData] = useState({
      _id: patrolToEdit._id || '',
      supervisor: {
         name: patrolToEdit.supervisor?.name || '',
         email: patrolToEdit.supervisor?.email || '',
         password: patrolToEdit.supervisor?.password || '',
         rank: patrolToEdit.supervisor?.rank || ''
      },
      status: patrolToEdit.status || '',
      location: patrolToEdit.location || '',
      teamMembers: Array.isArray(patrolToEdit.teamMembers) ? patrolToEdit.teamMembers.join(', ') : patrolToEdit.teamMembers || '',
      assignedMissions: patrolToEdit.assignedMissions || []
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.startsWith('supervisor.')) {
         setFormData(prevFormData => ({
            ...prevFormData,
            supervisor: {
               ...prevFormData.supervisor,
               [name.split('.')[1]]: value
            }
         }));
      } else {
         setFormData({
            ...formData,
            [name]: value
         });
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const dataToSubmit = {
         ...formData,
         teamMembers: formData.teamMembers.split(',').map(member => member.trim())
      };
      await submitPatrol(dataToSubmit, mode);
      handleClose();
      refresh();
   };

   useEffect(() => {
      setFormData({
         _id: patrolToEdit._id || '',
         supervisor: {
            name: patrolToEdit.supervisor?.name || '',
            email: patrolToEdit.supervisor?.email || '',
            password: patrolToEdit.supervisor?.password || '',
            rank: patrolToEdit.supervisor?.rank || ''
         },
         status: patrolToEdit.status || '',
         location: patrolToEdit.location || '',
         teamMembers: Array.isArray(patrolToEdit.teamMembers) ? patrolToEdit.teamMembers.join(', ') : patrolToEdit.teamMembers || '',
         assignedMissions: patrolToEdit.assignedMissions || []
      });
   }, [patrolToEdit]);

   return (
      <>
         <div>
            <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} size="lg">
               <form encType='multipart/form-data' onSubmit={handleSubmit}>
                  <Modal.Header closeButton>
                     {mode === "create"
                        ? <Modal.Title>Add new patrol</Modal.Title>
                        : <Modal.Title>Edit patrol</Modal.Title>
                     }
                  </Modal.Header>
                  <Modal.Body>
                     <div className="new-patrol-info">
                        <div className="row">
                           <div className="profile-img-edit position-relative col-md-2 mb-4">
                              <Image className="lazyload theme-color-yellow-img profile-pic rounded avatar-100" src={avatars6} alt="profile-pic" />
                           </div>
                           <FormControl type='hidden' name='_id' value={formData._id} onChange={handleChange} />
                           <Form.Group className="col-md-10 form-group">
                              <Form.Label htmlFor="supervisorName">Supervisor Name:</Form.Label>
                              <Form.Control value={formData.supervisor.name} onChange={handleChange} type="text" id="supervisorName" name="supervisor.name" placeholder="Supervisor Name" required />
                           </Form.Group>
                           <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="supervisorEmail">Supervisor Email:</Form.Label>
                              <Form.Control value={formData.supervisor.email} onChange={handleChange} type="email" name="supervisor.email" id="supervisorEmail" placeholder="Supervisor Email" required />
                           </Form.Group>
                           <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="supervisorPassword">Supervisor Password:</Form.Label>
                              <Form.Control type="password" value={formData.supervisor.password} onChange={handleChange} name="supervisor.password" id="supervisorPassword" placeholder="Supervisor Password" required />
                           </Form.Group>
                           <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="supervisorRank">Supervisor Rank:</Form.Label>
                              <Form.Control value={formData.supervisor.rank} onChange={handleChange} type="text" name="supervisor.rank" id="supervisorRank" placeholder="Supervisor Rank" required />
                           </Form.Group>
                           <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="status">Status:</Form.Label>
                              <select name="status" value={formData.status} onChange={handleChange} id="status" className="selectpicker form-control" data-style="py-0" required>
                                 <option value="">Select status</option>
                                 <option value="standby">Standby</option>
                                 <option value="on_mission">On Mission</option>
                                 <option value="off_duty">Off Duty</option>
                              </select>
                           </Form.Group>
                           <Form.Group className="col-md-12 form-group">
                              <Form.Label htmlFor="location">Location:</Form.Label>
                              <Form.Control value={formData.location} onChange={handleChange} type="text" name="location" id="location" placeholder="Location" required />
                           </Form.Group>
                           <Form.Group className="col-md-12 form-group">
                              <Form.Label htmlFor="teamMembers">Team Members:</Form.Label>
                              <Form.Control value={formData.teamMembers} onChange={handleChange} type="text" name="teamMembers" id="teamMembers" placeholder="Team Members (comma-separated)" required />
                           </Form.Group>
                        </div>
                     </div>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button type="button" variant="secondary" onClick={handleClose}>Close</Button>
                     <Button type="submit" variant="primary">Save Changes</Button>
                  </Modal.Footer>
               </form>
            </Modal>
         </div>
      </>
   )
}
export default PatrolForm;
