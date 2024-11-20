import React, { useEffect, useState } from 'react';
import Card from '../../../components/Card';
import { Row, Col, Button, Modal, Form, Table, Dropdown, ButtonGroup, FormCheck, Image } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import '../../../../node_modules/leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from '../../../assets/images/vectormap/marker1.png';
import globalConfig from '../../../services/config';
import axios from 'axios';
import './map-style.css';
import PatrolListShow from './patrol-list-show';
import { success, errorAlert } from '../../../services/alerts';
import 'lazysizes';

const LocationMarkers = ({ refresh, markers, setMarkers }) => {
    const [show, setShow] = useState(false);
    const [urgence, setUrgence] = useState({});
    const map = useMap();

    const handleClose = () => setShow(false);
    const handleShow = async (latlng) => {
        if (typeof latlng.lat === 'number' && typeof latlng.lng === 'number') {
            await refreshData(latlng);
            setShow(true);
        } else {
            console.error('Invalid latlng:', latlng);
        }
    };
    

    const refreshData = async (latlng) => {
        try {
            const response = await axios.get(`${globalConfig.BACKEND_URL}/api/urgences/find-urgence/${latlng.lat}/${latlng.lng}`);
            setUrgence(response.data);
        } catch (error) {
            console.error('Failed to fetch urgence data:', error);
            // Optionally set urgence to a safe default state or handle the error visually
        }
    };
    

    useEffect(() => {
        const socket = io.connect(globalConfig.BACKEND_URL);
        socket.on('notification', (data) => {
            const newMarker = [data.urgence.longitude, data.urgence.latitude];
            setMarkers((prevValue) => [...prevValue, newMarker]);
            L.circle(newMarker, { radius: 5000, color: "red" }).addTo(map);
            refresh();
        });

        socket.on('refresh', async (data) => {
            await refresh();
            await refreshData(data.data);
        });

        return () => socket.disconnect();
    }, [refresh, setMarkers, map, refreshData]);

    let DefaultIcon = L.icon({
        iconUrl: icon,
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    });
    
    L.Marker.prototype.options.icon = DefaultIcon;

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Urgence</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
                        <div style={{ backgroundColor: "lightgrey", width: "fit-content", padding: '10px' }}>
                            <h3>Latitude</h3>
                            <h5>{urgence.longitude}</h5>
                            <h3>Longitude</h3>
                            <h5>{urgence.latitude}</h5>
                            <h5>Phone number</h5>
                            <p>{urgence.tel}</p>
                            <p>{urgence.nomprenom}</p>
                            <h5>Age</h5>
                            <p>{urgence.age}</p>
                            <h5>Starting point</h5>
                            <p>{urgence.depart}</p>
                            <h5>Level of emergency</h5>
                            <p>{urgence.niveau}</p>
                            <h5>Other informations</h5>
                            <p>{urgence.other}</p>
                        </div>
                        <div>
                            <h5>Type of emergency</h5>
                            <p>{urgence.type}</p>
                            <h5>Boat size</h5>
                            <p>{urgence.taille}</p>
                            <h5>Number of person</h5>
                            <p>{urgence.nbrpersonne}</p>
                            <h5>Status</h5>
                            <p>{urgence.status}</p>
                            <h5>Distance traveled</h5>
                            <p>{urgence.distance}</p>
                            <h5>Communication</h5>
                            <p>{urgence.communication}</p>
                            <h5>Police</h5>
                            <p>{urgence.police}</p>
                            <Image src='' alt="Urgence" />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Group>
                        <Form.Control type="email" placeholder='Email' />
                    </Form.Group>
                    <Button variant="primary" onClick={handleClose}>
                        Envoyer
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {markers.map((marker, key) => (
    <Marker key={key} position={[marker[0], marker[1]]} eventHandlers={{ click: (e) => handleShow(e.latlng) }} />
    ))}

        </>
    );
};

const Google = () => {
    const [showPatrolList, setShowPatrolList] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [urgences, setUrgences] = useState([]);
    const [selectedDepart, setSelectedDepart] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [enclosed, setEnclosed] = useState('All');
    const [markers, setMarkers] = useState([]);
    

    
    const departOptions = ['All', 'la Goulette', 'Radès', 'Sousse', 'Gabès', 'Zarzis', 'Sfax'];
    const statusOptions = ['All', 'Unconscious', 'Critical condition', 'Injured', 'Difficulty breathing', 'Severe bleeding', 'Choking', 'Cardiac arrest', 'Allergic reaction', 'Overdose'];
    const niveauOptions = ['All', 1, 2, 3, 4, 5];

    const refresh = () => {
        const params = new URLSearchParams();
        if (selectedDepart && selectedDepart !== "All") params.set('depart', selectedDepart);
        if (selectedStatus && selectedStatus !== "All") params.set('status', selectedStatus);
        if (selectedNiveau && selectedNiveau !== "All") params.set('niveau', selectedNiveau);
        params.set('cloture', false);  // Only fetch missions where cloture is false

        axios.get(`${globalConfig.BACKEND_URL}/api/urgences/find-all?${params.toString()}`)
            .then((response) => {
                console.log('Marker data:', response.data);  // Log the marker data for debugging
                setUrgences(response.data);
                setMarkers(response.data.map(item => [item.latitude, item.longitude]));  // Ensure correct coordinate order
            }).catch(error => {
                console.error('Error fetching urgences:', error);  // Log any errors during the fetch
            });
    };
    

    useEffect(() => {
        refresh();
    }, [selectedDepart, selectedStatus, enclosed, selectedNiveau]);

    // Google.js
    
      
    const handlePatrolAssignment = async (patrolId) => {
        if (!selectedItem) {
            errorAlert('No mission selected');  // Alert if no mission is selected
            return;  
        }
        try {
            const response = await axios.post(
                `${globalConfig.BACKEND_URL}/api/patrols/assign/${patrolId}/${selectedItem._id}`
            );
            if (response.status === 200) {
                success('Mission assigned successfully!');
                setShowPatrolList(false);
                refresh();  // Refresh the data to show updated assignments
            } else {
                errorAlert('Failed to assign mission');  // General fallback error message
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                errorAlert('This mission has already been assigned to this patrol.');  // Specific error message for duplicate assignment
            } else {
                errorAlert('Failed to assign mission');  // General error message for other errors
            }
            console.error('Error in assigning mission:', error);
        }
    };
    


    const assignToPatrol = (item) => {
        setSelectedItem(item);
        setShowPatrolList(true);
    };

    return (
        <div>
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <h4 className="card-title">Map</h4>
                        </Card.Header>
                        <Card.Body>
                            <MapContainer center={[36.96021, 10.319944]} zoom={5} style={{ width: '100%', height: '520px' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarkers refresh={refresh} markers={markers} setMarkers={setMarkers} />
                            </MapContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="12">
                    <Row>
                        <Col sm="8">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <h4 className="card-title">SOS</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="bd-example table-responsive">
                                        <Table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Lng & lat</th>
                                                    <th scope="col">Type</th>
                                                    <th scope="col">Level</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Assign</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {urgences.map((item, key) => (
                                                    <tr key={key}>
                                                        <td>{item.longitude}, {item.latitude}</td>
                                                        <td>{item.type}</td>
                                                        <td>{item.niveau}</td>
                                                        <td>{item.status}</td>
                                                        <td>
                                                            <Button onClick={() => assignToPatrol(item)}>Assign to Patrol</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm="4">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <h4 className="card-title">Filters</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Emergency starting point:</label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup}>
                                                    <Button variant="primary">{selectedDepart || "All"}</Button>
                                                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                                                    <Dropdown.Menu>
                                                        {departOptions.map((option, key) => (
                                                            <Dropdown.Item key={key} onClick={() => setSelectedDepart(option)}>{option}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Emergency level:</label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup}>
                                                    <Button variant="primary">{selectedNiveau || "All"}</Button>
                                                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                                                    <Dropdown.Menu>
                                                        {niveauOptions.map((option, key) => (
                                                            <Dropdown.Item key={key} onClick={() => setSelectedNiveau(option)}>{option}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Emergency status:</label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup}>
                                                    <Button variant="primary">{selectedStatus || "All"}</Button>
                                                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                                                    <Dropdown.Menu>
                                                        {statusOptions.map((option, key) => (
                                                            <Dropdown.Item key={key} onClick={() => setSelectedStatus(option)}>{option}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Enclosed:</label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup}>
                                                    <Button variant="primary">{enclosed}</Button>
                                                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => setEnclosed('All')}>All</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setEnclosed('open')}>open</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setEnclosed('close')}>close</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-12 d-flex justify-content-center'>
                                                <Button onClick={refresh}>Filter</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal show={showPatrolList} onHide={() => setShowPatrolList(false)} backdrop="static" keyboard={false} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Assign Patrol</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PatrolListShow selectedItem={selectedItem} setShowPatrolList={setShowPatrolList} onAssignMission={handlePatrolAssignment} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Google;
